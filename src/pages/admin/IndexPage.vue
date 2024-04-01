<template>
  <q-page padding>
    <div id="dashboard-admin">
      <div class="row">
        <div class="col-md-4 col-sm-6 col-xs-10">
          <q-card flat bordered class="q-pa-sm q-ma-sm">
            <q-card-section horizontal>
              <q-icon name="group" size="lg" class="q-mt-sm"></q-icon>
              <q-card-section>
                <div class="text-body1">Jumlah User yang terdaftar : {{ userCount }}</div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-md-4 col-sm-6 col-xs-10">
          <q-card flat bordered class="q-pa-sm q-ma-sm">
            <q-card-section horizontal>
              <q-icon name="report" size="lg" class="q-mt-sm"></q-icon>
              <q-card-section>
                <div class="text-body1">Jumlah Issue yang dibuat : {{ issuesCount }}</div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-md-4 col-sm-6 col-xs-10 ">
          <q-card flat bordered class="q-pa-sm q-ma-sm">
            <q-card-section horizontal>
              <q-icon name="info" size="lg" class="q-mt-sm"></q-icon>
              <q-card-section>
                <div class="text-body1">Jumlah Informasi yang dibuat : {{ informationsCount }}</div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- <IssueChart /> -->
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useMetaTitle } from 'src/composables/meta'
import { useApiWithAuthorization } from 'src/composables/api';
import { onMounted, ref } from 'vue';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';
const userCount = ref(0);
const issuesCount = ref(0);
const informationsCount = ref(0);

const getUserRegisteredCount = async () => {
  try {
    const response = await useApiWithAuthorization.get('users/count')
    userCount.value = response.data.users_count;

  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('An Error Occured:', error);
    }
  }
}
const getIssuesCount = async () => {
  try {
    const response = await useApiWithAuthorization.get('issues/count')
    issuesCount.value = response.data.issues_count;

  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('An Error Occured:', error);
    }
  }
}
const getInformationsCount = async () => {
  try {
    const response = await useApiWithAuthorization.get('informations/count')
    informationsCount.value = response.data.informations_count;

  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      useErrorNotify(error.message);
    } else {
      console.error('An Error Occured:', error);
    }
  }
}

onMounted(async () => {
  await getUserRegisteredCount()
  await getIssuesCount();
  await getInformationsCount();
})
useMetaTitle('Dashboard - Admin')
</script>

<style scoped></style>
