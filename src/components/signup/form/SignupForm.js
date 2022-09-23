import useCheckInput from '../../../hooks/use-checkInput';

import classes from './SignupForm.module.css';

const SignupForm = () => {
  return (
    <form className={classes['form-container']}>
      <div className={classes['title-container']}>
        <p>Sign Up</p>
        <hr />
      </div>
    </form>
  );
};

export default SignupForm;
