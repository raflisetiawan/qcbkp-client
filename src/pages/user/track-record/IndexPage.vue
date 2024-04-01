<template>
  <q-page padding>
    <div class="row">
      <div class="col-md-6 col-sm-8 col-xs-10 q-mb-md">
        <div @keyup.enter="onSubmit()">
          <q-input v-model="keyword" label="Cari" outlined dense>
            <template v-slot:append>
              <q-btn @click="onSubmit()" icon="search" flat></q-btn>
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <Suspense>
      <TableComponent />

      <template #fallback>
        Loading...
      </template>
    </Suspense>
  </q-page>
</template>

<script setup lang="ts">
import { AxiosError } from 'axios';
import { useApiWithAuthorization } from 'src/composables/api';
import { useErrorNotify } from 'src/composables/notifications';
import { useTrackRecordStore } from 'src/stores/track-record';
import { defineAsyncComponent, ref } from 'vue';

const TableComponent = defineAsyncComponent(() => import('components/track-record/TableComponent.vue'))

const { $state } = useTrackRecordStore()
const keyword = ref('');

const onSubmit = async () => {
  try {
    const response = await useApiWithAuthorization.get('track-records', {
      params: { problem: keyword.value }
    });
    $state.track_records = response.data.issues;
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('An Error Occured:', error);
    }
    throw error;
  }
}
</script>

<style scoped></style>
