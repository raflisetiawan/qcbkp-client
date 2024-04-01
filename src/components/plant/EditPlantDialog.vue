<template>
  <div>
    <q-dialog v-model="$state.editPlantDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card>
        <q-bar class="bg-primary text-white">
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">Edit Plant</div>
        </q-card-section>
        <q-form @submit="onSubmit">
          <q-card-section class="q-pt-none">
            <div class="row">
              <div class="col-6">
                <q-input outlined type="text" class="q-mr-sm" autogrow v-model="editPlantForm.name" lazy-rules
                  label="Judul *" :error="v$.name.$error" :error-message="v$.name.$errors.map((e) => e.$message).join()"
                  @input="v$.name.$touch" @blur="v$.name.$touch" />
                <q-input outlined type="text" class="q-mr-sm" autogrow v-model="editPlantForm.description" lazy-rules
                  label="Deskripsi *" :error="v$.description.$error"
                  :error-message="v$.description.$errors.map((e) => e.$message).join()" @input="v$.description.$touch"
                  @blur="v$.description.$touch" />
              </div>
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn type="submit" color="primary" :loading="loading">Edit</q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { usePlantStore } from 'src/stores/plant';
import { PlantForm } from 'src/types/plant';

import { reactive, ref, watchEffect } from 'vue';
import { useRequired } from 'src/composables/validators';
import useVuelidate from '@vuelidate/core';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';

const { $state, updatePlant } = usePlantStore()
const editPlantForm: PlantForm = reactive({
  description: '',
  name: ''
})

const loading = ref(false);
const rules = {
  name: { required: useRequired() },
  description: { required: useRequired() },
}

const v$ = useVuelidate(rules, editPlantForm)

const onSubmit = async (): Promise<void> => {
  if (!v$.value.$invalid) {
    try {
      loading.value = true;
      await updatePlant({ ...editPlantForm, id: $state.editedPlant.id })
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.data) {
        useErrorNotify(error.message);
      } else {
        console.error('Error fetching quality issue:', error);
      }
    } finally {
      loading.value = false;
      $state.editPlantDialog = false
    }
  } else {
    v$.value.$touch();
  }
}

watchEffect(() => {
  editPlantForm.description = $state.editedPlant.description
  editPlantForm.name = $state.editedPlant.name
})
</script>

<style scoped></style>
