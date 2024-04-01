import { useUserStore } from 'src/stores/user';
import { Cookies } from 'quasar';

/**
 * Checks if the user is authenticated.
 *
 * @returns {boolean} Returns true if the user is authenticated, false otherwise.
 */
const isAuthenticated = (): boolean => {
  const token = Cookies.get('token');
  return !!token;
};

/**
 * Checks if the user is an admin.
 *
 * @returns {boolean} Returns true if the user is an admin, false otherwise.
 */
const isAdmin = (): boolean => {
  const { role } = useUserStore();
  if (role === 'admin') return true;
  else return false;
};

const isManager = (): boolean => {
  const { role } = useUserStore();

  if (role === 'manager') return true;
  else return false;
};

export { isAuthenticated, isAdmin, isManager };
