<template>
  <div class="q-pa-md">
    <div class="text-h6">Manage Quality Issue</div>
    <QualityIssueTable />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" />
    </q-page-sticky>
  </div>
</template>

<script setup lang="ts">
import QualityIssueTable from 'src/components/quality-issue/QualityIssueTable.vue';
import { useMetaTitle } from 'src/composables/meta';


useMetaTitle('Quality Issue')

</script>

<style scoped></style>
