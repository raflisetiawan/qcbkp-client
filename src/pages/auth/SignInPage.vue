<template>
  <div class="row q-mt-lg justify-center q-pa-md">
    <q-card class="full-width" flat bordered>
      <q-card-section>
        <div class="text-h6 text-center">Sign In</div>
        <q-banner inline-actions :class="signInError.isError ? `text-white bg-red` : `text-white bg-red hidden `" rounded
          v-show="signInError.isError">
          {{ signInError.message }}
          <template v-slot:action>
            <q-btn flat dense icon="fa-solid fa-xmark" @click="signInError.isError = false" />
          </template>
        </q-banner>
      </q-card-section>

      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-card-section>
          <q-input outlined type="email" v-model="signInForm.email" lazy-rules label="Email *" :error="v$.email.$error"
            :error-message="v$.email.$errors.map((e) => e.$message).join()" @input="v$.email.$touch"
            @blur="v$.email.$touch" />

          <q-input outlined :type="showPassword ? 'text' : 'password'" v-model="signInForm.password" label="Password *"
            lazy-rules :error="v$.password.$error" :error-message="v$.password.$errors.map((e) => e.$message).join()"
            @input="v$.password.$touch" @blur="v$.password.$touch">
            <template v-slot:append>
              <q-btn :icon="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
                @click="showPassword = !showPassword" flat></q-btn>
            </template>
          </q-input>
        </q-card-section>

        <q-separator dark />

        <q-card-actions>
          <q-btn label="Sign In" type="submit" :loading="loadingSignIn" color="primary" />
        </q-card-actions>
        <div class="text-center">
          <div class="text-body2">Tidak punya akun ?<q-btn dense :to="{ name: 'SignUpPage' }" color="primary" flat>
              Daftar</q-btn></div>

        </div>
      </q-form>
    </q-card>
    <ApprovalDialogVue :showApprovalMessage="showApprovalMessage"
      @closeApprovalMessageDialog="closeApprovalMessageDialog" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { useEmail, useRequired, useMinLength } from 'src/composables/validators';
import { api } from 'src/boot/axios';
import { useRouter, useRoute } from 'vue-router';
import { useSignInSetCookies } from 'src/composables/cookies'
import axios from 'axios';
import ApprovalDialogVue from 'src/components/auth/ApprovalDialog.vue';
import { useMetaTitle } from 'src/composables/meta';

/**
 * Sign-In Page
 *
 * This Vue component handles user authentication by submitting the sign-in form,
 * validating user input using Vuelidate, and managing the response from the authentication API.
 *
 * @typedef {import('vue').Ref} Ref
 * @typedef {import('vue-router').Router} Router
 * @typedef {import('@vuelidate/core').VuelidateObject} VuelidateObject
 *
 * @typedef {Object} SignInForm - The reactive form data for the sign-in page.
 * @property {string} email - User's email address.
 * @property {string} password - User's password.
 *
 * @typedef {Object} SignInError - Object representing sign-in error state.
 * @property {boolean} isError - Whether an error occurred during sign-in.
 * @property {string} message - Error message to display in case of sign-in failure.
 *
 * @typedef {Object} Rules - Validation rules for sign-in form fields.
 * @property {Object} email - Email validation rules.
 * @property {Object} password - Password validation rules.
 *
 * @typedef {Object} SignInMethods - Methods used in the sign-in page component.
 * @property {Function} onSubmit - Handles form submission and authentication process.
 * @property {Function} closeApprovalMessageDialog - Closes the approval message dialog.
 *
 * @typedef {Object} SignInComputed - Computed properties for the sign-in page component.
 * @property {boolean} loadingSignIn - Whether the sign-in process is currently loading.
 * @property {VuelidateObject} v$ - Vuelidate instance for form validation.
 *
 * @typedef {Object} SignInRefs - Refs used in the sign-in page component.
 * @property {Ref<boolean>} showApprovalMessage - Whether to display the approval message dialog.
 * @property {Ref<boolean>} showPassword - Whether to display the password input as plain text.
 *
 * @typedef {Object} SignInDependencies - External dependencies used in the sign-in page component.
 * @property {Router} router - Vue Router instance for navigation.
 *
 * @type {Object}
 * @property {SignInForm} signInForm - Reactive form data for the sign-in page.
 * @property {SignInError} signInError - Error state for sign-in.
 * @property {Rules} rules - Validation rules for form fields.
 * @property {SignInMethods} methods - Methods used in the sign-in page component.
 * @property {SignInComputed} computed - Computed properties for the sign-in page component.
 * @property {SignInRefs} refs - Refs used in the sign-in page component.
 * @property {SignInDependencies} dependencies - External dependencies used in the sign-in page component.
 */

const router = useRouter();
const route = useRoute();
const showApprovalMessage = ref(false);

const signInForm = reactive({
  email: '',
  password: ''
})

const signInError = reactive({
  isError: false,
  message: ''
})

const showPassword = ref(false);

const rules = {
  email: { required: useRequired(), email: useEmail() },
  password: { required: useRequired(), minLength: useMinLength(5) }
}

const v$ = useVuelidate(rules, signInForm)
const loadingSignIn = ref(false);

/**
 * Handles form submission and authentication process.
 * Redirects the user based on their role after successful sign-in.
 *
 * @async
 * @returns {Promise<void>}
 */
const onSubmit = async (): Promise<void> => {
  if (!v$.value.$invalid) {
    loadingSignIn.value = true;
    try {
      const response = await api.post('signin', signInForm);
      useSignInSetCookies(response.data.token);
      if (response.data.user.role_id === 1) router.push({ name: 'AdminHomePage' })
      else router.push({ name: 'HomePage' })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          signInError.isError = true;
          signInError.message = 'Password yang Anda masukkan salah.';
          throw new Error('Password yang Anda masukkan salah.');

        } else if (error.response.status === 403) {
          signInError.isError = true;
          signInError.message = error.response.data.message;
          showApprovalMessage.value = true;
        }
        else if (error.response.status === 404) {
          signInError.isError = true;
          signInError.message = error.response.data.message;
          throw new Error('Password yang Anda masukkan salah.');
        } else if (Array.isArray(error.response.data.message)) {
          error.response.data.message.forEach((errorMessage: string) => {
            signInError.isError = true;
            signInError.message = errorMessage;
          });
          throw new Error(error.response.data.message.join(', '));
        } else if (error.response.status === 500) {
          signInError.isError = true;
          signInError.message = 'Terjadi masalah pada server. Silakan hubungi administrator.';
          throw new Error('Terjadi masalah pada server. Silakan hubungi administrator.');
        } else {
          signInError.isError = true;
          signInError.message = 'Terjadi kesalahan saat proses autentikasi. Silakan coba lagi nanti.';
          throw new Error('Terjadi kesalahan saat proses autentikasi. Silakan coba lagi nanti.');
        }
      }
    } finally {
      loadingSignIn.value = false;
    }

  } else {
    v$.value.$touch();
  }
}

const closeApprovalMessageDialog = (): boolean => showApprovalMessage.value = false;

onMounted(() => {
  if (route.query.isSignUp) {
    showApprovalMessage.value = true;
  }

})
useMetaTitle('Sign In')
</script>

<style scoped></style>
