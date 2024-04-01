<template>
  <div class="text-h6">Manage Quality Issue: {{ date.formatDate(issueState.filterDate?.toString(), 'dddd, DD MMMM YYYY',
    useIndonesianLocale)
    }}
  </div>
</template>

<script setup lang="ts">
import { AxiosError } from 'axios';
import { date } from 'quasar'
import { useIndonesianLocale } from 'src/composables/date';
import { useErrorNotify } from 'src/composables/notifications';
import { useIssueStore } from 'src/stores/issue';
import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const { params } = useRoute();
const { $state: issueState, getIssueDateById } = useIssueStore()

watchEffect(() => {
  if (issueState.filterDate === null) {
    if (params.id) {
      try {
        getIssueDateById(params.id)
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.data) {
          useErrorNotify(error.message);
        } else {
          console.error('Error fetching quality issue:', error);
        }
      }
    } else {
      issueState.filterDate = date.formatDate(Date.now(), 'YYYY/MM/DD', useIndonesianLocale)
    }
  }
})
</script>
