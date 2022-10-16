import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';

import useHttp from '../../../../hooks/use-http';
import { sendHttp } from '../../../../utils/sendHttp';
import Modal from '../../../ui/modal/Modal';
import TextEditor from '../../../ui/text_editor/TextEditor';

import classes from './LeaveCommentModal.module.css';

const Backdrop = (props) => {
  return (
    <div className={classes['modal_backdrop']} onClick={props.closeModal}></div>
  );
};

const ModalOverlay = (props) => {
  const params = useParams();

  const {
    closeModal: closeCommentModal,
    isEdit,
    onEditorReady,
    editData,
    onSuccess,
    fromParent,
  } = props;

  const {
    sendRequest: submitComment,
    status: submitCommentStatus,
    error: submitCommentError,
    data: commentData,
    resetState: resetSubmitComment,
  } = useHttp(sendHttp, false);

  const [editorContent, setEditorContent] = useState('');
  const [modalState, setModalState] = useState({
    show: false,
    status: 'success',
    message: '',
  });

  useEffect(() => {
    // Error creating post
    if (submitCommentStatus === 'completed' && submitCommentError) {
      setModalState({
        show: true,
        status: 'fail',
        message: submitCommentError,
      });
      resetSubmitComment();
    }

    // Successfully created post
    if (
      submitCommentStatus === 'completed' &&
      !submitCommentError &&
      commentData
    ) {
      const word = isEdit ? 'updated' : 'created';

      setModalState({
        show: true,
        status: 'success',
        message: `Comment ${word} successfully`,
      });
      resetSubmitComment();

      onSuccess();
    }
  }, [
    submitCommentStatus,
    submitCommentError,
    onSuccess,
    commentData,
    isEdit,
    resetSubmitComment,
  ]);

  const editorChangeHandler = (content) => {
    setEditorContent(content);
  };

  const editorSubmitHandler = () => {
    if (editorContent === '') {
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
    while ((img = re.exec(editorContent))) {
      images.push(img[1]);
    }

    const names = images.map((img) => img.split('/').at(-1));

    const body = {
      content: editorContent,
      images: names,
      fromPost: params.postId,
    };

    if (fromParent) {
      body.parentComment = fromParent;
    }

    let submitOptions;

    // Create new post
    if (!isEdit) {
      submitOptions = {
        path: '/user-actions/create-comment',
        useProxy: true,
        options: {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      };
    }
    // Update post
    else {
      submitOptions = {
        path: `/user-actions/update-comment/${editData.commentId}`,
        useProxy: true,
        options: {
          method: 'PATCH',
          credentials: 'include',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      };
    }

    submitComment(submitOptions);
    setModalState({ show: true, status: 'pending' });
  };

  const closeModal = () => {
    setModalState((prevState) => {
      return { ...prevState, show: false };
    });
  };

  const editorReadyHandler = (editor) => {
    if (onEditorReady) {
      onEditorReady(editor);
    }

    setEditorContent(editor.getData());
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
          <p>{isEdit ? 'Edit comment' : 'Leave a comment'}</p>
        </div>
        <hr />

        <TextEditor
          useProxy={true}
          submitHandler={editorSubmitHandler}
          onChange={editorChangeHandler}
          onEditorReady={editorReadyHandler}
        />
      </div>
    </React.Fragment>
  );
};

const LeaveCommentModal = (props) => {
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
          isEdit={isEdit}
          onEditorReady={props.onEditorReady}
          editData={props.editData}
          onSuccess={props.onSuccess}
          fromParent={props.fromParent}
        />,
        document.getElementById('overlay-root')
      )}
    </React.Fragment>
  );
};

export default LeaveCommentModal;
