<template>
  <div class="q-pa-md">
    <div class="text-h6">Manage User</div>
    <q-markup-table class="q-mt-md" :dense="$q.screen.lt.md">
      <thead>
        <tr>
          <th class="text-left">Email</th>
          <th class="text-right">Nama</th>
          <th class="text-right">Status</th>
          <th class="text-right">Role</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="user in users" :key="user.id">
          <tr>
            <td class="text-left">{{ user.email }}</td>
            <td class="text-right">{{ user.name }}</td>
            <td class="text-right">
              <q-btn flat :color="user.approval_status ? 'green' : 'red'"
                @click="confirmApproval(user.id, user.name, user.approval_status)">
                {{ user.approval_status_text }}
              </q-btn>
            </td>
            <td class="text-right">
              <q-btn flat>
                <q-menu>
                  <q-list style="min-width: 100px">
                    <template v-for="role in roles" :key="role.id">
                      <q-item clickable v-close-popup @click="changeRole(user.id, role.id)">
                        <q-item-section>{{ role.name }}</q-item-section>
                      </q-item>
                    </template>
                  </q-list>
                </q-menu> {{ user.role_name ?? 'Belum ada role' }}
              </q-btn>
            </td>
          </tr>
        </template>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApiWithAuthorization } from 'src/composables/api'
import { ManageUser } from 'src/types/user';
import { Role } from 'src/types/role';
import { useQuasar } from 'quasar';
import { useMetaTitle } from 'src/composables/meta';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';

const users = ref<ManageUser[]>([])
const roles = ref<Role[]>([])
const { loadingBar, dialog } = useQuasar();

const initUsers = async () => {
  const response = await useApiWithAuthorization.get('manage-users');
  roles.value = response.data.roles
  users.value = response.data.users;
}

const changeRole = async (userId: number, role_id: number) => {
  try {
    await useApiWithAuthorization.post('manage-users/change-role', { userId, newRoleId: role_id });
    await initUsers();
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('An Error Occured:', error);
    }
  }
}

const confirmApproval = async (userId: number, userName: string, approvalStatus: boolean) => {
  if (!approvalStatus) {
    dialog({
      title: 'Konfirmasi',
      message: `Apakah anda Menyetujui user bernama ${userName}`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      await useApiWithAuthorization.post('manage-users/toggle-approval-status', { userId })
      await initUsers();
    })
  } else {
    dialog({
      title: 'Konfirmasi',
      message: `Apakah anda tidak Menyetujui user bernama ${userName}`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      await useApiWithAuthorization.post('manage-users/toggle-approval-status', { userId })
      await initUsers();
    })
  }
}

onMounted(async () => {
  try {
    await initUsers()
  } catch (error) {
    loadingBar.stop
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('An Error Occured:', error);
    }
  } finally {
    loadingBar.stop
  }
})

useMetaTitle('Manage User - Admin')

</script>

<style scoped></style>
