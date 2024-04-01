<template>
  <q-page padding>
    <div class="text-h4">Detail Issue</div>
    <div class="text-overline">{{ date.formatDate(issue?.issue_date, 'dddd, DD MMMM YYYY', useIndonesianLocale) }}</div>
    <div class="row ">
      <q-card class="my-card" flat>
        <q-item>
          <q-item-section avatar>
            <q-avatar style="width: 100px; height: 100px">
              <img :src="issue?.qc_image_path">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Nama QC: {{ issue?.quality_control_name }}</q-item-label>
            <q-item-label>Shift: {{ issue?.shift }}</q-item-label>
            <q-item-label>Plant: {{ issue?.plant.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
    </div>
    <q-separator class="q-my-md"></q-separator>
    <div class="text-h5">Issue</div>
    <div class="row q-my-xs items-center">
      <div class="col-md-2 col-sm-4 col-xs-6">
        <div class="text-body1 text-weight-bold"> Close Issue:</div>
      </div>
      <div class="col-md-10 col-sm-8 col-xs-6">
        <div class="text-body2"> {{ issue?.closed === 1 ? 'Issue sudah di tutup' : 'Issue di buka' }}
          <q-icon :name="issue?.closed === 1 ? 'done' : 'close'" :color="issue?.closed === 1 ? 'green' : 'red'"
            size="md"></q-icon>
        </div>
      </div>
    </div>
    <div class="row q-my-xs items-center" v-if="issue?.closed_date !== null">
      <div class="col-md-3 col-sm-4 col-xs-6">
        <div class="text-body1 text-weight-bold"> Issue di tutup pada tanggal:</div>
      </div>
      <div class="col-md-9 col-sm-8 col-xs-6">
        <div class="text-body2"> {{ date.formatDate(issue?.closed_date, 'dddd, DD MMMM YYYY',
      useIndonesianLocale) }}
        </div>
      </div>
    </div>
    <div class="row q-my-md">
      <div class="col">
        <div class="text-body1 text-weight-bold"> Perbaikan yang sudah dilakukan tim Produksi:</div>
        <div v-html="issue?.todos"></div>
      </div>
      <div class="col-md-6 col-sm-8 col-xs-6">
      </div>
    </div>
    <div class="row q-my-md">
      <div class="col">
        <div class="text-body1 text-weight-bold"> Verifikasi Quality Control:</div>
        <div class="text-body2">{{ issue?.quality_control_verification }}</div>
      </div>
    </div>
    <q-separator class="q-my-md"></q-separator>
    <div class="text-h5">Main Issue</div>
    <div class="row q-mb-xs" v-if="issue?.quality_issues.length === 0">Tidak ada quality issues untuk issue ini.>
    </div>
    <div v-if="issue?.quality_issues.length === 0">Tidak ada quality issues untuk issue ini.</div>
    <div v-else>
      <q-list bordered class="rounded-borders">
        <div>
          <q-expansion-item expand-separator popup v-for="(qualityIssue, index) in issue?.quality_issues" :key="index"
            :label="qualityIssue.problem">
            <q-card>
              <q-card-section>
                <div class="row">
                  <div class="col-md-2 col-sm-4 col-xs-6">Performa Mesin:</div>
                  <div class="col-md-10 col-sm-8 col-xs-6">{{ qualityIssue.machine_performance }} %</div>
                </div>
                <div class="row">
                  <div class="col-md-2 col-sm-4 col-xs-6">Durasi Masalah: </div>
                  <div class="col-md-10 col-sm-8 col-xs-6">{{ qualityIssue.trouble_duration_minutes }} Menit</div>
                </div>
                <div class="row">
                  <div class="col-md-2 col-sm-4 col-xs-6">Solusi: </div>
                  <div class="col-md-10 col-sm-8 col-xs-6">{{ qualityIssue.solution }}</div>
                </div>
                <div class="row">
                  <div class="col-md-2 col-sm-4 col-xs-6">Impact: </div>
                  <div class="col-md-10 col-sm-8 col-xs-6">{{ qualityIssue.impact }}</div>
                </div>
                <div class="row">
                  <div class="col-md-2 col-sm-4 col-xs-6">Dibuat pada tanggal: </div>
                  <div class="col-md-10 col-sm-8 col-xs-6">{{
      date.formatDate(qualityIssue.created_at, 'dddd, DD MMMMYYYY',
        useIndonesianLocale) }}</div>
                </div>
                <div class="row">
                  <div class="col-md-2 col-sm-4 col-xs-6">Di Update pada tanggal: </div>
                  <div class="col-md-10 col-sm-8 col-xs-6">{{
      date.formatDate(qualityIssue.updated_at, 'dddd, DD MMMM YYYY',
                    useIndonesianLocale) }}</div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </q-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useApiWithAuthorization } from 'src/composables/api';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { date } from 'quasar';
import { useIndonesianLocale } from 'src/composables/date';
import { useMetaTitle } from 'src/composables/meta';
import { useErrorNotify } from 'src/composables/notifications';
import { AxiosError } from 'axios';

interface QualityIssue {
  id: number;
  issue_id: number;
  user_id: number;
  problem: string;
  machine_performance: string;
  trouble_duration_minutes: number;
  solution: string;
  impact: string;
  created_at: string;
  updated_at: string;
}

interface Plant {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Issue {
  id: number;
  user_id: number;
  plant_id: number;
  shift: string;
  quality_control_name: string;
  qc_image: string;
  issue_date: string;
  created_at: string;
  updated_at: string;
  qc_image_path: string;
  quality_issues: QualityIssue[];
  plant: Plant;
  todos: string;
  closed: number;
  quality_control_verification: string;
  closed_date: string | null;
}

const route = useRoute();
const issue = ref<Issue>();
const getData = async () => {
  try {
    const response = await useApiWithAuthorization.get(`issue/${route.params.id}/detail`);
    issue.value = response.data.issue;

  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('Error fetching quality issue:', error);
    }
  }
}


onMounted(async () => {
  await getData();
})

useMetaTitle('Detail Issue')
</script>

<style scoped></style>
