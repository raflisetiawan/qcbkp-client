<template>
  <div>
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Buat Issue</div>
        </q-card-section>
        <q-form @submit="onSubmit">
          <q-card-section class="q-pt-none">
            <q-input outlined dense v-model="issueForm.shift" autofocus label="Shift" />
            <q-input outlined dense class="q-mt-md" :error="v$.quality_control_name.$error"
              :error-message="v$.quality_control_name.$errors.map((e) => e.$message).join()"
              @input="v$.quality_control_name.$touch" @blur="v$.quality_control_name.$touch"
              v-model="issueForm.quality_control_name" autofocus label="Nama QC" />
            <q-file dense outlined v-model="issueForm.qc_image" label="Upload gambar QC" />
            <q-select dense class="q-mt-md" outlined v-model="issueForm.plant" :options="options" label="Pilih Plant" />
            <q-input filled v-model="issueForm.issue_date" mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="issueForm.issue_date">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" @click="$emit('closeAddIssueDialog')" />
            <q-btn color="primary" label="Submit" type="submit" :loading="loading" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from 'vue';
import { AddIssueFormAdmin } from 'src/types/issue'
import { useUserStore } from 'src/stores/user';
import { useIssueStore } from 'src/stores/issue';
import { useQuasar, date } from 'quasar';
import { AxiosError } from 'axios';
import { usePlantStore } from 'src/stores/plant';
import { QSelectOption } from 'quasar';
import { useRequired } from 'src/composables/validators';
import useVuelidate from '@vuelidate/core';
import { useErrorNotify } from 'src/composables/notifications';

const { getAllPlant } = usePlantStore()
const issueForm = reactive<AddIssueFormAdmin>({
  shift: 1,
  issue_date: date.formatDate(Date.now(), 'YYYY/MM/DD'),
  quality_control_name: '',
  plant: {
    label: '',
    value: ''
  },
  qc_image: null
})
const loading = ref(false)
const options = ref<QSelectOption[]>([])

const { notify, } = useQuasar()
const { $state } = useUserStore()
const { addIssue, $state: issueState } = useIssueStore()
const props = defineProps(['showIssueDialog'])
const dialog = computed(() => props.showIssueDialog);

const emits = defineEmits(['closeAddIssueDialog'])

const rules = {
  quality_control_name: { required: useRequired() }
}

const v$ = useVuelidate(rules, issueForm)

const onSubmit = async () => {
  try {
    loading.value = true;
    issueState.filterDate = issueForm.issue_date
    await addIssue(issueForm, $state.id)
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422) {
        notify({
          color: 'red',
          message: error.response.data.message
        })
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  } finally {
    loading.value = false;
    emits('closeAddIssueDialog');
  }
}

const setOptions = async () => {
  try {
    const data = await getAllPlant();
    if (data.length !== 0) {
      // Mengubah struktur data
      const transformedData: QSelectOption[] = data.map(item => ({ label: item.name, value: item.id }));

      // Mengassign hasil transformasi ke variabel options
      options.value = transformedData;
      issueForm.plant.label = options.value[0].label;
      issueForm.plant.value = options.value[0].value;
    } else {
      options.value.push({
        label: 'Plant tidak tersedia',
        value: 'kosong'
      })
    }



  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('Error fetching quality issue:', error);
    }
  }
}

watchEffect(async () => {
  if (options.value.length === 0) {
    await setOptions();
  }
})




</script>

<style scoped></style>
