<template>
  <div class="q-pa-md">
    <div class="text-h6">Detail Quality Issue</div>
    <div class="row q-my-sm items-center">
      <div class="col-3">
        <div class="text-body1 ">Tanggal : </div>
      </div>
      <div class="text-body1 col-9">{{ date.formatDate(qualityIssue.quality_issue.issue_date, 'dddd, DD MMMM YYYY',
        useIndonesianLocale)
        }}</div>
    </div>
    <div class="row q-my-sm items-center">
      <div class="col-3">
        <div class="text-body1 ">Shift : </div>
      </div>
      <div class="text-body1 col-9">{{ qualityIssue.quality_issue.shift }}</div>
    </div>
    <div class="row q-my-sm items-center">
      <div class="col-3">
        <div class="text-body1 ">Masalah : </div>
      </div>
      <div class="text-body1 col-9">{{ qualityIssue.quality_issue.problem }}</div>
    </div>
    <div class="row q-my-sm items-center">
      <div class="col-3">
        <div class="text-body1 ">Performa Mesin : </div>
      </div>
      <div class="text-body1 col-9">{{ qualityIssue.quality_issue.machine_performance }} %</div>
    </div>
    <div class="row q-my-sm items-center">
      <div class="col-3">
        <div class="text-body1 ">Durasi Masalah : </div>
      </div>
      <div class="text-body1 col-9">{{ qualityIssue.quality_issue.trouble_duration_minutes }} Menit</div>
    </div>
    <div class="row q-my-sm items-center">
      <div class="col-3">
        <div class="text-body1 ">Solusi : </div>
      </div>
      <div class="text-body1 col-9">{{ qualityIssue.quality_issue.solution }}</div>
    </div>
    <div class="row q-my-sm items-center">
      <div class="col-3">
        <div class="text-body1 ">Dampak : </div>
      </div>
      <div class="text-body1 col-9">{{ qualityIssue.quality_issue.impact }}</div>
    </div>
    <div class="row q-my-sm items-center">
      <div class="col-3">
        <div class="text-body1 ">Sifat Issue : </div>
      </div>
      <div class="text-body1 col-9">{{ qualityIssue.quality_issue.closed ? 'Issue di tutup' : 'Issue di buka' }}</div>
    </div>
    <div class="row q-my-sm items-center" v-if="qualityIssue.quality_issue.closed">
      <div class="col-3">
        <div class="text-body1 ">Issue di tutup pada tanggal: : </div>
      </div>
      <div class="text-body1 col-9">{{ date.formatDate(qualityIssue.quality_issue.closed_date, 'dddd, DD MMMM YYYY',
        useIndonesianLocale) }}</div>
    </div>
    <div class="row q-my-sm items-center ">
      <div class="col-3">
        <div class="text-body1 ">Perbaikan yang sudah dilakukan tim Produksi : </div>
      </div>
      <div class="text-body1 col-9" v-html="qualityIssue.quality_issue.todos"></div>
    </div>
    <div class="row q-my-sm  items-center">
      <div class="col-3">
        <div class="text-body1 ">Verifikasi Quality Control : </div>
      </div>
      <div class="text-body1 col-9">{{ qualityIssue.quality_issue.quality_control_verification }}</div>
    </div>
    <div class="row q-my-sm  items-center" v-if="qualityIssue.quality_issue.discovery_file !== undefined">
      <div class="col-3">
        <div class="text-body1 ">File temuan : </div>
      </div>
      <div class="text-body1 col-9"><q-btn flat
          @click="$state.showDiscoveryFileDialog = true; $state.editedIssue = qualityIssue.quality_issue.id"
          :label="'' + qualityIssue.quality_issue.discovery_file"></q-btn></div>
    </div>
    <div class="row q-my-sm items-center">
      <div class="col-3">
        <div class="text-body1 ">Di buat Tanggal : </div>
      </div>
      <div class="text-body1 col-9">{{ date.formatDate(qualityIssue.quality_issue.created_at,
        'dddd, DD MMMM YYYY - HH: mm',
        useIndonesianLocale) }}</div>
    </div>
    <div class="row q-mt-md">
      <div class="text-h6">Quality Control</div>
    </div>
    <div class="row q-mt-md">
      <q-card class="my-card" flat>
        <q-item>
          <q-item-section avatar>
            <q-avatar style="width: 100px; height: 100px">
              <img :src="qualityIssue?.issue.qc_image">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Nama QC: {{ qualityIssue?.issue.quality_control_name }}</q-item-label>
            <q-item-label>Shift: {{ qualityIssue?.issue.shift }}</q-item-label>
            <q-item-label>Plant: {{ qualityIssue?.issue.plant_name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
    </div>
    <ShowDiscoveryFileDialog :fileName="fileName" />
  </div>
</template>

<script setup lang="ts">
import { useQualityIssueStore } from 'src/stores/qualityIssue';
import { QualityIssueWithIssueAndUser } from 'src/types/qualityIssue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { date } from 'quasar'
import { useMetaTitle } from 'src/composables/meta';
import { useIndonesianLocale } from 'src/composables/date';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';
import { useTrackRecordStore } from 'src/stores/track-record';
import ShowDiscoveryFileDialog from 'src/components/track-record/ShowDiscoveryFileDialog.vue';

const { params } = useRoute();
const { getQualityIssueById } = useQualityIssueStore();
const { $state } = useTrackRecordStore()
const fileName = ref(undefined);
const qualityIssue: QualityIssueWithIssueAndUser = reactive({
  issue: {
    shift: '', // Sesuaikan dengan tipe yang didefinisikan dalam antarmuka
    plant_name: '',
    quality_control_name: '',
    qc_image: ''
  },
  success: false, // Atau sesuai dengan nilai default yang sesuai
  quality_issue: {
    id: 0,
    problem: '',
    machine_performance: '',
    trouble_duration_minutes: 0,
    solution: '',
    impact: '',
    user_id: 0,
    shift: '', // Sesuaikan dengan tipe yang didefinisikan dalam antarmuka
    issue_date: '',
    user_name: '',
    todos: '',
    quality_control_verification: '',
    closed: 0,
    closed_date: '',
    created_at: '',
    discovery_file: undefined,
  }
});
onMounted(async () => {
  try {
    const response = await getQualityIssueById(params.id)

    qualityIssue.quality_issue.id = response.quality_issue.id;
    qualityIssue.quality_issue.impact = response.quality_issue.impact;
    qualityIssue.quality_issue.machine_performance = response.quality_issue.machine_performance;
    qualityIssue.quality_issue.problem = response.quality_issue.problem;
    qualityIssue.quality_issue.solution = response.quality_issue.solution;
    qualityIssue.quality_issue.user_id = response.quality_issue.user_id;
    qualityIssue.quality_issue.shift = response.quality_issue.shift;
    qualityIssue.quality_issue.issue_date = response.quality_issue.issue_date;
    qualityIssue.quality_issue.user_name = response.quality_issue.user_name;
    qualityIssue.quality_issue.todos = response.quality_issue.todos;
    qualityIssue.quality_issue.quality_control_verification = response.quality_issue.quality_control_verification;
    qualityIssue.quality_issue.closed = response.quality_issue.closed;
    qualityIssue.quality_issue.closed_date = response.quality_issue.closed_date;
    qualityIssue.quality_issue.created_at = response.quality_issue.created_at;

    qualityIssue.issue.plant_name = response.issue.plant_name;
    qualityIssue.issue.quality_control_name = response.issue.quality_control_name;
    qualityIssue.issue.shift = response.issue.shift;
    qualityIssue.issue.qc_image = response.issue.qc_image;
    qualityIssue.success = true;

    if (response.quality_issue.discovery_file !== null) {
      qualityIssue.quality_issue.discovery_file = response.quality_issue.discovery_file;
      fileName.value = response.quality_issue.discovery_file
    }



  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.response.data);
    } else {
      console.error('Error fetching quality issue:', error);
    }
    throw error;
  }
})
useMetaTitle('Detail Quality Issue')
</script>

<style scoped></style>
