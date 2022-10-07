import { API_URL, PROXY_API_URL } from './config';

export const fetchData = async ({ path, useProxy, options = null }) => {
  const url = useProxy ? PROXY_API_URL : API_URL;

  if (!path) {
    throw new Error('Did not pass in a path in send http');
  }

  const res = await fetch(`${url}${path}`, options);
  const data = await res.json();

  if (!data || !data.status) {
    throw new Error('Something went very wrong');
  }

  if (data.status !== 'success') {
    throw new Error(data.message);
  }

  return data.data.data;
};

export const loginWithJWT = async (useProxy) => {
  const url = useProxy ? PROXY_API_URL : API_URL;

  const res = await fetch(`${url}/users/is-logged-in`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await res.json();

  if (!data || !data.status) {
    throw new Error('Something went very wrong');
  }

  return data.user;
};

export const logout = async (useProxy) => {
  const url = useProxy ? PROXY_API_URL : API_URL;

  await fetch(`${url}/users/logout`, {
    method: 'GET',
    credentials: 'include',
  });
};
