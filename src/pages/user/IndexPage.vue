<template>
  <div>
    <div class="row" v-for="issue in issues" :key="issue.id">
      <div class="col-md-4">
        {{ chartData.length }}
        <IssueChart v-if="chartData.length !== 0" :chart-data="chartData" />
        <div v-else class="text-center text-h6">Tidak ada Issue</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIssueStore } from 'src/stores/issue';
import { onMounted, reactive, ref } from 'vue';
import { date } from 'quasar';
import IssueChart from 'src/components/issue/IssueChart.vue';
import { QualityIssue } from 'src/types/qualityIssue';
import { IssueWithQualityIssue, IssueChartData } from 'src/types/issue';
import { useMetaTitle } from 'src/composables/meta';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';


const { getIssueWithQuality } = useIssueStore();
const issues = ref<IssueWithQualityIssue[]>([]);

const chartData: IssueChartData[] = reactive([])



// Function to generate a random color
const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

onMounted(async () => {
  try {

    const response = await getIssueWithQuality(date.formatDate(Date.now(), 'YYYY/MM/DD'))
    issues.value = response;

    issues.value.map((issue) => {
      const newLabels = issue.quality_issues.map((qi: QualityIssue) => qi.problem);
      const newData = issue.quality_issues.map((qi: QualityIssue) => qi.machine_performance);
      const newColors = issue.quality_issues.map(() => getRandomColor());

      chartData.push({
        labels: newLabels,
        datasets: [{
          data: newData,
          backgroundColor: newColors,
        }],
        issue: issue
      });
    })

  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('An Error Occured:', error);
    }
  }
})

useMetaTitle('Dashboard')
</script>

<style scoped></style>
