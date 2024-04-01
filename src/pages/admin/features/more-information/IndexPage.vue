<template>
  <div>
    <InformationTable :isUser="false" />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="$state.showAddInformationDialog = true" />
    </q-page-sticky>
    <AddInformationDialog />
    <EditInformationDialog />
  </div>
</template>

<script setup lang="ts">
import AddInformationDialog from 'src/components/information/AddInformationDialog.vue';
import EditInformationDialog from 'src/components/information/EditInformationDialog.vue';
import InformationTable from 'src/components/information/InformationTable.vue';
import { useMetaTitle } from 'src/composables/meta';
import { useInformationStore } from 'stores/information';
const { $state } = useInformationStore()
// onMounted()
useMetaTitle('Manage Informasi')
</script>
