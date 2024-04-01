import { defineStore } from 'pinia';
import { User, UserEditForm } from 'src/types/user';
import { api } from 'src/boot/axios';
import { useNotify } from 'src/composables/notifications';
import { Cookies } from 'quasar';
import { useUser } from 'src/composables/auth/user';

/**
 * User Store
 *
 * This Pinia store manages user-related state, getters, and actions, including setting,
 * resetting user information, handling user logout, and editing user profile.
 *
 * @typedef {import('pinia').StoreObject<UserStore>} UserStore
 *
 * @typedef {Object} User - User information object.
 * @property {string} email - User's email address.
 * @property {number} id - User's unique identifier.
 * @property {string} name - User's name.
 * @property {string} created_at - Timestamp of user creation.
 * @property {string} role - User's role.
 * @property {string} image - User's image URL.
 *
 * @typedef {Object} UserEditForm - Form data for editing user profile.
 * @property {string} name - User's updated name.
 * @property {string} image - User's updated image file.
 *
 * @typedef {Object} UserStoreState - State object for the UserStore.
 * @property {string} email - User's email address.
 * @property {number} id - User's unique identifier.
 * @property {string} name - User's name.
 * @property {string} created_at - Timestamp of user creation.
 * @property {string} role - User's role.
 * @property {string} image - User's image URL.
 *
 * @typedef {Object} UserStoreGetters - Getters object for the UserStore.
 * @property {(state: UserStoreState) => User} getUser - Getter for retrieving user information.
 *
 * @typedef {Object} UserStoreActions - Actions object for the UserStore.
 * @property {(userData: User) => void} setUser - Action to set user information.
 * @property {() => void} resetUser - Action to reset user information and clear cookies.
 * @property {() => Promise<void>} logout - Action to log out the user.
 * @property {(data: UserEditForm) => Promise<void>} editProfile - Action to edit user profile.
 *
 * @type {UserStore}
 */

export const useUserStore = defineStore('user', {
  state: (): User => ({
    email: '',
    id: 0,
    name: '',
    created_at: '',
    role: '',
    image: null,
  }),
  getters: {
    getUser: (state) => (state = state),
    getUserId: (state) => state.id,
  },
  actions: {
    setUser(userData: User) {
      this.$state.id = userData.id;
      this.$state.name = userData.name;
      this.$state.email = userData.email;
      this.$state.created_at = userData.created_at;
      this.$state.role = userData.role;
      this.$state.image = userData.image;
      this.$state.email_verified_at = userData.email_verified_at;
    },
    resetUser() {
      this.$state.id = 0;
      this.$state.name = '';
      this.$state.email = '';
      this.$state.email_verified_at = null;
      this.$state.updated_at = null;
      this.$state.created_at = '';
      this.$state.role = '';
      this.$state.email_verified_at = null;

      Cookies.remove('token');
      // Cookies.remove('signedIn');
    },
    async logout() {
      try {
        const response = await api.post('signout');
        if (response.data.success) {
          this.resetUser();
          if (!Cookies.has('token')) {
            useNotify('Berhasil logout', 'green');
            this.router.push({ name: 'SignInPage' });
          } else {
            Cookies.remove('token');
            this.resetUser();
          }
        } else {
          useNotify('Berhasil logout', 'green');
        }
      } catch (error) {
        useNotify('Terjadi masalah', 'red');
        throw error;
      }
    },
    async editProfile(data: UserEditForm): Promise<void> {
      await api.post(
        'edit-user-profile',
        { ...data, image_path: data.image },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const response = await useUser(Cookies.get('token'));
      this.setUser(response.data.user);
    },
  },
});
