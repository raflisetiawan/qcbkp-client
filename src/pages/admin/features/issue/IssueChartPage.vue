<template>
  <div>
    <IssueChart v-if="chartData.labels.length !== 0" :chartData="chartData" :issue="issue" />
  </div>
</template>

<script setup lang="ts">
import { useIssueStore } from 'src/stores/issue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import IssueChart from 'src/components/issue/IssueChart.vue';
import { IssueWithQualityIssue } from 'src/types/issue';
import { QualityIssue } from 'src/types/qualityIssue';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';

const { params } = useRoute();
const { getIssueWithQualityIssueById } = useIssueStore()
const issue = ref<IssueWithQualityIssue>({
  id: 0,
  issue_date: '',
  quality_issues: [],
  shift: 0,
  user_id: 0
})

const chartData = reactive({
  labels: [] as string[],
  datasets: [{ data: [] as string[], backgroundColor: [] as string[] }]
})

// Function to generate a random color
const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

onMounted(async () => {
  try {
    const response = await getIssueWithQualityIssueById(params.id)
    issue.value = response;
    const qualityIssues = response.quality_issues;
    const newLabels = qualityIssues.map((qi: QualityIssue) => qi.problem);
    const newData = qualityIssues.map((qi: QualityIssue) => qi.machine_performance);
    const newColors = qualityIssues.map(() => getRandomColor());

    chartData.labels = [...chartData.labels, ...newLabels];
    chartData.datasets[0].data = newData;
    chartData.datasets[0].backgroundColor = [...chartData.datasets[0].backgroundColor, ...newColors];
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('An Error Occured:', error);
    }
  }
})
</script>

<style scoped></style>
