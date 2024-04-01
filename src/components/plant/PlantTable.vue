<template>
  <div>
    <q-markup-table class="q-mt-md">
      <thead>
        <tr>
          <th colspan="3">
            <div class="row no-wrap items-center justify-between">
              <div class="text-h6 q-ml-md float-left">Plant list</div>
            </div>
          </th>
        </tr>
        <tr>
          <th class="text-left">Issue Date</th>
          <th class="text-left">Deskripsi</th>
          <th class="text-left">Aksi</th>
        </tr>
      </thead>
      <tbody v-if="$state.plants.length !== 0">
        <template v-for="plant in $state.plants" :key="plant.id">
          <tr>
            <td class="text-left">{{ plant.name }}</td>
            <td class="text-left">{{ plant.description }}</td>
            <td class="text-right">
              <q-btn v-if="isAdmin()" icon="delete" dense flat color="red" @click="confirmDelete(plant.id)">
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
              <q-btn icon="edit" v-if="isAdmin()" dense flat color="green" @click="handleshowEditIssueDialog(plant)">
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
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePlantStore } from 'src/stores/plant';
import { isAdmin } from 'src/composables/auth';
import { useQuasar } from 'quasar';
import { EditedPlant } from 'src/types/plant'
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';

const { $state, setPlant, deletePlant, toggleEditPlantDialog, setEditedPlant } = usePlantStore()
const { dialog } = useQuasar();


function confirmDelete(plantId: number) {
  dialog({
    title: 'Konfirmasi',
    message: 'Anda yakin menghapus data tersebut',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await deletePlant(plantId)
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.data) {
        useErrorNotify(error.message);
      } else {
        console.error('Error fetching quality issue:', error);
      }
    }
  })
}

const handleshowEditIssueDialog = (data: EditedPlant) => {
  toggleEditPlantDialog()
  setEditedPlant(data);
}
onMounted(async () => {
  try {
    await setPlant()
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('Error fetching quality issue:', error);
    }
  }
})


</script>

<style scoped></style>
