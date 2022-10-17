import { Fragment, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import LoadingSpinner from '../../../ui/loading_spinner/LoadingSpinner';
import InputField from '../form_ui/InputField';
import SelectField from '../form_ui/SelectField';
import Modal from '../../../ui/modal/Modal';

import { toCamel } from '../../../../utils/util';
import useHttp from '../../../../hooks/use-http';
import { sendHttp } from '../../../../utils/sendHttp';
import { usernameValidateArr } from '../../../../utils/utilValidate';

import profileClasses from '../ProfileItemCommon.module.css';

const UserInfo = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [inputErrors, setInputErrors] = useState({});
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [formSubmit, setFormSubmit] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [submitComplete, setSubmitComplete] = useState(false);

  const {
    sendRequest: fetchMajors,
    data: majorData,
    status: majorStatus,
    error: majorError,
  } = useHttp(sendHttp);

  const {
    sendRequest: submitUserData,
    data: userData,
    status: userDataStatus,
    error: userDataError,
  } = useHttp(sendHttp, false);

  const usernameRef = useRef();

  // Loading majors from backend
  useEffect(() => {
    fetchMajors({ path: '/majors', useProxy: false });
  }, [fetchMajors]);

  // Submitting user changes
  useEffect(() => {
    if (!formSubmit) return;

    if (Object.keys(inputErrors).length > 0) {
      setFormSubmit(false);
      return;
    }

    // Submit the changes
    const newUser = {};

    if (
      usernameRef.current.value.trim() !== user.username &&
      usernameRef.current.value.trim() !== ''
    ) {
      newUser.username = usernameRef.current.value.trim();
    }

    if (selectedMajor !== user.major && selectedMajor !== null) {
      newUser.major = selectedMajor;
    }

    if (Object.keys(newUser).length < 1) {
      setFormSubmit(false);
      return;
    }

    const submitOptions = {
      path: '/user-actions/update-me',
      useProxy: false,
      options: {
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify(newUser),
        headers: { 'Content-Type': 'application/json' },
      },
    };

    submitUserData(submitOptions);

    setFormSubmit(false);
    setSubmitComplete(true);
  }, [formSubmit, inputErrors, selectedMajor, user, submitUserData]);

  // Render modal after submit user data
  useEffect(() => {
    if (userDataStatus === 'completed' && submitComplete) {
      setShowModal(true);
    }
  }, [userDataStatus, submitComplete]);

  const getMajorOptions = () =>
    majorData.reduce((majors, major) => {
      const key = toCamel(major.name, ' ');

      majors[key] = major.name;

      return majors;
    }, {});

  // Validate input
  const formSubmitHandler = (e) => {
    e.preventDefault();

    let errors = {};

    if (usernameRef.current.value.trim() !== '') {
      usernameValidateArr.forEach((val) => {
        if (!val.validate(usernameRef.current.value)) {
          errors.username = val.msg;
        }
      });
    }

    setInputErrors(errors);
    setFormSubmit(true);
  };

  const majorChangeHandler = (major) => {
    setSelectedMajor(major);
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
      {majorStatus === 'completed' ? (
        <Fragment>
          <div className={profileClasses['user_info_header-container']}>
            <p>Profile Setting</p>
          </div>

          <form className={profileClasses['form-container']}>
            <InputField
              _ref={usernameRef}
              _id='username'
              label='Username'
              type='text'
              placeholder={user.username}
              error={inputErrors.username}
            />

            <SelectField
              _id='major'
              label='Major'
              options={getMajorOptions()}
              user={user}
              onMajorChange={majorChangeHandler}
            />

            <button
              className={profileClasses['form_submit-btn']}
              onClick={formSubmitHandler}
              disabled={formSubmit}
            >
              Apply Change
            </button>
          </form>
        </Fragment>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default UserInfo;
