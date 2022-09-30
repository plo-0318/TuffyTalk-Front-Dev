import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { UilCheckCircle } from '@iconscout/react-unicons';
import { UilTimesCircle } from '@iconscout/react-unicons';
import { UilTimes } from '@iconscout/react-unicons';

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
  const statusClasses = `${classes['status-container']} ${
    props.status === 'success' ? '' : classes['status-container__fail']
  }`;
  const buttonClasses = `${classes['button-container']} ${
    props.status === 'success' ? '' : classes['button-container__fail']
  }`;
  const statusIcon =
    props.status === 'success' ? (
      <UilCheckCircle className={classes['status-icon']} />
    ) : (
      <UilTimesCircle className={classes['status-icon']} />
    );

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
        <p className={commonClasses['disable_select']}>{props.message}</p>
        <div className={buttonClasses} onClick={props.onConfirm}>
          <UilTimes className={classes['button-icon']} />
          <p>Close</p>
        </div>
      </div>
    </CSSTransition>
  );
};

const Modal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop show={props.show} onConfirm={props.onConfirm} />,
        document.getElementById('backdrop-root')
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          status={props.status}
          message={props.message}
          onConfirm={props.onConfirm}
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
