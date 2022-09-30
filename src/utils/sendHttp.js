import { API_URL, PROXY_API_URL } from './config';

export const fetchData = async ({ path, useProxy }) => {
  const url = useProxy ? PROXY_API_URL : API_URL;

  if (!path) {
    throw new Error('Did not pass in a path in send http');
  }

  const res = await fetch(`${url}${path}`);
  const data = await res.json();

  if (!data || !data.status) {
    throw new Error('Something went very wrong');
  }

  if (data.status !== 'success') {
    throw new Error(data.message);
  }

  return data.data.data;
};
