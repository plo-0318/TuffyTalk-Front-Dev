import { useEffect, useState } from 'react';

// {validate: fn, msg: 'wrong email format'}

const useCheckInput = (validateArr) => {
  const [input, setInput] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [error, setError] = useState(null);

  if (isTouched) {
    setError(null);

    for (let val of validateArr) {
      const { validate, msg } = val;

      if (!validate(input)) {
        setError(msg);
        break;
      }
    }
  }

  const isValid = isTouched && !error;

  const inputChangeHandler = (e) => {
    setInput(e.target.value);
  };

  const inputBlurHandler = (e) => {
    setIsTouched(true);
  };

  return {
    input,
    isTouched,
    inputChangeHandler,
    inputBlurHandler,
    error,
    isValid,
  };
};

export default useCheckInput;
