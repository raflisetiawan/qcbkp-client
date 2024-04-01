<template>
  <div class="q-pa-md">
    <IssueDateTitleVue />
    <QualityIssueTable />
    <AddQualityIssueDialog />
    <EditQualityIssueDialog />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="$state.showAddQualityIssueDialog = true" />
    </q-page-sticky>
  </div>
</template>

<script setup lang="ts">
import QualityIssueTable from 'src/components/quality-issue/QualityIssueTable.vue';
import { useMetaTitle } from 'src/composables/meta';
import { useQualityIssueStore } from 'src/stores/qualityIssue';
import AddQualityIssueDialog from 'src/components/quality-issue/AddQualityIssueDialog.vue';
import EditQualityIssueDialog from 'src/components/quality-issue/EditQualityIssueDialog.vue';
import IssueDateTitleVue from 'src/components/IssueDateTitle.vue';

const { $state } = useQualityIssueStore()


useMetaTitle('Manage Issue')


</script>

<style scoped></style>
