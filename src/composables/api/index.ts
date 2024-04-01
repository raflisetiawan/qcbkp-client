import axios from 'axios';
import { Cookies } from 'quasar';

/**
 * Creates an instance of axios with authorization headers.
 *
 * @returns {AxiosInstance} The axios instance with authorization headers.
 */
const useApiWithAuthorization = axios.create({
  // baseURL: 'https://api.qcbkp.tech/api/',
  baseURL: 'http://localhost:8000/api/',
  headers: {
    Authorization: `Bearer ${Cookies.get('token')}`,
  },
});

export { useApiWithAuthorization };
