import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { authActions } from '../../../store/auth';
import useCheckInput from '../../../hooks/use-checkInput';

import classes from './SignupForm.module.css';
import commonClasses from '../../../utils/common.module.css';
import { API_URL, PROXY_API_URL } from '../../../utils/config';

// {validate: fn, msg: 'wrong email format'}

const SignupForm = () => {
  const dispatch = useDispatch();

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [submitError, setSubmitError] = useState({});

  const usernameValidateArr = [
    {
      validate: (username) => username.trim().length >= 3,
      msg: 'Username should contain at least 3 characters',
    },
    {
      validate: (username) => username.trim().length <= 20,
      msg: 'Username cannot exceed 20 characters',
    },
  ];

  // /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  const emailValidateArr = [
    {
      validate: (email) =>
        email
          .toLowerCase()
          .match(
            /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
          ),
      msg: 'Invalid email format',
    },
  ];
  const passwordValidateArr = [
    {
      validate: (password) => password.trim().length >= 8,
      msg: 'Password should contain at least 8 characters',
    },
    {
      validate: (password) => password.trim().length <= 128,
      msg: 'Password cannot exceed 128 characters',
    },
  ];

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

  const isValid =
    usernameIsValid &&
    emailIsValid &&
    passwordIsValid &&
    confirmPassword.trim().length !== 0;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isValid) {
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

    try {
      const res = await fetch(`${PROXY_API_URL}/users/signup`, {
        method: 'POST',
        credentials: 'include',
        body: newUser,
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (!data.status) {
        throw new Error('what');
      }

      if (data.status !== 'success') {
        const errMsg = data.message;
        const field = errMsg.match(/'([^']+)'/)[1];
        const msg = errMsg.match(/"([^']+)"/)[1];

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

        return;
      }

      // TODO: add modal
      console.log('sign up successful');
      dispatch(authActions.login());
      dispatch(authActions.setUser(data.data.user));
    } catch (err) {
      // TODO: add modal
      console.log(err);
      console.log('something went very wrong');
    }
  };

  return (
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
            type='text'
            placeholder='Your username'
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
          id={classes['password-input']}
          className={classes['input_item-container']}
        >
          <input
            className={passwordError ? classes['input_error'] : ''}
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

        <div
          id={classes['password_confirm-input']}
          className={classes['input_item-container']}
        >
          <input
            value={confirmPassword}
            type='password'
            placeholder='Confirm your password'
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
        <NavLink className={classes['sign_in-link']} to='/signin'>
          Sign in
        </NavLink>
      </div>
    </form>
  );
};

export default SignupForm;
