import { useReducer, useCallback } from 'react';

const httpReducer = (currentState, action) => {
  if (action.type === 'SEND') {
    return {
      status: 'pending',
      data: null,
      error: null,
    };
  }

  if (action.type === 'SUCCESS') {
    return {
      status: 'completed',
      data: action.responseData,
      error: null,
    };
  }

  if (action.type === 'ERROR') {
    return {
      status: 'completed',
      data: null,
      error: action.errorMessage,
    };
  }

  if (action.type === 'RESET') {
    return {
      status: action.status,
      data: null,
      error: null,
    };
  }

  return currentState;
};

const useHttp = (requestFn, startWithPending = true) => {
  const [httpState, dispatch] = useReducer(httpReducer, {
    status: startWithPending ? 'pending' : null,
    data: null,
    error: null,
  });

  const sendRequest = useCallback(
    async (requestData) => {
      dispatch({ type: 'SEND' });

      try {
        const responseData = await requestFn(requestData);
        dispatch({ type: 'SUCCESS', responseData });
      } catch (err) {
        dispatch({
          type: 'ERROR',
          errorMessage: err.message || 'Something went very wrong',
        });
      }
    },
    [requestFn]
  );

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET', status: startWithPending ? 'pending' : null });
  }, [startWithPending]);

  // {sendRequest, status, data, error, resetState}
  return { sendRequest, ...httpState, resetState };
};

export default useHttp;
