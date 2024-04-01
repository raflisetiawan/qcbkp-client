<template>
  <q-page padding>
    <!-- content -->
    <PlantTableVue />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="toggleAddPlantDialog" />
    </q-page-sticky>
    <AddPlantDialog />
    <EditPlantDialog />
  </q-page>
</template>

<script setup lang="ts">
import AddPlantDialog from 'src/components/plant/AddPlantDialog.vue';
import PlantTableVue from 'src/components/plant/PlantTable.vue';
import EditPlantDialog from 'src/components/plant/EditPlantDialog.vue';
import { usePlantStore } from 'src/stores/plant';
import { useMetaTitle } from 'src/composables/meta';

const { toggleAddPlantDialog } = usePlantStore()

useMetaTitle('Manage Plant')
</script>
