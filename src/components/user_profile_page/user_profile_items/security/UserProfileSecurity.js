import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import LoadingSpinner from '../../../ui/loading_spinner/LoadingSpinner';
import InputField from '../form_ui/InputField';
import Modal from '../../../ui/modal/Modal';

import useHttp from '../../../../hooks/use-http';
import { fetchData } from '../../../../utils/sendHttp';
import { passwordValidateArr } from '../../../../utils/utilValidate';

import profileClasses from '../ProfileItemCommon.module.css';
import classes from './UserProfileSecurity.module.css';

const UserProfileSecurity = () => {
  const navigate = useNavigate();

  const [inputErrors, setInputErrors] = useState({});
  const [formSubmit, setFormSubmit] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [submitComplete, setSubmitComplete] = useState(false);

  const {
    sendRequest: submitUserData,
    data: userData,
    status: userDataStatus,
    error: userDataError,
  } = useHttp(fetchData, false);

  const passwordRef = useRef();
  const newPasswordRef = useRef();
  const confirmNewPasswordRef = useRef();

  // Submitting user changes if inputs are valid
  useEffect(() => {
    if (!formSubmit) return;

    if (Object.keys(inputErrors).length > 0) {
      setFormSubmit(false);
      return;
    }

    // Submit the changes

    const userData = {
      currentPassword: passwordRef.current.value,
      newPassword: newPasswordRef.current.value,
    };

    const submitOptions = {
      path: '/user-actions/update-my-password',
      useProxy: true,
      options: {
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' },
      },
    };

    submitUserData(submitOptions);

    setFormSubmit(false);
    setSubmitComplete(true);
  }, [formSubmit, inputErrors, submitUserData]);

  // Render modal after submit user data
  useEffect(() => {
    if (userDataStatus === 'completed' && submitComplete) {
      setShowModal(true);
    }
  }, [userDataStatus, submitComplete]);

  // Validate input
  const formSubmitHandler = (e) => {
    e.preventDefault();

    let errors = {};

    if (passwordRef.current.value.trim() === '') {
      errors.password = 'Please enter your current password';
    }

    for (const val of passwordValidateArr) {
      if (!val.validate(newPasswordRef.current.value)) {
        errors.newPassword = val.msg;
        break;
      }
    }

    if (Object.keys(errors).length < 1) {
      if (
        newPasswordRef.current.value !== confirmNewPasswordRef.current.value
      ) {
        errors.confirmNewPassword = 'New passwords do not match';
      }
    }

    setInputErrors(errors);
    setFormSubmit(true);
  };

  const modalConfirmHandler = () => {
    setSubmitComplete(false);
    setShowModal(false);

    if (!userDataError) {
      navigate(0, { replace: true });
    }
  };

  return (
    <div className={profileClasses['user_info-container']}>
      <Modal
        show={showModal}
        status={userDataError ? 'fail' : 'success'}
        message={userDataError || 'Changes saved'}
        onConfirm={modalConfirmHandler}
      />
      <div className={profileClasses['user_info_header-container']}>
        <p>Security Setting</p>
      </div>

      <form className={profileClasses['form-container']}>
        <InputField
          _ref={passwordRef}
          _id='password'
          label='Current Password'
          type='password'
          placeholder={'current password'}
          error={inputErrors.password}
        />

        <div className={classes['new_passwords-container']}>
          <InputField
            _ref={newPasswordRef}
            _id='newPassword'
            label='New Password'
            type='password'
            placeholder={'new password'}
            error={inputErrors.newPassword}
          />

          <InputField
            _ref={confirmNewPasswordRef}
            _id='confirmNewPassword'
            label='Confirm New Password'
            type='password'
            placeholder={'confirm new password'}
            error={inputErrors.confirmNewPassword}
          />
        </div>

        <button
          className={profileClasses['form_submit-btn']}
          onClick={formSubmitHandler}
          disabled={formSubmit}
        >
          Apply Change
        </button>
      </form>
    </div>
  );
};

export default UserProfileSecurity;
