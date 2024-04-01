<template>
  <div>
    <q-dialog @show="fillInput" v-model="$state.showEditTrackTecordDialog" maximized transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-bar class="bg-primary text-white">
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">Edit Track Record</div>
        </q-card-section>
        <q-form @submit="onSubmit">
          <q-card-section class="q-pt-none">
            <q-input :loading="loadingFill" outlined type="text" autogrow
              v-model="trackRecordForm.quality_control_verification" lazy-rules label="Verifikasi QC *"
              :error="v$.quality_control_verification.$error"
              :error-message="v$.quality_control_verification.$errors.map((e) => e.$message).join()"
              @input="v$.quality_control_verification.$touch" @blur="v$.quality_control_verification.$touch" />
            <q-editor placeholder="Perbaikan yang sudah di lakukan tim Produksi" class="q-mt-md"
              v-model="trackRecordForm.todos" :dense="$q.screen.lt.md" :toolbar="[
      [
        {
          label: $q.lang.editor.align,
          icon: $q.iconSet.editor.align,
          fixedLabel: true,
          list: 'only-icons',
          options: ['left', 'center', 'right', 'justify']
        },
        {
          label: $q.lang.editor.align,
          icon: $q.iconSet.editor.align,
          fixedLabel: true,
          options: ['left', 'center', 'right', 'justify']
        }
      ],
      ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
      ['token', 'hr', 'link', 'custom_btn'],
      ['print', 'fullscreen'],
      [
        {
          label: $q.lang.editor.formatting,
          icon: $q.iconSet.editor.formatting,
          list: 'no-icons',
          options: [
            'p',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'code'
          ]
        },
        {
          label: $q.lang.editor.fontSize,
          icon: $q.iconSet.editor.fontSize,
          fixedLabel: true,
          fixedIcon: true,
          list: 'no-icons',
          options: [
            'size-1',
            'size-2',
            'size-3',
            'size-4',
            'size-5',
            'size-6',
            'size-7'
          ]
        },
        {
          label: $q.lang.editor.defaultFont,
          icon: $q.iconSet.editor.font,
          fixedIcon: true,
          list: 'no-icons',
          options: [
            'default_font',
            'arial',
            'arial_black',
            'comic_sans',
            'courier_new',
            'impact',
            'lucida_grande',
            'times_new_roman',
            'verdana'
          ]
        },
        'removeFormat'
      ],
      ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

      ['undo', 'redo'],
      ['viewsource']
    ]" :fonts="{
      arial: 'Arial',
      arial_black: 'Arial Black',
      comic_sans: 'Comic Sans MS',
      courier_new: 'Courier New',
      impact: 'Impact',
      lucida_grande: 'Lucida Grande',
      times_new_roman: 'Times New Roman',
      verdana: 'Verdana'
    }" />
            <q-file accept=".xlsx, .xls, .csv" class="q-mt-md" outlined v-model="trackRecordForm.discovery_file"
              label="Upload file temuan" bottom-slots>
              <template v-slot:prepend>
                <q-icon name="fa-regular fa-file-excel" />
              </template>
              <template v-slot:hint>
                <q-btn v-if="isDiscoveryFileFound.isNull" flat @click="$state.showDiscoveryFileDialog = true;"
                  :label="'File sebelumnya : ' + isDiscoveryFileFound.fileName"></q-btn>
              </template>
            </q-file>
            <q-checkbox class="q-mt-lg" label="Tutup Issue" v-model="trackRecordForm.closed" />
          </q-card-section>
          <q-card-actions>
            <q-btn type="submit" color="primary" :loading="loading">Submit</q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <ShowDiscoveryFileDialog :fileName="isDiscoveryFileFound.fileName" />
  </div>
</template>

<script setup lang="ts">
import { useTrackRecordStore } from 'src/stores/track-record';
import { TrackRecordEditForm } from 'src/types/track-record';
import { useRequired } from 'src/composables/validators';
import useVuelidate from '@vuelidate/core';
import { reactive, ref } from 'vue';
import { useApiWithAuthorization } from 'src/composables/api';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';
import ShowDiscoveryFileDialog from './ShowDiscoveryFileDialog.vue';

const { $state } = useTrackRecordStore()
const loading = ref(false);
const isDiscoveryFileFound = ref({
  fileName: '',
  isNull: false,
});

const trackRecordForm: TrackRecordEditForm = reactive({
  closed: false,
  quality_control_verification: '',
  todos: '',
  discovery_file: undefined
})
const loadingFill = ref(false);

const rules = {
  closed: { required: useRequired() },
  quality_control_verification: { required: useRequired() },
  todos: { required: useRequired() }
}
const v$ = useVuelidate(rules, trackRecordForm)

const onSubmit = async () => {
  if (!v$.value.$invalid) {
    try {
      loading.value = true;

      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace('T', ' '); // Mengonversi format tanggal

      await useApiWithAuthorization.post(`track-records/${$state.editedIssue}`, {
        ...trackRecordForm, closed_date: formattedDate, _method: 'PUT'
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.data) {
        useErrorNotify(error.message);
      } else {
        console.error('Error:', error);
      }
      throw error;
    } finally {
      $state.showEditTrackTecordDialog = false;
      loading.value = false;
    }
  } else {
    v$.value.$touch();
  }
}



const fillInput = async () => {
  if ($state.showEditTrackTecordDialog) {
    try {
      loadingFill.value = true;
      const response = await useApiWithAuthorization.get(`track-records/${$state.editedIssue}`);

      trackRecordForm.closed = Boolean(response.data.issue.closed);
      if (response.data.issue.todos !== null) {
        trackRecordForm.todos = response.data.issue.todos;
      } else {
        trackRecordForm.todos = '';
      }
      if (response.data.issue.quality_control_verification !== null) {
        trackRecordForm.quality_control_verification = response.data.issue.quality_control_verification;
      } else {
        trackRecordForm.quality_control_verification = '';

      }
      if (response.data.issue.discovery_file !== null) {
        isDiscoveryFileFound.value.fileName = getFileNameFromUrl(response.data.issue.discovery_file);
        isDiscoveryFileFound.value.isNull = true;
      } else {
        isDiscoveryFileFound.value.fileName = '';
        isDiscoveryFileFound.value.isNull = false;
        trackRecordForm.discovery_file = undefined;
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.data) {

        useErrorNotify(error.message);
      } else {
        console.error('Error:', error);
        throw error;
      }
    } finally {
      loadingFill.value = false;
    }
  }
}

function getFileNameFromUrl(url: string): string {
  // Pisahkan URL berdasarkan '/'
  const parts = url.split('/');
  // Ambil bagian terakhir dari array yang dihasilkan
  const fileName = parts[parts.length - 1];
  return fileName;
}
</script>

<style scoped></style>
