import { boot } from 'quasar/wrappers';
import { Cookies } from 'quasar';
import { isAdmin, isAuthenticated } from 'src/composables/auth';
import { useUserStore } from 'src/stores/user';
import { useUser } from 'src/composables/auth/user';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';

/**
 * Auth Boot File
 *
 * This Quasar boot file handles authentication-related tasks such as checking user authentication,
 * setting up user information in the store, and controlling navigation based on user roles.
 *
 * @param {Object} options - Boot options provided by Quasar.
 * @param {Object} options.router - Quasar router instance for navigation control.
 *
 * @typedef {import('quasar').QuasarBootCallback} BootCallback
 * @type {BootCallback}
 */
export default boot(async ({ router }) => {
  /**
   * Use the user store composable to access and manipulate user-related state.
   *
   * @type {Object}
   * @property {Function} $state - Getter function for user store state.
   * @property {Function} setUser - Setter function to update user information in the store.
   */
  const { $state, setUser } = useUserStore();

  /**
   * Execute this function before each route navigation.
   *
   * @param {Object} to - The route being navigated to.
   * @param {Object} from - The route being navigated from.
   * @param {Function} next - Callback function to continue with the navigation.
   */
  router.beforeEach(async (to, from, next) => {
    // Set user store before rendering the page
    if ($state.id === 0) {
      if (Cookies.get('token')) {
        try {
          // Fetch user information using the provided token
          const response = await useUser(Cookies.get('token'));

          setUser(response.data.user);
        } catch (error) {
          // Handle any errors that may occur during user information fetching
          if (
            error instanceof AxiosError &&
            error.response &&
            error.response.data
          ) {
            useErrorNotify(error.message);
          } else {
            console.error('Error fetching quality issue:', error);
          }
        }
      }
    }

    // Check if the route requires admin access
    if (to.meta.requiresAdmin) {
      if (isAdmin()) {
        next();
      } else {
        // Redirect to UnauthorizedPage if the user is not an admin
        next({ name: 'UnauthorizedPage' });
      }
    }
    // Check if the route requires authentication
    else if (to.meta.requiresAuth && !isAuthenticated()) {
      if (to.name !== 'signin') {
        // Redirect to SignInPage if not on the sign-in page
        next({ name: 'SignInPage' });
      } else {
        next();
      }
    }
    // Check if the route requires a guest (non-authenticated) user
    else if (to.meta.requiresGuest && isAuthenticated()) {
      // Redirect to the home page if the user is authenticated
      next('/');
    } else {
      // Continue with the navigation for other cases
      next();
    }
  });
});
