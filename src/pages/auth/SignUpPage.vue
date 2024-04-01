<template>
  <div class="row q-mt-lg justify-center q-pa-md" id="sign-up-page">
    <q-card class="full-width" flat bordered>
      <q-card-section>
        <div class="text-h6 text-center">Sign Up</div>
        <q-banner inline-actions :class="signUpError.isError ? `text-white bg-red` : `text-white bg-red hidden `"
          rounded v-show="signUpError.isError">
          {{ signUpError.message }}
          <template v-slot:action>
            <q-btn flat dense icon="fa-solid fa-xmark" @click="signUpError.isError = false" />
          </template>
        </q-banner>
      </q-card-section>

      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-card-section>
          <q-input outlined type="email" v-model="signUpForm.email" lazy-rules label="Email *" :error="v$.email.$error"
            :error-message="v$.email.$errors.map((e) => e.$message).join()" @input="v$.email.$touch"
            @blur="v$.email.$touch" />
          <q-input outlined type="text" v-model="signUpForm.name" lazy-rules label="Username *" :error="v$.name.$error"
            :error-message="v$.name.$errors.map((e) => e.$message).join()" @input="v$.name.$touch"
            @blur="v$.name.$touch" />
          <q-input outlined :type="showPassword ? 'text' : 'password'" v-model="signUpForm.password" label="Password *"
            lazy-rules :error="v$.password.$error" :error-message="v$.password.$errors.map((e) => e.$message).join()"
            @input="v$.password.$touch" @blur="v$.password.$touch">
            <template v-slot:append>
              <q-btn :icon="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
                @click="showPassword = !showPassword" flat></q-btn>
            </template>
          </q-input>

          <q-input outlined :type="showConfirmationPassword ? 'text' : 'password'"
            v-model="signUpForm.passwordConfirmation" label="Konfirmasi Password *" lazy-rules
            :error="v$.passwordConfirmation.$error"
            :error-message="v$.passwordConfirmation.$errors.map((e) => e.$message).join()"
            @input="v$.passwordConfirmation.$touch" @blur="v$.passwordConfirmation.$touch">

            <template v-slot:append>
              <q-btn :icon="showConfirmationPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
                @click="showConfirmationPassword = !showConfirmationPassword" flat></q-btn>
            </template>
          </q-input>
        </q-card-section>

        <q-separator dark />

        <q-card-actions>
          <q-btn label="Sign Up" type="submit" :loading="loadingSignIn" color="primary" />
        </q-card-actions>
        <div class="text-center">
          <div class="text-body2">Sudah punya akun ?<q-btn dense :to="{ name: 'SignInPage' }" color="primary" flat>
              Login</q-btn></div>

        </div>
      </q-form>
    </q-card>
    <ApprovalDialogVue :showApprovalMessage="showApprovalMessage"
      @closeApprovalMessageDialog="closeApprovalMessageDialog" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { useEmail, useRequired, useMinLength, useName } from 'src/composables/validators';
import { api } from 'src/boot/axios';
import axios from 'axios';
import ApprovalDialogVue from 'src/components/auth/ApprovalDialog.vue';
import { useRouter } from 'vue-router';
import { useMetaTitle } from 'src/composables/meta';


const showApprovalMessage = ref(false);
const { push: routerPush } = useRouter()
const signUpForm = reactive({
  email: '',
  password: '',
  name: '',
  passwordConfirmation: ''
})

const signUpError = reactive({
  isError: false,
  message: ''
})

const showPassword = ref(false);
const showConfirmationPassword = ref(false);

const rules = {
  email: { required: useRequired(), email: useEmail() },
  name: { required: useRequired(), name: useName() },
  password: { required: useRequired(), minLength: useMinLength(5) },
  passwordConfirmation: { required: useRequired(), minLength: useMinLength(5) }
}

const v$ = useVuelidate(rules, signUpForm)
const loadingSignIn = ref(false);
const onSubmit = async () => {
  if (!v$.value.$invalid) {
    loadingSignIn.value = true;
    try {
      await api.post('signup', { ...signUpForm, password_confirmation: signUpForm.passwordConfirmation });
      showApprovalMessage.value = true;
      routerPush({
        name: 'SignInPage', query: {
          isSignUp: 'true'
        }
      })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          signUpError.isError = true;
          signUpError.message = error.response.data.message;
          showApprovalMessage.value = true;
        }
        else if (error.response.status === 404) {
          signUpError.isError = true;
          signUpError.message = error.response.data.message;
          throw new Error('Password yang Anda masukkan salah.');
        } else if (Array.isArray(error.response.data.message)) {
          error.response.data.message.forEach((errorMessage: string) => {
            signUpError.isError = true;
            signUpError.message = errorMessage;
          });
          throw new Error(error.response.data.message.join(', '));
        } else if (error.response.status === 500) {
          signUpError.isError = true;
          signUpError.message = 'Terjadi masalah pada server. Silakan hubungi administrator.';
          throw new Error('Terjadi masalah pada server. Silakan hubungi administrator.');
        } else {
          signUpError.isError = true;
          signUpError.message = 'Terjadi kesalahan saat proses autentikasi. Silakan coba lagi nanti.';
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

useMetaTitle('Sign Up')
</script>

<style scoped></style>
