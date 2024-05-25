<template>
  <div>
    <q-markup-table wrap-cells>
      <thead>
        <tr>
          <th class="text-left">Main Issue</th>
          <th class="text-left">Open Issue</th>
          <th class="text-left">Close Issue</th>
          <th class="text-left">Perbaikan yang sudah di lakukan Tim Produksi</th>
          <th class="text-left">Verifikasi QC</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trackrecord in $state.track_records" :key="trackrecord.id"
          @click="$router.push({ name: 'QualityIssueDetailPage', params: { id: trackrecord.id } })"
          class="cursor-pointer">
          <td class="text-left">
            <p>{{ trackrecord.problem }}</p>
            <q-btn size="sm" color="primary" flat dense label="Lihat selengkapnya"
              :to="{ name: 'QualityIssueDetailPage', params: { id: trackrecord.id } }"></q-btn>
          </td>
          <td class="text-left">{{ date.formatDate(trackrecord.issue_date, 'dddd, DD MMMM YYYY', useIndonesianLocale) }}
          </td>
          <td class="text-left"><q-icon :name="trackrecord.closed === 1 ? 'done' : 'close'"
              :color="trackrecord.closed === 1 ? 'green' : 'red'"></q-icon></td>
          <td class="text-left">
            <div class="row">
              <div class="col-4">
                <div v-html="truncateText(trackrecord.todos)"
                  v-if="typeof trackrecord.todos === 'string' && trackrecord.todos !== null">
                </div>
                <div v-else>
                  {{ trackrecord.todos }}
                </div>
              </div>
            </div>
          </td>
          <td class=" text-left">
            <p
              v-if="typeof trackrecord.quality_control_verification === 'string' && trackrecord.quality_control_verification !== null">
              {{ truncateText(trackrecord.quality_control_verification) }}
            </p>
            <p v-else>
              {{ trackrecord.quality_control_verification }}
            </p>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup lang="ts" async>
import { useApiWithAuthorization } from 'src/composables/api';
import { useTrackRecordStore } from 'stores/track-record'
import { date } from 'quasar';
import { useIndonesianLocale } from 'src/composables/date';
import { useMetaTitle } from 'src/composables/meta';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';

const { $state } = useTrackRecordStore()

try {
  const response = await useApiWithAuthorization.get('track-records');
  $state.track_records = response.data.issues;


} catch (error) {
  if (error instanceof AxiosError && error.response && error.response.data) {
    useErrorNotify(error.message);
  } else {
    console.error('Error fetching quality issue:', error);
  }
  throw error;
}

const truncateText = (text: string) => {
  if (text.length > 40) {
    return text.substring(0, 30) + '...'
  } else {
    return text
  }
}

useMetaTitle('Track record')
</script>

<style scoped></style>
