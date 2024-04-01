<template>
  <div>
    <div class="row q-pa-md justify-center">
      <div class="col-md-8 col-sm-10 col-xs-12">
        <q-card class="my-card q-pa-none q-mt-md q-mb-md">
          <div class="row cursor-pointer" @click="redirectToDetailIssue(props.issue.id)">
            <div class="col-md-3 col-sm-3 col-xs-3 q-mt-md">
              <q-banner class="bg-primary text-white ">
                {{ !props.issue.quality_control_name ? props.issue.user.name : props.issue.quality_control_name }}
              </q-banner>
            </div>
            <div class="text-center col-md-9 col-sm-9 col-xs-9">
              <q-avatar size="200px" class="q-mt-md">
                <q-img :width="$q.screen.lt.md ? '100px' : '200px'"
                  :src="!props.issue.qc_image_path ? props.issue.user.image_path : props.issue.qc_image_path"></q-img>
              </q-avatar>
            </div>
            <q-tooltip>Lihat Detail</q-tooltip>
          </div>
          <div class="row">
            <div class="col-md-3 col-sm-3 col-xs-10 q-mt-md">
              <q-banner class="bg-primary text-white ">
                <div class="text-caption">{{ props.issue.plant.name }}</div>
                Shift {{ props.issue.shift }}
              </q-banner>
            </div>
          </div>
          <q-card-section>
            <div class="row justify-center">
              <Doughnut title="Performa Mesin" :data="props.chartData" :options="chartOptions" class="doughnut-chart" />
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section>
            <template v-for="qualityIssue in issue.quality_issues" :key="qualityIssue.id">
              <q-expansion-item expand-separator :label="qualityIssue.problem"
                :caption="'Durasi masalah : ' + qualityIssue.trouble_duration_minutes + ' Menit'">
                <q-card>
                  <q-card-section>
                    <div class="text-body2">Dampak : {{ qualityIssue.impact }}</div>
                    <div class="text-body2">Solusi : {{ qualityIssue.solution }}</div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </template>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { useRouter } from 'vue-router';

const props = defineProps(['chartData', 'issue'])
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)
const router = useRouter();


const chartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Performa Mesin / persentase pemeriksaan',
    },
    subtitle: {
      display: true,
      text: 'Custom Chart Subtitle'
    }
  }
}

const redirectToDetailIssue = (id: string | string[]) => {
  router.push({
    name: 'DetailIssuePage', params: {
      id: id
    }
  })
}

</script>

<style scoped>
.doughnut-chart {
  width: 300px;
  height: 300px;
}

@media only screen and (max-width: 600px) {
  .doughnut-chart {
    width: 200px;
    height: 200px;
  }
}

@media only screen and (max-width: 400px) {
  .doughnut-chart {
    width: 100px;
    height: 100px;
  }
}
</style>
