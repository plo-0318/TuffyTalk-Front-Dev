import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import LoadingSpinner from '../loading_spinner/LoadingSpinner';
import {
  UilCheckCircle,
  UilTimesCircle,
  UilTimes,
  UilHourglass,
} from '@iconscout/react-unicons';

import classes from './Modal.module.css';
import commonClasses from '../../../utils/common.module.css';

const Backdrop = (props) => {
  return (
    <CSSTransition
      in={props.show}
      mountOnEnter
      unmountOnExit
      timeout={400}
      classNames={{
        enter: '',
        enterActive: classes['backdrop-open'],
        exit: '',
        exitActive: classes['backdrop-close'],
        appear: '',
        appearActive: '',
      }}
    >
      <div
        className={classes['modal_backdrop']}
        onClick={props.onConfirm}
      ></div>
    </CSSTransition>
  );
};

const ModalOverlay = (props) => {
  let statusClasses;
  let buttonClasses = `${classes['button-container']} ${
    props.status === 'success' ? '' : classes['button-container__fail']
  }`;

  //.status-container__pending

  let statusIcon;
  if (props.status === 'success') {
    statusIcon = <UilCheckCircle className={classes['status-icon']} />;
    statusClasses = `${classes['status-container']}`;
  }
  if (props.status === 'fail') {
    statusIcon = <UilTimesCircle className={classes['status-icon']} />;
    statusClasses = `${classes['status-container']} ${classes['status-container__fail']}`;
  }
  if (props.status === 'pending') {
    statusIcon = <UilHourglass className={classes['status-icon']} />;
    statusClasses = `${classes['status-container']} ${classes['status-container__pending']}`;
  }

  return (
    <CSSTransition
      in={props.show}
      mountOnEnter
      unmountOnExit
      timeout={400}
      classNames={{
        enter: '',
        enterActive: classes['modal-open'],
        exit: '',
        exitActive: classes['modal-close'],
        appear: '',
        appearActive: '',
      }}
    >
      <div className={classes['modal-container']}>
        <div className={statusClasses}>{statusIcon}</div>
        {props.status === 'pending' ? (
          <LoadingSpinner />
        ) : (
          <React.Fragment>
            <p className={commonClasses['disable_select']}>{props.message}</p>
            <div className={buttonClasses} onClick={props.onConfirm}>
              <UilTimes className={classes['button-icon']} />
              <p>Close</p>
            </div>
          </React.Fragment>
        )}
      </div>
    </CSSTransition>
  );
};

const Modal = (props) => {
  const confirmHandler = props.status === 'pending' ? null : props.onConfirm;

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop show={props.show} onConfirm={confirmHandler} />,
        document.getElementById('backdrop-root')
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          status={props.status}
          message={props.message}
          onConfirm={confirmHandler}
          show={props.show}
        />,
        document.getElementById('overlay-root')
      )}
    </React.Fragment>
  );
};

export default Modal;

/* const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const Modal = (
    <Modal
      show={showModal}
      status={'fail'}
      message={'Dodo is too fat'}
      onConfirm={closeModal}
    />
  ); */
