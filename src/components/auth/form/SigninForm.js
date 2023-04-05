import { NavLink } from 'react-router-dom';
import { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { authActions } from '../../../store/auth';
import useCheckInput from '../../../hooks/use-checkInput';
import {
  passwordValidateArr,
  emailValidateArr,
} from '../../../utils/utilValidate';
import useHttp from '../../../hooks/use-http';
import useFetchUserData from '../../../hooks/use-fetchUserData';
import { sendHttp } from '../../../utils/sendHttp';
import Modal from '../../ui/modal/Modal';

import signupClasses from './SignupForm.module.css';
import signinClasses from './SigninForm.module.css';
import commonClasses from '../../../utils/common.module.css';

// {validate: fn, msg: 'wrong email format'}

const SigninForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    sendRequest: sendSignInRequest,
    status: signInStatus,
    data: signInData,
    resetState: resetSignInState,
    error: signInError,
  } = useHttp(sendHttp, false);
  const [fetchUserData, fetchUserDataCompleted] = useFetchUserData();

  const [submitError, setSubmitError] = useState({});

  const [modalState, setModalState] = useState({
    show: false,
    status: 'success',
    message: '',
  });

  const {
    input: emailInput,
    inputChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    error: emailError,
    isValid: emailIsValid,
    isSubmit: emailIsSubmit,
    setIsSubmit: emailSetIsSubmit,
  } = useCheckInput(emailValidateArr);

  const {
    input: passwordInput,
    inputChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    error: passwordError,
    isValid: passwordIsValid,
    isSubmit: passwordIsSubmit,
  } = useCheckInput(passwordValidateArr);

  const isValid = emailIsValid && passwordIsValid;

  useEffect(() => {
    if (signInStatus !== 'completed') {
      return;
    }

    if (signInError) {
      setSubmitError({ show: true, status: 'fail', message: signInError });

      return;
    }

    if (signInData.status !== 'success') {
      setSubmitError({
        emailError: {
          error: true,
          msg: signInData.message,
        },
      });

      emailSetIsSubmit(true);
      resetSignInState();

      return;
    }

    dispatch(authActions.login());
    dispatch(authActions.setUser(signInData.data.user));

    fetchUserData();
  }, [
    signInStatus,
    signInError,
    signInData,
    resetSignInState,
    setSubmitError,
    emailSetIsSubmit,
    dispatch,
    fetchUserData,
  ]);

  useEffect(() => {
    if (fetchUserDataCompleted) {
      navigate('/');
    }
  }, [fetchUserDataCompleted, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isValid || signInStatus === 'pending') {
      return;
    }

    const user = JSON.stringify({
      email: emailInput,
      password: passwordInput,
    });

    const submitOptions = {
      path: '/users/login',
      options: {
        method: 'POST',
        credentials: 'include',
        body: user,
        headers: { 'Content-Type': 'application/json' },
      },
      forAuth: true,
    };

    sendSignInRequest(submitOptions);
  };

  const closeModal = () => {
    setModalState((prevState) => {
      return { ...prevState, show: false };
    });
    resetSignInState();
  };

  return (
    <Fragment>
      <Modal
        show={modalState.show}
        status={modalState.status}
        message={modalState.message}
        onConfirm={closeModal}
      />
      <form
        className={`${commonClasses['main-container']} ${signupClasses['form-container']} ${signinClasses['form-container']}`}
        onSubmit={submitHandler}
      >
        <div className={signupClasses['title-container']}>
          <p>Sign in</p>
        </div>
        <div className={signupClasses['inputs-container']}>
          <div
            id={signupClasses['email-input']}
            className={signupClasses['input_item-container']}
          >
            <input
              className={emailError ? signupClasses['input_error'] : ''}
              type='email'
              placeholder='Your email'
              value={emailInput}
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
            />
            {emailError && <p>{emailError}</p>}
            {submitError.emailError && emailIsSubmit && (
              <p>{submitError.emailError.msg}</p>
            )}
          </div>

          <div
            id={signupClasses['password-input']}
            className={signupClasses['input_item-container']}
          >
            <input
              className={passwordError ? signupClasses['input_error'] : ''}
              type='password'
              placeholder='Your password'
              value={passwordInput}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
            />{' '}
            {passwordError && <p>{passwordError}</p>}
            {submitError.passwordError && passwordIsSubmit && (
              <p>{submitError.passwordError.msg}</p>
            )}
          </div>
        </div>
        <div className={signupClasses['form_submit_btn-container']}>
          <button
            className={`${signupClasses['form_submit-btn']} ${
              !isValid ? signupClasses['form_submit-btn__disable'] : ''
            }`}
            disabled={
              !emailIsValid || !passwordIsValid || signInStatus === 'pending'
            }
          >
            Sign in
          </button>
        </div>
        <div className={signinClasses['sign_up-container']}>
          <hr />
          <p>New to Tuffy Talk ?</p>
          <NavLink className={signinClasses['sign_up-link']} to='/signup'>
            Create an account
          </NavLink>
        </div>
      </form>
    </Fragment>
  );
};

export default SigninForm;
