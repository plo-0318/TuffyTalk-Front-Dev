import { useState } from 'react';

// {validate: fn, msg: 'wrong email format'}

const useCheckInput = (validateArr) => {
  const [input, setInput] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  let error = null;

  if (isTouched) {
    for (let val of validateArr) {
      const { validate, msg } = val;

      if (!validate(input)) {
        error = msg;
        // setError(msg);
        // setIsTouched(false);
        break;
      }
    }
  }

  const isValid = isTouched && !error;

  const inputChangeHandler = (e) => {
    setInput(e.target.value);

    if (!isTouched) {
      setIsTouched(true);
    }

    if (isSubmit) {
      setIsSubmit(false);
    }
  };

  const inputBlurHandler = (e) => {
    setIsTouched(true);
  };

  return {
    input,
    inputChangeHandler,
    inputBlurHandler,
    error,
    isValid,
    isSubmit,
    setIsSubmit,
  };
};

export default useCheckInput;
