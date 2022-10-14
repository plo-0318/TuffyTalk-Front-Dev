import { API_URL, PROXY_API_URL } from './config';

export const sendHttp = async ({
  path,
  useProxy,
  options = null,
  forAuth = false,
}) => {
  const url = useProxy ? PROXY_API_URL : API_URL;

  if (!path) {
    throw new Error('Did not pass in a path in send http');
  }

  const res = await fetch(`${url}${path}`, options);

  if (res.status === 204) {
    return null;
  }

  const data = await res.json();

  if (!data || !data.status) {
    throw new Error('Something went wrong. Please try again later 😢');
  }

  if (!forAuth) {
    if (data.status !== 'success') {
      throw new Error(data.message);
    }

    return data.data.data;
  }

  // For /users/login and /users/singup routes
  // Want to have access to the error messages
  return data;
};

export const loginWithJWT = async (useProxy) => {
  const url = useProxy ? PROXY_API_URL : API_URL;

  const res = await fetch(`${url}/users/is-logged-in`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await res.json();

  if (!data || !data.status) {
    throw new Error('Something went wrong. Please try again later 😢');
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
