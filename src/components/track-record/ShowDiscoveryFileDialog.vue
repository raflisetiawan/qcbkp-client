<template>
  <div>
    <q-dialog v-model="$state.showDiscoveryFileDialog" @before-show="downloadExcelFile">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-body1">{{ props.fileName }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div class="text-center" v-show="gettingFile">
            <q-spinner-hourglass color="primary" size="xl" />
            <div class="text-body1">Mengambil file...</div>
          </div>

        </q-card-section>
        <!-- Tambahkan tombol download -->
        <q-card-actions align="around" class="text-primary">
          <q-btn :disable="gettingFile" icon="save" flat label="Download" :href="fileDownloadUrl" target="_blank" />
          <q-btn :disable="gettingFile" icon="preview" flat label="Lihat File" :href="fileUrl" target="_blank" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { useTrackRecordStore } from 'stores/track-record';
import { ref } from 'vue';

const { $state } = useTrackRecordStore();
const fileUrl = ref('');
const props = defineProps(['fileName']);
const { notify } = useQuasar()

const fileDownloadUrl = ref('')
const gettingFile = ref(false);

// Metode untuk mengunduh file Excel dari URL
const downloadExcelFile = async () => {
  try {
    gettingFile.value = true;
    const response = await api.get('file/getexcel', {
      params: {
        id: $state.editedIssue
      }
    });
    // Periksa apakah respons berhasil
    if (response.data.success) {

      fileDownloadUrl.value = response.data.fileurl

      // Konversi base64 ke blob
      const pdfData = atob(response.data.pdf_base64);
      const arrayBuffer = new ArrayBuffer(pdfData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < pdfData.length; i++) {
        uint8Array[i] = pdfData.charCodeAt(i);
      }
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

      // Buat URL objek dari blob respons
      fileUrl.value = window.URL.createObjectURL(blob);

    } else {
      throw new Error(response.data.message);
    }

  } catch (error) {
    notify({
      message: 'Terjadi masalah..',
      color: 'negative',
      icon: 'error'
    })
  } finally {
    gettingFile.value = false;
  }
};

</script>

<style scoped></style>
