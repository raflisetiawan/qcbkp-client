import { AxiosError } from 'axios';
import { Cookies } from 'quasar';
import { useErrorNotify } from '../notifications';

/**
 * Sets the 'token' cookie with the provided token value.
 *
 * @param {string} token - The token value to be set as a cookie.
 * @returns {boolean} - Returns true if the cookie is successfully set, otherwise false.
 */
const useSignInSetCookies = (token: string): boolean => {
  // Validate token parameter
  if (token && token.trim() !== '') {
    try {
      // Set token as cookie
      Cookies.set('token', token, {
        expires: 7,
        sameSite: 'None',
        secure: true,
      });
      return true; // Return success status
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data
      ) {
        useErrorNotify(error.message);
      } else {
        console.error('Error fetching quality issue:', error);
        console.error('Failed to set cookie:', error);
      }
      return false; // Return failure status
    }
  } else {
    return false; // Return failure status if token is empty or null
  }
};

export { useSignInSetCookies };
