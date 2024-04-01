<template>
  <div>
    <q-dialog v-model="$state.showFilterDateDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Filter Issue berdasarkan tanggal</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-date v-model="$state.filterDate" minimal />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="$state.showFilterDateDialog = false" />
          <q-btn label="Filter" color="primary" @click="$emit('filterIssueByDate', $state.filterDate)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';
import { date } from 'quasar'
import { useIssueStore } from 'src/stores/issue';

const { $state } = useIssueStore()
const dateNow = date.formatDate(Date.now(), 'YYYY/MM/DD')
watchEffect(() => {
  if ($state.showFilterDateDialog) {
    $state.filterDate = dateNow
  }
})
</script>

<style scoped></style>
