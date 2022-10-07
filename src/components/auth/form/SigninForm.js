import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { authActions } from '../../../store/auth';
import useCheckInput from '../../../hooks/use-checkInput';
import {
  passwordValidateArr,
  emailValidateArr,
} from '../../../utils/utilValidate';

import signupClasses from './SignupForm.module.css';
import signinClasses from './SigninForm.module.css';
import commonClasses from '../../../utils/common.module.css';
import { API_URL, PROXY_API_URL } from '../../../utils/config';

// {validate: fn, msg: 'wrong email format'}

const SigninForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [submitError, setSubmitError] = useState({});

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

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    const user = JSON.stringify({
      email: emailInput,
      password: passwordInput,
    });

    try {
      const res = await fetch(`${PROXY_API_URL}/users/login`, {
        method: 'POST',
        credentials: 'include',
        body: user,
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (!data.status) {
        throw new Error('what');
      }

      if (data.status !== 'success') {
        setSubmitError({
          emailError: {
            error: true,
            msg: data.message,
          },
        });

        emailSetIsSubmit(true);

        return;
      }

      // TODO: add modal
      console.log('sign in successful');
      dispatch(authActions.login());
      dispatch(authActions.setUser(data.data.user));
      navigate('/');
    } catch (err) {
      // TODO: add modal
      console.log('something went very wrong');
    }
  };

  return (
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
          disabled={!emailIsValid || !passwordIsValid}
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
  );
};

export default SigninForm;
