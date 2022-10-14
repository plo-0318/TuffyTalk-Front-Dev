import { Fragment } from 'react';
import ReactDOM from 'react-dom';

import { UilExclamationTriangle } from '@iconscout/react-unicons';

import classes from './ConfirmModal.module.css';

const Backdrop = (props) => {
  return (
    <div className={classes['modal_backdrop']} onClick={props.onClose}></div>
  );
};

const ModalOverlay = (props) => {
  const {
    message,
    onAccept,
    onDecline,
    onClose,
    declineText,
    acceptText,
    btnColor,
  } = props;

  let declineBtnClass;
  let acceptBtnClass;

  if (btnColor === 'default') {
    declineBtnClass = classes['decline-btn'];
    acceptBtnClass = classes['accept-btn'];
  } else {
    acceptBtnClass = classes['decline-btn'];
    declineBtnClass = classes['accept-btn'];
  }

  return (
    <div className={classes['modal-container']}>
      <div className={classes['modal_header-container']}>
        <UilExclamationTriangle className={classes['icon']} />
      </div>
      <div className={classes['modal_content-container']}>
        <p>{message}</p>
      </div>
      <div className={classes['modal_btn-container']}>
        <button
          className={`${classes['btn']} ${declineBtnClass}`}
          onClick={onDecline}
        >
          {declineText}
        </button>
        <button
          className={`${classes['btn']} ${acceptBtnClass}`}
          onClick={onAccept}
        >
          {acceptText}
        </button>
      </div>
    </div>
  );
};

const ConfirmModal = (props) => {
  const {
    show,
    message,
    onAccept,
    onDecline,
    onClose,
    declineText,
    acceptText,
    btnColor,
  } = props;

  if (!show) {
    return null;
  }

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop closeModal={props.closeModal} />,
        document.getElementById('backdrop-root')
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          message={message}
          onDecline={onDecline || onClose}
          onAccept={onAccept}
          onClose={onClose}
          declineText={declineText}
          acceptText={acceptText}
          btnColor={btnColor || 'default'}
        />,
        document.getElementById('overlay-root')
      )}
    </Fragment>
  );
};

export default ConfirmModal;
