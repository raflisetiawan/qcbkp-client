<template>
  <div>
    <q-markup-table class="q-mt-md" :dense="$q.screen.lt.md">
      <thead>
        <tr>
          <th colspan="5">
            <div class="row no-wrap items-center justify-between">
              <div class="col-4">
                <div class="text-h6 q-ml-md float-left">Quality Issue</div>
              </div>
              <div class="col-4">
                <div class="right"><q-btn icon="calendar_month" color="primary" label="Filter tanggal"
                    @click="showFilterIssueByDate = true"></q-btn></div>
              </div>
              <div class="col-4">
                <div class="right">
                  <q-select @update:model-value="(value) => getSelectedIssueByPlantId(value)" class="q-my-md" outlined
                    v-model="selectPlantForm" :options="options" label="Filter berdasarkan Plant" />
                </div>
              </div>
            </div>
          </th>
        </tr>
        <tr>
          <th class="text-left">Shift</th>
          <th class="text-left">Plant</th>
          <th class="text-left">Open Issue</th>
          <th class="text-left">Aksi</th>
        </tr>
      </thead>
      <tbody v-if="$state.issues.length !== 0">
        <template v-for="issue in $state.issues" :key="issue.id">
          <tr>
            <q-tooltip>Lihat Issue</q-tooltip>
            <td @click="$router.push({
      name: 'AdminManageQualityIssueIndexPage', params: {
        id: issue.id
      }
    })" class="text-left issue-table-row">{{ issue.shift }}</td>
            <td @click="$router.push({
      name: 'AdminManageQualityIssueIndexPage', params: {
        id: issue.id
      }
    })" class="text-left issue-table-row">{{ issue.plant.name }}</td>
            <td @click="$router.push({
      name: 'AdminManageQualityIssueIndexPage', params: {
        id: issue.id
      }
    })" class="text-left issue-table-row">{{ date.formatDate(issue.issue_date, 'dddd, DD MMMM YYYY',
      useIndonesianLocale) }}
            </td>
            <td class="text-left">
              <q-btn dense size="sm" color="purple" :to="{
      name: 'DetailListMemo', params: {
        issueId: issue.id
      }
    }" flat>Lihat Memo</q-btn>
              <q-btn @click="memoState.showAddMemoDialog = true; memoState.issue_id = issue.id" color="purple"
                v-if="isManager() || isAdmin()" flat icon-right="note_alt" dense size="sm">Tambahkan Memo</q-btn>

              <q-btn icon="table_view" dense flat color="brown"
                @click="handleManageTrackRecordOnClick(issue)"><q-tooltip>Manage Track
                  Record</q-tooltip>
              </q-btn>
              <q-btn icon="donut_large" dense flat color="blue"
                :to="{ name: 'AdminManageIssueChartPage', params: { id: issue.id } }"> <q-tooltip>Chart</q-tooltip>
              </q-btn>
              <q-btn v-if="isAdmin()" icon="delete" dense flat color="red" @click="confirmDelete(issue.id)">
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
              <q-btn icon="edit" v-if="isAdmin()" dense flat color="green" @click="handleshowEditIssueDialog(issue)">
                <q-tooltip>Edit</q-tooltip> </q-btn>
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
    <FilterDateDialogVue :show-filter-issue-by-date="showFilterIssueByDate"
      @closeFilterIssueByDate="showFilterIssueByDate = false"
      @filterIssueByDate="((date: Date) => handleFilterIssueByDate())" />
    <EditIssueDialogAdmin v-if="isAdmin()" :editedData="editedData" :showEditIssueDialog="showEditIssueDialog"
      @closeEditIssueDialog="showEditIssueDialog = false" />
    <EditIssueDialogVue v-else :editedData="editedData" :showEditIssueDialog="showEditIssueDialog"
      @closeEditIssueDialog="showEditIssueDialog = false" />
    <AddMemoDialog />
    <EditDialog />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { QSelectOption, useQuasar } from 'quasar';
