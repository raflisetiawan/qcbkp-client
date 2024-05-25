<template>
  <div>
    <div class="text-h6">Shift : {{ $state.issueOfQualityIssue.shift }}</div>
    <q-btn color="primary" @click="$state.showAddQualityIssueDialog = true">Buat quality issue</q-btn>
    <q-markup-table class="q-mt-md">
      <thead>
        <tr>
          <th class="text-left">Problem</th>
          <th class="text-left">Machine Performance</th>
          <th class="text-left" v-if="isAdmin()">Closed Issue?</th>
          <th class="text-left" v-if="isAdmin()">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="qualityIssue in $state.qualityIssues" :key="qualityIssue.id">
          <tr>
            <td class="text-left">{{ qualityIssue.problem }}</td>
            <td class="text-left">{{ qualityIssue.machine_performance }}</td>
            <td v-if="isAdmin()"><q-checkbox v-model="qualityIssue.closed"
                @update:model-value="handleToggleClosedIssue(qualityIssue.id)"></q-checkbox></td>
            <td v-if="isAdmin()" class="text-left">
              <q-btn icon="table_view" dense flat color="brown"
                @click="handleManageTrackRecordOnClick(qualityIssue)"><q-tooltip>Manage Track
                  Record</q-tooltip>
              </q-btn>
              <q-btn color="blue" flat icon="info" :to="{
      name: 'QualityIssueDetailPage', params: {
        id: qualityIssue.id
      }
    }"><q-tooltip>Detail</q-tooltip></q-btn>
              <q-btn flat color="red" icon="delete"
                @click="confirm(qualityIssue.id)"><q-tooltip>Delete</q-tooltip></q-btn>
              <q-btn flat color="green" icon="edit"
                @click="handleEditClick(qualityIssue)"><q-tooltip>Edit</q-tooltip></q-btn>
            </td>
          </tr>
        </template>
      </tbody>
    </q-markup-table>
    <EditDialog />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useQualityIssueStore } from 'stores/qualityIssue'
import { useRoute } from 'vue-router';
import { QualityIssue } from 'src/types/qualityIssue';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';
import { useTrackRecordStore } from 'src/stores/track-record';
import EditDialog from '../track-record/EditDialog.vue';
import { useApiWithAuthorization } from 'src/composables/api';
import { isAdmin } from 'src/composables/auth';

const { loadingBar, dialog } = useQuasar();
const { $state: trackRecordState } = useTrackRecordStore()
const { getQualityIssueByIssueId, $state, deleteQualityIssue } = useQualityIssueStore()
const { params } = useRoute();

const handleManageTrackRecordOnClick = (qualityIssue: QualityIssue) => {
  trackRecordState.editedIssue = qualityIssue.id;
  trackRecordState.showEditTrackTecordDialog = true;

}

const handleToggleClosedIssue = async (id: number) => {
  try {
    await useApiWithAuthorization.put(`track-records/toggle-closed/${id}`)

  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('Error Failed toggle closed issue:', error);
    }
  }
}

onMounted(async () => {
  try {
    await getQualityIssueByIssueId(params.id)
  } catch (error) {
    loadingBar.stop
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('Error fetching quality issue:', error);
    }
  } finally {
    loadingBar.stop
  }
})

function confirm(id: number) {
  dialog({
    title: 'Konfirmasi',
    message: 'Anda yakin menghapus data?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      deleteQualityIssue(id, params.id)
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.data) {
        useErrorNotify(error.message);
      } else {
        console.error('Error fetching quality issue:', error);
      }
    }
  })
}

const handleEditClick = (data: QualityIssue) => {
  $state.showEditQualityIssueDialog = true;
  $state.editedQualityIssue = data;
}

</script>

<style scoped></style>
