<template>
  <div>
    <div class="row q-col-gutter-sm q-pa-md">
      <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
        <q-card class="card-bg text-white no-shadow" bordered>
          <q-card-section class="text-h6 ">
            <div class="text-h6">Edit Profile</div>
            <div class="text-subtitle2">Complete your profile</div>
          </q-card-section>
          <q-form @submit="onSubmit">
            <q-card-section class="q-pa-sm">
              <q-list class="row">
                <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-item-section side>
                    <q-avatar size="100px">
                      <img :src="!$state.image ? 'https://cdn.quasar.dev/img/boy-avatar.png' : $state.image">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-file v-model="userForm.image" label="Edit Photo" />
                  </q-item-section>
                </q-item>

                <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-input dense v-model="userForm.name" label="User Name" lazy-rules :error="v$.name.$error"
                      :error-message="v$.name.$errors.map((e) => e.$message).join()" @input="v$.name.$touch"
                      @blur="v$.name.$touch" />
                  </q-item-section>
                </q-item>
                <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-item-section>
                    <q-input disable dense v-model="userForm.email" label="Email Address" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-actions>
              <div class="row justify-between full-width">
                <q-btn @click="changePasswordStore.changePasswordDialog = true" class="text-capitalize bg-blue">Ganti
                  Password</q-btn>
                <q-btn type="submit" class="text-capitalize bg-primary text-white">Update User Info</q-btn>
              </div>
            </q-card-actions>
          </q-form>
        </q-card>
      </div>
    </div>
    <ChangePasswordDialog />
  </div>
</template>

<script setup lang="ts">

import useVuelidate from '@vuelidate/core';
import { AxiosError } from 'axios';
import ChangePasswordDialog from 'src/components/profile/ChangePasswordDialog.vue';
import { useMetaTitle } from 'src/composables/meta';
import { useErrorNotify } from 'src/composables/notifications';
import { useEmail, useName, useRequired } from 'src/composables/validators';
import { useChangePasswordStore } from 'src/stores/change-password';
import { useUserStore } from 'src/stores/user';
import { reactive, watchEffect } from 'vue';
const { $state, editProfile } = useUserStore()
const { $state: changePasswordStore } = useChangePasswordStore()

const userForm = reactive({
  name: '',
  email: '',
  image: null as null | undefined,
})

const rules = {
  email: { required: useRequired(), email: useEmail() },
  name: { required: useRequired(), name: useName() },

}
const v$ = useVuelidate(rules, userForm)

const onSubmit = async () => {
  if (!v$.value.$invalid) {
    try {
      await editProfile({ ...userForm, user_id: $state.id, _method: 'PUT' })
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.data) {
        useErrorNotify(error.message);
      } else {
        console.error('An Error Occured:', error);
      }
    }
  } else {
    v$.value.$touch();
  }
}
watchEffect(() => {
  userForm.email = $state.email
  userForm.name = $state.name
})

useMetaTitle('Profil')
</script>

<style scoped></style>
