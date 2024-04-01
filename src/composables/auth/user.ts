import { AxiosError, AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import { useErrorNotify } from '../notifications';

/**
 * Retrieves user data from the API using the provided token.
 *
 * @param {null | string} token - The authentication token for the user.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the response from the API.
 * @throws {Error} - If an error occurs during the API request.
 */
const useUser = async (token: null | string): Promise<AxiosResponse> => {
  try {
    const response = await api.get('user', {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
      throw new Error('An error occurred.');
    } else {
      throw new Error('An error occurred.');
    }
  }
};

export { useUser };
