import { NavLink } from 'react-router-dom';
import { useState, Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { authActions } from '../../../store/auth';
import useCheckInput from '../../../hooks/use-checkInput';
import {
  usernameValidateArr,
  emailValidateArr,
  passwordValidateArr,
} from '../../../utils/utilValidate';
import useHttp from '../../../hooks/use-http';
import { sendHttp } from '../../../utils/sendHttp';
import Modal from '../../ui/modal/Modal';
import { USE_PROXY } from '../../../utils/config';

import classes from './SignupForm.module.css';
import commonClasses from '../../../utils/common.module.css';

// {validate: fn, msg: 'wrong email format'}

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [submitError, setSubmitError] = useState({});

  const { sendRequest, status, data, resetState, error } = useHttp(
    sendHttp,
    false
  );

  const [modalState, setModalState] = useState({
    show: false,
    status: 'success',
    message: '',
  });

  const {
    input: usernameInput,
    inputChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
    error: usernameError,
    isValid: usernameIsValid,
    isSubmit: usernameIsSubmit,
    setIsSubmit: usernameSetIsSubmit,
  } = useCheckInput(usernameValidateArr);

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
    setIsSubmit: passwordSetIsSubmit,
  } = useCheckInput(passwordValidateArr);

  const confirmPasswordChangeHandler = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError(false);
  };

  useEffect(() => {
    if (error) {
      setSubmitError({ show: true, status: 'fail', message: error });

      return;
    }

    if (status !== 'completed') {
      return;
    }

    if (data.status !== 'success') {
      if (!data.errorData) {
        setSubmitError({
          show: true,
          status: 'fail',
          message: 'Semething went very wrong. Please try again later 😢',
        });

        return;
      }

      const field = data.errorData.field.toLowerCase();
      const msg = data.errorData.message;

      if (field === 'username') {
        setSubmitError({
          usernameError: {
            error: true,
            msg,
          },
        });

        usernameSetIsSubmit(true);
      }

      if (field === 'email') {
        setSubmitError({
          emailError: {
            error: true,
            msg,
          },
        });

        emailSetIsSubmit(true);
      }

      if (field === 'password') {
        setSubmitError({
          passwordError: {
            error: true,
            msg,
          },
        });

        passwordSetIsSubmit(true);
      }

      resetState();
      return;
    }

    dispatch(authActions.login());
    dispatch(authActions.setUser(data.data.user));
    resetState();
    navigate('/');
  }, [
    status,
    error,
    data,
    resetState,
    setSubmitError,
    emailSetIsSubmit,
    passwordSetIsSubmit,
    usernameSetIsSubmit,
    dispatch,
    navigate,
  ]);

  const isValid =
    usernameIsValid &&
    emailIsValid &&
    passwordIsValid &&
    confirmPassword.trim().length !== 0;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isValid || status === 'pending') {
      return;
    }

    if (passwordInput !== confirmPassword) {
      setConfirmPasswordError(true);
      return;
    }

    const newUser = JSON.stringify({
      username: usernameInput,
      email: emailInput,
      password: passwordInput,
    });

    const submitOptions = {
      path: '/users/signup',
      options: {
        method: 'POST',
        credentials: 'include',
        body: newUser,
        headers: { 'Content-Type': 'application/json' },
      },
      forAuth: true,
    };

    sendRequest(submitOptions);
  };

  const closeModal = () => {
    setModalState((prevState) => {
      return { ...prevState, show: false };
    });
    resetState();
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
        className={`${commonClasses['main-container']} ${classes['form-container']}`}
        onSubmit={submitHandler}
      >
        <div className={classes['title-container']}>
          <p>Sign up</p>
          {/* <hr /> */}
        </div>
        <div className={classes['inputs-container']}>
          <div
            id={classes['username-input']}
            className={classes['input_item-container']}
          >
            <input
              className={usernameError ? classes['input_error'] : ''}
              type="text"
              placeholder="Your username"
              value={usernameInput}
              onChange={usernameChangeHandler}
              onBlur={usernameBlurHandler}
            />
            {usernameError && <p>{usernameError}</p>}
            {submitError.usernameError && usernameIsSubmit && (
              <p>{submitError.usernameError.msg}</p>
            )}
          </div>

          <div
            id={classes['email-input']}
            className={classes['input_item-container']}
          >
            <input
              className={emailError ? classes['input_error'] : ''}
              type="email"
              placeholder="Your email"
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
            id={classes['password-input']}
            className={classes['input_item-container']}
          >
            <input
              className={passwordError ? classes['input_error'] : ''}
              type="password"
              placeholder="Your password"
              value={passwordInput}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
            />{' '}
            {passwordError && <p>{passwordError}</p>}
            {submitError.passwordError && passwordIsSubmit && (
              <p>{submitError.passwordError.msg}</p>
            )}
          </div>

          <div
            id={classes['password_confirm-input']}
            className={classes['input_item-container']}
          >
            <input
              value={confirmPassword}
              type="password"
              placeholder="Confirm your password"
              onChange={confirmPasswordChangeHandler}
            />
            {confirmPasswordError && <p>Passwords do not match</p>}
          </div>
        </div>
        <div className={classes['form_submit_btn-container']}>
          <button
            className={`${classes['form_submit-btn']} ${
              !isValid ? classes['form_submit-btn__disable'] : ''
            }`}
            disabled={!isValid}
          >
            Sign up
          </button>
        </div>
        <div className={classes['sign_in-container']}>
          <p>Have an account ?</p>
          <NavLink className={classes['sign_in-link']} to="/signin">
            Sign in
          </NavLink>
        </div>
      </form>
    </Fragment>
  );
};

export default SignupForm;
