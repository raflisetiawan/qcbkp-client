<template>
  <div>
    <q-dialog v-model="$state.changePasswordDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Ganti Password</div>
        </q-card-section>

        <q-form @submit="onSubmit">
          <q-card-section class="q-pt-none">
            <q-input type="password" class="q-mb-md" outlined v-model="changePasswordForm.current_password" autofocus
              label="Password" />
            <q-input type="password" class="q-mb-md" outlined v-model="changePasswordForm.new_password" autofocus
              label="Password baru" />
            <q-input type="password" class="q-mb-md" outlined v-model="changePasswordForm.confirm_password" autofocus
              label="Konfirmasi password baru" />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn type="submit" label="ganti password" color="primary" :loading="changePasswordLoading"></q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { AxiosError } from 'axios';
import { useQuasar } from 'quasar';
import { useApiWithAuthorization } from 'src/composables/api';
import { useChangePasswordStore } from 'stores/change-password';
import { reactive, ref } from 'vue';

const { $state } = useChangePasswordStore();
const { notify } = useQuasar()

const changePasswordForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})
const changePasswordLoading = ref(false);

const onSubmit = async () => {
  try {
    changePasswordLoading.value = true;
    await useApiWithAuthorization.post('user/change-password', changePasswordForm);
    $state.changePasswordDialog = false;
    notify({
      message: 'Password berhasil di ubah',
      position: 'top-right',
      color: 'green',
      icon: 'done'
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        notify({
          message: 'Password lama tidak sesuai',
          position: 'top-right',
          color: 'red',
          icon: 'error'
        });
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        // Membuat pesan error dari array pesan yang diterima
        const errorMessage = Object.values(errors).join(', ');

        notify({
          message: errorMessage,
          position: 'top-right',
          color: 'red',
          icon: 'error',
          multiLine: true,
        });
      } else {
        notify({
          message: 'Terjadi masalah',
          position: 'top-right',
          color: 'red',
          icon: 'error'
        });
      }
    } else {
      notify({
        message: 'Terjadi masalah',
        position: 'top-right',
        color: 'red',
        icon: 'error'
      });
    }
  } finally {
    changePasswordLoading.value = false;
  }
};

</script>

<style scoped></style>
