import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';

import useHttp from '../../../../hooks/use-http';
import { sendHttp } from '../../../../utils/sendHttp';
import Modal from '../../../ui/modal/Modal';
import TextEditor from '../../../ui/text_editor/TextEditor';
import { camelToSpace } from '../../../../utils/util';

import classes from './CreatePostModal.module.css';

const Backdrop = (props) => {
  return (
    <div className={classes['modal_backdrop']} onClick={props.closeModal}></div>
  );
};

const ModalOverlay = (props) => {
  const {
    closeModal: closeCreatePost,
    isEdit,
    editData,
    onSuccess,
    topic,
  } = props;
  const navigate = useNavigate();

  const [postContent, setPostContent] = useState('');
  const [modalState, setModalState] = useState({
    show: false,
    status: 'success',
    message: '',
  });

  const [titleInput, setTitleInput] = useState(editData ? editData.title : '');

  const {
    sendRequest: submitPost,
    data: postData,
    status: postStatus,
    error: postError,
    resetState: resetPostState,
  } = useHttp(sendHttp, false);

  useEffect(() => {
    // Error creating post
    if (postStatus === 'completed' && postError) {
      setModalState({ show: true, status: 'fail', message: postError });
      resetPostState();
    }

    // Successfully created post
    if (postStatus === 'completed' && !postError && postData) {
      const word = isEdit ? 'updated' : 'created';

      setModalState({
        show: true,
        status: 'success',
        message: `Post ${word} successfully`,
      });
      resetPostState();

      let url;

      if (!isEdit) {
        const topicName = camelToSpace(topic)
          .toLowerCase()
          .split(' ')
          .join('-');
        url = `/topic/${topicName}/post/${postData._id}`;

        onSuccess(url);
      } else {
        onSuccess(postData);
      }
    }
  }, [
    postStatus,
    postError,
    resetPostState,
    navigate,
    closeCreatePost,
    isEdit,
    editData,
    onSuccess,
    postData,
    topic,
  ]);

  const formHeight = props.formHeight || '60rem';
  const editorHeight = `${Math.trunc(
    Number.parseFloat(formHeight, 10) * 0.75
  )}rem`;

  const postChangeHandler = (content) => {
    setPostContent(content);
  };

  const postSubmitHandler = (e) => {
    e.preventDefault();

    const title = titleInput.trim();
    let titleError = null;

    if (title.length < 3) {
      titleError = 'Title should contain at least 3 characters';
    }
    if (title.length > 50) {
      titleError = 'Title cannot exceed 50 characters';
    }

    if (titleError) {
      setModalState({ show: true, status: 'fail', message: titleError });
      return;
    }

    if (postContent === '') {
      setModalState({
        show: true,
        status: 'fail',
        message: 'Content cannot be empty',
      });

      return;
    }

    const re = /<img[^>]+src="([^">]+)/g;
    let img;
    const images = [];
    while ((img = re.exec(postContent))) {
      images.push(img[1]);
    }

    const names = images.map((img) => img.split('/').at(-1));

    const body = JSON.stringify({
      topic: topic || null,
      title,
      content: postContent,
      images: names,
    });

    let submitOptions;

    // Create new post
    if (!isEdit) {
      submitOptions = {
        path: '/user-actions/create-post',
        useProxy: true,
        options: {
          method: 'POST',
          credentials: 'include',
          body,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      };
    }
    // Update post
    else {
      submitOptions = {
        path: `/user-actions/update-post/${editData.postId}`,
        useProxy: true,
        options: {
          method: 'PATCH',
          credentials: 'include',
          body,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      };
    }

    submitPost(submitOptions);
    setModalState({ show: true, status: 'pending' });
  };

  const closeModal = () => {
    setModalState((prevState) => {
      return { ...prevState, show: false };
    });
  };

  const editorReadyHandler = (editor) => {
    if (props.onEditorReady) {
      props.onEditorReady(editor);
    }

    setPostContent(editor.getData());
  };

  return (
    <React.Fragment>
      <Modal
        show={modalState.show}
        status={modalState.status}
        message={modalState.message}
        onConfirm={closeModal}
      />
      <div className={classes['modal-container']}>
        <div className={classes['modal_header-container']}>
          <p>Create a post</p>
        </div>
        <hr />
        <form className={classes['modal-form']}>
          <div className={classes['title_input-container']}>
            <label htmlFor='title'>Title</label>
            <input
              id='title'
              type='text'
              className={`${classes['title-input']}`}
              value={titleInput}
              onChange={(e) => {
                setTitleInput(e.target.value);
              }}
            />
          </div>
          <TextEditor
            useProxy={true}
            containerHeight={editorHeight}
            submitHandler={postSubmitHandler}
            onChange={postChangeHandler}
            onEditorReady={editorReadyHandler}
          />
        </form>
      </div>
    </React.Fragment>
  );
};

const CreatePostModal = (props) => {
  if (props.show === false) {
    return null;
  }

  const isEdit = props.isEdit || false;

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop closeModal={props.closeModal} />,
        document.getElementById('backdrop-root')
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          closeModal={props.closeModal}
          formHeight={props.formHeight}
          topic={props.topic}
          isEdit={isEdit}
          onEditorReady={props.onEditorReady}
          editData={props.editData}
          onSuccess={props.onSuccess}
        />,
        document.getElementById('overlay-root')
      )}
    </React.Fragment>
  );
};

export default CreatePostModal;
