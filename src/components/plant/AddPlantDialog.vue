<template>
  <div>
    <q-dialog v-model="$state.addPlantDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card>
        <q-bar class="bg-primary text-white">
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">Buat Plant</div>
        </q-card-section>
        <q-form @submit="onSubmit">
          <q-card-section class="q-pt-none">
            <div class="row">
              <div class="col-md-6 col-sm-8 col-xs-10">
                <q-input outlined type="text" class="q-mr-sm" autogrow v-model="addPlantForm.name" lazy-rules
                  label="Judul *" :error="v$.name.$error" :error-message="v$.name.$errors.map((e) => e.$message).join()"
                  @input="v$.name.$touch" @blur="v$.name.$touch" />
                <q-input outlined type="text" class="q-mr-sm" autogrow v-model="addPlantForm.description" lazy-rules
                  label="Deskripsi *" :error="v$.description.$error"
                  :error-message="v$.description.$errors.map((e) => e.$message).join()" @input="v$.description.$touch"
                  @blur="v$.description.$touch" />
              </div>
            </div>
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
import { usePlantStore } from 'src/stores/plant';
import { PlantForm } from 'src/types/plant';

import { reactive, ref } from 'vue';
import { useRequired } from 'src/composables/validators';
import useVuelidate from '@vuelidate/core';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';

const { $state, addPlant } = usePlantStore()
const addPlantForm: PlantForm = reactive({
  description: '',
  name: ''
})

const loading = ref(false);
const rules = {
  name: { required: useRequired() },
  description: { required: useRequired() },
}

const v$ = useVuelidate(rules, addPlantForm)

const onSubmit = async (): Promise<void> => {
  if (!v$.value.$invalid) {
    try {
      loading.value = true;
      await addPlant(addPlantForm)
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.data) {
        useErrorNotify(error.message);
      } else {
        console.error('Error fetching quality issue:', error);
      }
    } finally {
      loading.value = false;
      $state.addPlantDialog = false
    }
  } else {
    v$.value.$touch();
  }
}
</script>

<style scoped></style>
