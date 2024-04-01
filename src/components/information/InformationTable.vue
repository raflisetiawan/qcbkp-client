<template>
  <q-page padding>
    <div>
      <q-markup-table class="q-ma-md">
        <thead>
          <tr>
            <th colspan="2">
              <div class="row no-wrap items-center justify-between">
                <div class="text-h6 q-ml-md float-left">Informasi Minggu Ini : {{
                  date.formatDate(informationDate.from, 'DD MM YYYY') }} - {{
                  date.formatDate(informationDate.to, 'DD MM YYYY') }}</div>
              </div>
            </th>
            <th>
              <div class="row no-wrap items-center">
                <q-btn class="float-right" icon="event" color="primary" label="Filter Tanggal">
                  <q-popup-proxy @before-show="updateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="proxyDate" range>
                      <div class="row items-center justify-end q-gutter-sm">
                        <q-btn label="Cancel" color="primary" flat v-close-popup />
                        <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-btn>
              </div>
            </th>
          </tr>
          <tr>
            <th class="text-left">Judul</th>
            <th class="text-right">Tanggal</th>
            <th class="text-right">Aksi</th>
          </tr>
        </thead>
        <tbody v-if="$state.informations.length !== 0">
          <template v-for="information in $state.informations" :key="information.id">
            <tr class="cursor-pointer"
              @click="$router.push({ name: 'DetailInformationPage', params: { id: information.id } })">
              <td class="text-left">{{ information.title }}</td>
              <td class="text-right">{{ date.formatDate(information.information_date, 'dddd, DD MMMM YYYY',
                  useIndonesianLocale) }}</td>
              <td class="text-right">
                <q-btn v-show="!isUser" icon="delete" dense flat color="red" @click="confirmDelete(information.id)">
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
                <q-btn v-show="!isUser" icon="edit" dense flat color="green"
                  @click="handleShowEditInformationDialog(information)">
                  <q-tooltip>Edit</q-tooltip> </q-btn>
                <q-btn icon="info" dense flat color="blue"
                  :to="{ name: 'DetailInformationPage', params: { id: information.id } }">
                  <q-tooltip>Detail</q-tooltip> </q-btn>
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
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { date } from 'quasar'
import { useInformationStore } from 'src/stores/information';
import { Information } from 'src/types/information';
import { useIndonesianLocale } from 'src/composables/date';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';

const { loadingBar, dialog } = useQuasar();
const showFilterIssueByDate = ref(false);
const { $state, setInformation, deleteInformation } = useInformationStore()

const props = defineProps(['isUser'])


function confirmDelete(id: number | undefined) {
  dialog({
    title: 'Konfirmasi',
    message: 'Anda yakin menghapus data tersebut',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await deleteInformation(id)
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.data) {
        useErrorNotify(error.message);
      } else {
        console.error('Error fetching quality issue:', error);
      }
    }
  })
}

const handleShowEditInformationDialog = (data: Information) => {
  $state.showEditInformationDialog = true;
  $state.editedInformation = data;
}

const now = new Date(); // Mendapatkan tanggal dan waktu saat ini
const oneWeekFromNow = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

const proxyDate = ref({
  from: date.formatDate(oneWeekFromNow, 'YYYY/MM/DD'),
  to: date.formatDate(now, 'YYYY/MM/DD'),
})
const informationDate = ref({
  from: date.formatDate(oneWeekFromNow, 'YYYY/MM/DD'),
  to: date.formatDate(now, 'YYYY/MM/DD')
})
const updateProxy = () => {
  proxyDate.value = informationDate.value
}

const save = async () => {
  informationDate.value = proxyDate.value
  await setInformation(informationDate.value.from, informationDate.value.to)

}


onMounted(async () => {
  try {
    await setInformation()
  } catch (error) {
    loadingBar.stop
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('Error fetching quality issue:', error);
    }
  } finally {
    loadingBar.stop
    showFilterIssueByDate.value = false
  }
})


</script>

<style scoped></style>
