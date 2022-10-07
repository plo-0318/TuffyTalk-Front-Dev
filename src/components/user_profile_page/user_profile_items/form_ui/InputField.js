import { useState } from 'react';

import classes from './ui.module.css';

const InputField = (props) => {
  const [inputChanged, setInputChanged] = useState(false);

  const inputChangeHandler = (e) => {
    if (
      (e.target.value === props.placeholder && props.type !== 'password') ||
      e.target.value === ''
    ) {
      if (inputChanged) {
        setInputChanged(false);
      }

      return;
    }

    setInputChanged(true);
  };

  return (
    <div className={`${classes['form_input-container']}`}>
      <label
        className={`${classes['form_label']} ${
          inputChanged ? classes['form_label__changed'] : ''
        }`}
        htmlFor={props._id}
      >
        {props.label}
      </label>
      <input
        ref={props._ref}
        id={props._id}
        className={classes['form_input']}
        type={props.type}
        placeholder={props.placeholder}
        onChange={inputChangeHandler}
      />
      {props.error && (
        <p className={classes['form_input_error-text']}>{props.error}</p>
      )}
    </div>
  );
};

export default InputField;
