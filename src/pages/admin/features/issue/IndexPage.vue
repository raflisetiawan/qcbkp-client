<template>
  <div class="q-pa-md">
    <IssueDateTitle />
    <IssueTable />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showIssueDialog = true" />
    </q-page-sticky>

    <AddIssueDialogAdmin :showIssueDialog="showIssueDialog" @closeAddIssueDialog="showIssueDialog = false" />
  </div>
</template>

<script setup lang="ts">
import IssueTable from 'src/components/issue/IssueTable.vue';
import AddIssueDialogAdmin from 'src/components/issue/AddDialogAdmin.vue';
import IssueDateTitle from 'src/components/IssueDateTitle.vue';
import { ref } from 'vue';
import { useMetaTitle } from 'src/composables/meta';

const showIssueDialog = ref(false);
useMetaTitle('Manage Issue')
</script>