import FilterDateDialogVue from './FilterDateDialog.vue';
import { useIssueStore } from 'src/stores/issue';
import { date } from 'quasar'
import EditIssueDialogVue from './EditIssueDialog.vue';
import EditIssueDialogAdmin from './EditIssueDialogAdmin.vue';
import { EditedIssue, Issue } from 'src/types/issue';
import { isAdmin, isManager } from 'src/composables/auth';
import { useMemoStore } from 'src/stores/memo';
import AddMemoDialog from '../memo/AddMemoDialog.vue';
import { usePlantStore } from 'src/stores/plant';
import { useIndonesianLocale } from 'src/composables/date';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';
import EditDialog from '../track-record/EditDialog.vue';
import { useTrackRecordStore } from 'src/stores/track-record';

const { loadingBar, dialog } = useQuasar();
const showFilterIssueByDate = ref(false);
const { initIssues, $state, deleteIssue } = useIssueStore();
const showEditIssueDialog = ref(false);
const { $state: memoState } = useMemoStore()
const { getAllPlant } = usePlantStore()
const { $state: trackRecordState } = useTrackRecordStore();

const editedData: EditedIssue = reactive({
  id: 0,
  issue_date: '',
  shift: 0,
  user_id: 0,
  plant: {
    label: '',
    value: ''
  },
  quality_control_name: ''
})

const selectPlantForm = ref<QSelectOption | null>({
  label: '',
  value: ''
});

const handleFilterIssueByDate = async () => {
  try {
    await initIssues()
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('Error fetching quality issue:', error);
    }
  } finally {
    showFilterIssueByDate.value = false
  }
}

function confirmDelete(issueId: number) {
  dialog({
    title: 'Konfirmasi',
    message: 'Anda yakin menghapus data tersebut',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await deleteIssue(issueId)
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.data) {
        useErrorNotify(error.message);
      } else {
        console.error('Error fetching quality issue:', error);
      }
    }
  })
}

const handleshowEditIssueDialog = (data: Issue | any) => {
  showEditIssueDialog.value = true;
  editedData.id = data.id;
  editedData.issue_date = data.issue_date;
  editedData.shift = data.shift;
  editedData.user_id = data.user_id;
  editedData.plant.value = data.plant_id
  editedData.quality_control_name = data.quality_control_name

}

const options = ref<QSelectOption[]>([{
  label: 'Semua Plant',
  value: ''
}])

const setOptions = async () => {
  try {
    const data = await getAllPlant();
    if (data.length !== 0) {
      // Mengubah struktur data
      const transformedData: QSelectOption[] = data.map(item => ({ label: item.name, value: item.id }));

      // Mengassign hasil transformasi ke variabel options
      transformedData.map((data) => {
        options.value.push(data)
      })
      // options.value = transformedData;
      if (selectPlantForm.value !== null) {
        selectPlantForm.value.label = options.value[0]?.label;
        selectPlantForm.value.value = options.value[0]?.value;
      }
    }

  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('Error fetching quality issue:', error);
    }
  }
}

const getSelectedIssueByPlantId = async (value: QSelectOption) => {
  try {
    $state.selectedPlant = value.value
    if (!value.value) {
      $state.selectedPlant = null
    }

    await initIssues()
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('Error fetching:', error);
    }
  } finally {
    showFilterIssueByDate.value = false
  }

}

const handleManageTrackRecordOnClick = (issue: Issue) => {
  trackRecordState.editedIssue = issue.id;
  trackRecordState.showEditTrackTecordDialog = true;
}

onMounted(async () => {
  try {
    await initIssues()
    await setOptions();
  } catch (error) {
    loadingBar.stop
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('Error fetching :', error);
    }
  } finally {
    loadingBar.stop
    showFilterIssueByDate.value = false
  }
})


</script>

<style scoped>
.issue-table-row {
  cursor: pointer;
}
</style>
