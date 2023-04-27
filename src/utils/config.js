export const PRODUCTION = false;
export const RESOURCE_URL = PRODUCTION
  ? 'https://tuffytalk.herokuapp.com'
  : 'http://127.0.0.1:5000';
export const API_URL = 'https://tuffytalk.herokuapp.com/api/v1';
export const PROXY_API_URL = '/api/v1';
export const USE_PROXY = !PRODUCTION;

export const POST_LIMIT = 8;
