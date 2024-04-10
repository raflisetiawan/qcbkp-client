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
            <q-select class="q-mb-md" outlined label="Masalah" :model-value="addQualityIssueForm.problem" use-input
              hide-selected fill-input input-debounce="0" :options="options" @filter="filterFn" @input-value="setModel">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input outlined type="number" autogrow v-model="addQualityIssueForm.machine_performance" lazy-rules
              label="Performa Mesin *" :error="v$.machine_performance.$error"
              :error-message="v$.machine_performance.$errors.map((e) => e.$message).join()"
              @input="v$.machine_performance.$touch" @blur="v$.machine_performance.$touch" />
            <q-input outlined autogrow v-model="addQualityIssueForm.trouble_duration_minutes" lazy-rules
              label="Durasi Mesin bermasalah *" :error="v$.trouble_duration_minutes.$error"
              :error-message="v$.trouble_duration_minutes.$errors.map((e) => e.$message).join()"
              @input="v$.trouble_duration_minutes.$touch" @blur="v$.trouble_duration_minutes.$touch" />
            <q-select class="q-mb-md" outlined label="Solusi" :model-value="addQualityIssueForm.solution" use-input
              hide-selected fill-input input-debounce="0" :options="solutionOptions" @filter="filterFnSolution"
              @input-value="setSolutionModel">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select class="q-mb-md" outlined label="Dampak *" :model-value="addQualityIssueForm.impact" use-input
              hide-selected fill-input input-debounce="0" :options="impactOptions" @filter="filterFnImpact"
              @input-value="setImpactModel">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
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
import { useApiWithAuthorization } from 'src/composables/api';

const { $state, addQualityIssue } = useQualityIssueStore()
const { params } = useRoute()
const { dialog } = useQuasar();
const { getUserId } = useUserStore()
const { notify } = useQuasar();

const stringOptions = ref([]);
const solutionStringOptions = ref([]);
const impactStringOptions = ref([]);
const options = ref(stringOptions.value)
const solutionOptions = ref(solutionStringOptions.value)
const impactOptions = ref(impactStringOptions.value)

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

let timeoutId: string | number | NodeJS.Timeout | undefined;

const filterFn = async (val: string, update: any) => {
  // Bersihkan timeout sebelumnya
  clearTimeout(timeoutId);

  // Atur timeout baru
  timeoutId = setTimeout(async () => {
    if (val.length >= 5) {
      // Memperbarui hasil setelah penundaan
      try {
        const response = await useApiWithAuthorization.get('quality-issue/get-sugestion/suggestions', {
          params: {
            query: val
          }
        });
        stringOptions.value = response.data.suggestions;
      } catch (error) {
        notify({
          message: 'Terjadi kesalahan',
          color: 'negative',
          icon: 'error'
        })
      }

      update(() => {
        const needle = val.toLocaleLowerCase();
        options.value = stringOptions.value.filter((v: string) => v.toLocaleLowerCase().indexOf(needle) > -1);
      })

    }
  }, 500);
};
const filterFnSolution = async (val: string, update: any) => {
  // Bersihkan timeout sebelumnya
  clearTimeout(timeoutId);

  // Atur timeout baru
  timeoutId = setTimeout(async () => {
    if (val.length >= 5) {
      // Memperbarui hasil setelah penundaan
      try {
        const response = await useApiWithAuthorization.get('quality-issue/get-sugestion-solution/suggestions', {
          params: {
            query: val
          }
        });
        solutionStringOptions.value = response.data.suggestions;
      } catch (error) {
        notify({
          message: 'Terjadi kesalahan',
          color: 'negative',
          icon: 'error'
        })
      }

      update(() => {
        const needle = val.toLocaleLowerCase();
        solutionOptions.value = solutionStringOptions.value.filter((v: string) => v.toLocaleLowerCase().indexOf(needle) > -1);
      })

    }
  }, 500);
};
const filterFnImpact = async (val: string, update: any) => {
  // Bersihkan timeout sebelumnya
  clearTimeout(timeoutId);

  // Atur timeout baru
  timeoutId = setTimeout(async () => {
    if (val.length >= 5) {
      // Memperbarui hasil setelah penundaan
      try {
        const response = await useApiWithAuthorization.get('quality-issue/get-sugestion-impact/suggestions', {
          params: {
            query: val
          }
        });
        impactStringOptions.value = response.data.suggestions;
      } catch (error) {
        notify({
          message: 'Terjadi kesalahan',
          color: 'negative',
          icon: 'error'
        })
      }

      update(() => {
        const needle = val.toLocaleLowerCase();
        impactOptions.value = impactStringOptions.value.filter((v: string) => v.toLocaleLowerCase().indexOf(needle) > -1);
      })

    }
  }, 500);
};


const setModel = (val: string) => {
  addQualityIssueForm.problem = val
}

const setSolutionModel = (val: string) => {
  addQualityIssueForm.solution = val
}
const setImpactModel = (val: string) => {
  addQualityIssueForm.impact = val
}
</script>

<style scoped></style>
