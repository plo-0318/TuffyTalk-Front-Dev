import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useEffect, useState } from 'react';

import useHttp from '../../../hooks/use-http';
import { sendHttp } from '../../../utils/sendHttp';
import { API_URL, PROXY_API_URL, RESOURCE_URL } from '../../../utils/config';

import './Editor.css';

// props = useProxy, containerHeight, submitHandler

const TextEditor = (props) => {
  const { sendRequest: deleteTempUpload } = useHttp(sendHttp);

  useEffect(() => {
    return () => {
      const submitOptions = {
        path: '/user-actions/delete-temp-upload',
        useProxy: false,
        options: {
          method: 'DELETE',
          credentials: 'include',
        },
      };

      deleteTempUpload(submitOptions);
    };
  }, [deleteTempUpload]);

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();

          loader.file.then((file) => {
            body.append('image', file);

            const options = {
              method: 'POST',
              credentials: 'include',
              body,
            };

            const url = props.useProxy ? PROXY_API_URL : API_URL;

            fetch(`${url}/user-actions/post-image`, options)
              .then((res) => res.json())
              .then((data) => {
                resolve({
                  default: `${RESOURCE_URL}/${data.path}`,
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      },
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  const changeHandler = (event, editor) => {
    props.onChange(editor.getData());
  };

  return (
    <div className={'editor-container'}>
      <CKEditor
        config={{
          extraPlugins: [uploadPlugin],
          toolbar: [
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'imageUpload',
            'undo',
            'redo',
          ],
        }}
        editor={ClassicEditor}
        onReady={props.onEditorReady}
        onBlur={(event, editor) => {}}
        onFocus={(event, editor) => {}}
        onChange={changeHandler}
      />
      <button className='editor_submit-btn' onClick={props.submitHandler}>
        Submit
      </button>
    </div>
  );
};

export default TextEditor;
