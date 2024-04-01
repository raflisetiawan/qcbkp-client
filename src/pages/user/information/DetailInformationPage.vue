<template>
  <div class="q-pa-md">
    <div class="text-center text-h3">{{ information?.title }}</div>
    <div class="text-subtitle2">di buat tanggal {{ date.formatDate(information?.created_at, 'DD MMMM YYYY',
      useIndonesianLocale) }}</div>
    <div class="row q-pa-md">
      <div class="col-12">
        <div v-html="information?.information"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInformationStore } from 'src/stores/information';
import { Information } from 'src/types/information';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { date } from 'quasar';
import { useIndonesianLocale } from 'src/composables/date';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';

const { params } = useRoute();
const { showInformation } = useInformationStore()
const information = ref<Information>()
onMounted(async () => {
  try {
    const data = await showInformation(params.id);
    information.value = data;
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('An Error Occured:', error);
    }
  }
})
</script>

<style scoped></style>
