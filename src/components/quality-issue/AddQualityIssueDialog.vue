<template>
  <div>
    <q-dialog v-model="$state.showAddQualityIssueDialog" maximized transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-bar class="bg-primary text-white">
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">Buat Quality Issue</div>
        </q-card-section>
        <q-form @submit="onSubmit">
          <q-card-section class="q-pt-none">
            <q-input outlined type="text" autogrow v-model="addQualityIssueForm.problem" lazy-rules label="Masalah *"
              :error="v$.problem.$error" :error-message="v$.problem.$errors.map((e) => e.$message).join()"
              @input="v$.problem.$touch" @blur="v$.problem.$touch" />
            <q-input outlined type="number" autogrow v-model="addQualityIssueForm.machine_performance" lazy-rules
              label="Performa Mesin *" :error="v$.machine_performance.$error"
              :error-message="v$.machine_performance.$errors.map((e) => e.$message).join()"
              @input="v$.machine_performance.$touch" @blur="v$.machine_performance.$touch" />
            <q-input outlined autogrow v-model="addQualityIssueForm.trouble_duration_minutes" lazy-rules
              label="Durasi Mesin bermasalah *" :error="v$.trouble_duration_minutes.$error"
              :error-message="v$.trouble_duration_minutes.$errors.map((e) => e.$message).join()"
              @input="v$.trouble_duration_minutes.$touch" @blur="v$.trouble_duration_minutes.$touch" />
            <q-input outlined autogrow v-model="addQualityIssueForm.solution" lazy-rules label="Solusi *"
              :error="v$.solution.$error" :error-message="v$.solution.$errors.map((e) => e.$message).join()"
              @input="v$.solution.$touch" @blur="v$.solution.$touch" />
            <q-input outlined autogrow v-model="addQualityIssueForm.impact" lazy-rules label="Dampak *"
              :error="v$.impact.$error" :error-message="v$.impact.$errors.map((e) => e.$message).join()"
              @input="v$.impact.$touch" @blur="v$.impact.$touch" />
            <q-checkbox v-model="addQualityIssueForm.closed" label="Tutup Issue?"></q-checkbox>
          </q-card-section>
          <q-card-actions>
            <q-btn type="submit" color="primary" :loading="loading">Submit</q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useQualityIssueStore } from 'src/stores/qualityIssue';
import { reactive, ref } from 'vue';
import { QualityIssueForm } from 'src/types/qualityIssue';
import { useNumeric, useRequired } from 'src/composables/validators';
import useVuelidate from '@vuelidate/core';
import { useRoute } from 'vue-router';
import { useUserStore } from 'src/stores/user';
import { useQuasar } from 'quasar';
import { AxiosError } from 'axios';

const { $state, addQualityIssue } = useQualityIssueStore()
const { params } = useRoute()
const { dialog } = useQuasar();
const { getUserId } = useUserStore()
const addQualityIssueForm: QualityIssueForm = reactive({
  impact: '',
  machine_performance: '0',
  problem: '',
  solution: '',
  trouble_duration_minutes: 0,
  issue_id: params.id,
  user_id: getUserId,
  closed: false,
  closed_date: null
})

const loading = ref(false);
const rules = {
  problem: { required: useRequired() },
  machine_performance: { required: useRequired(), number: useNumeric() },
  trouble_duration_minutes: { required: useRequired(), number: useNumeric() },
  solution: { required: useRequired() },
  impact: { required: useRequired() },
}

const v$ = useVuelidate(rules, addQualityIssueForm)

const onSubmit = async (): Promise<void> => {
  if (!v$.value.$invalid) {
    try {
      loading.value = true;
      await addQualityIssue(addQualityIssueForm)
    } catch (error) {
      if (error instanceof AxiosError) {
        dialog({
          message: error.message,
          color: 'red'
        })
      }
      throw error;
    } finally {
      loading.value = false;
      $state.showAddQualityIssueDialog = false
    }
  } else {
    v$.value.$touch();
  }
}
</script>

<style scoped></style>
