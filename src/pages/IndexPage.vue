<template>
  <div>
    <div class="text-h6 text-center q-mt-sm">{{ date.formatDate($state.filterDate?.toString(), 'dddd, DD MMMM YYYY',
      useIndonesianLocale) }}
    </div>
    <div class="right"><q-btn icon="calendar_month" color="primary" label="Filter tanggal"
        @click="$state.showFilterDateDialog = true"></q-btn></div>
    <CalendarDialog @filterIssueByDate="filterIssueByDate" />
    <div class="row" v-if="chartData.length !== 0">
      <div class="col-md-6" v-for="(cd, index) in chartData" :key="index">
        <IssueChart :chart-data="cd" :issue="cd.issue" />
      </div>
    </div>
    <div class="row text-center justify-center" v-else>
      <div class="text-center text-h6">Tidak ada Issue</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIssueStore } from 'src/stores/issue';
import { onMounted, reactive, ref } from 'vue';
import { date } from 'quasar';
import CalendarDialog from 'src/components/issue/CalendarDialog.vue';
import { IssueChartData, IssueWithQualityIssue } from 'src/types/issue';
import { QualityIssue } from 'src/types/qualityIssue';
import IssueChart from 'src/components/issue/IssueChart.vue';
import { useMetaTitle } from 'src/composables/meta';
import { useIndonesianLocale } from 'src/composables/date';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';

const { getIssueWithQuality, $state } = useIssueStore();
const issues = ref<IssueWithQualityIssue[]>([]);

const chartData: IssueChartData[] = reactive([])
const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const filterIssueByDate = async () => {
  try {
    chartData.length = 0;
    await initChartData($state.filterDate)
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('An Error Occured:', error);
    }
  } finally {
    $state.showFilterDateDialog = false
  }
}

const initChartData = async (dateString?: string | undefined | null | number) => {
  if (dateString) {
    const response = await getIssueWithQuality(date.formatDate(dateString, 'YYYY/MM/DD'))
    issues.value = response;

  } else {
    const response = await getIssueWithQuality(date.formatDate(Date.now(), 'YYYY/MM/DD'))
    issues.value = response;
  }

  issues.value.map((issue: IssueWithQualityIssue) => {
    let newLabels = issue.quality_issues.map((qi: QualityIssue) => qi.problem);
    let newData = issue.quality_issues.map((qi: QualityIssue) => qi.machine_performance);
    let newColors = issue.quality_issues.map(() => getRandomColor());

    chartData.push({
      labels: newLabels,
      datasets: [{
        data: newData,
        backgroundColor: newColors,
      }],
      issue
    });
  })

}

onMounted(async () => {
  $state.filterDate = date.formatDate(Date.now(), 'YYYY/MM/DD')

  try {
    await initChartData()

  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('An Error Occured:', error);
    }
  } finally {
    $state.showFilterDateDialog = false
  }
})
useMetaTitle('Dashboard')
</script>

<style scoped></style>
