<template>
  <q-page padding>
    <q-markup-table class="q-mt-md">
      <thead>
        <tr>
          <th colspan="3">
            <div class="row no-wrap items-center justify-between">
              <div class="text-h6 q-ml-md float-left">Memo</div>
            </div>
          </th>
        </tr>
        <tr>
          <th class="text-left">Judul</th>
          <th class="text-right">Memo</th>
          <th class="text-right">Aksi</th>
        </tr>
      </thead>
      <tbody v-if="memos.length > 0">
        <template v-for="memo in memos" :key="memo.id">
          <tr>
            <td class="text-left">{{ memo.title }}</td>
            <td class="text-right">{{ memo.memo }}</td>
            <td class="text-right">
              <q-btn v-if="isAdmin() || isManager()" @click="$state.showEditMemoDialog = true; $state.editedMemo = memo"
                color="green" icon="edit" flat><q-tooltip>Edit</q-tooltip></q-btn>
              <q-btn v-if="isAdmin() || isManager()" @click="confirmDelete(memo)" color="red" icon="delete"
                flat><q-tooltip>Hapus</q-tooltip></q-btn>
            </td>
          </tr>
        </template>
      </tbody>
      <tbody v-else>
        <tr>
          <td class="text-center" colspan="3">Data Kosong!</td>
        </tr>
      </tbody>
    </q-markup-table>
    <EditMemoDialog />
  </q-page>
</template>

<script setup lang="ts">
import { useMemoStore } from 'src/stores/memo';
import { Memo } from 'src/types/memo';
import { onMounted, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import EditMemoDialog from 'src/components/memo/EditMemoDialog.vue';
import { isAdmin, isManager } from 'src/composables/auth';
import { useQuasar } from 'quasar';
import { useMetaTitle } from 'src/composables/meta';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';

const { params } = useRoute();
const { dialog } = useQuasar()
const { getMemoByIssueId, $state, deleteMemo } = useMemoStore();
const memos = ref<Memo[]>([]);


function confirmDelete(data: Memo) {
  dialog({
    title: 'Konfirmasi',
    message: 'Anda yakin menghapus data tersebut',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await deleteMemo(data)
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.data) {
        useErrorNotify(error.message);
      } else {
        console.error('An Error Occured:', error);
      }
    }
  })
}

onMounted(async () => {
  try {
    const data = await getMemoByIssueId(params.issueId)
    memos.value = data;

  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('An Error Occured:', error);
    }
  }
})

watchEffect(() => {
  memos.value = $state.memos
})

useMetaTitle('Detail List Memo')

</script>
