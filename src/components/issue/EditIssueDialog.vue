<template>
  <div>
    <q-dialog v-model="dialog" persistent @before-show="setSelectedOptions()">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Edit Issue</div>
        </q-card-section>
        <q-form @submit="onSubmit">
          <q-card-section class="q-pt-none">
            <q-input dense v-model="issueForm.shift" autofocus label="Shift" />
            <q-select class="q-my-md" outlined v-model="issueForm.plant" :options="options" label="Pilih Plant" />
            <q-input filled v-model="issueForm.issue_date" mask="date" :rules="['date']" label="Tanggal Issue">
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
            <q-btn flat label="Cancel" @click="$emit('closeEditIssueDialog')" />
            <q-btn color="primary" label="Submit" type="submit" :loading="loading" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from 'vue';
import { EditedIssue } from 'src/types/issue'
import { useIssueStore } from 'src/stores/issue';
import { QSelectOption, useQuasar } from 'quasar';
import { AxiosError } from 'axios';
import { usePlantStore } from 'src/stores/plant';
import type { PropType } from 'vue';
import { useErrorNotify } from 'src/composables/notifications';

const props = defineProps({
  editedData: { type: Object as PropType<EditedIssue>, required: true },
  showEditIssueDialog: Boolean
})
const { getAllPlant } = usePlantStore()
const issueForm = reactive<EditedIssue>({
  shift: 0,
  issue_date: '',
  id: 0,
  user_id: 0,
  plant: {
    label: '',
    value: ''
  }
})
const loading = ref(false);
const options = ref<QSelectOption[]>([]);

const { notify, } = useQuasar()
const { updateIssue, $state: issueState } = useIssueStore()
const dialog = computed(() => props.showEditIssueDialog);

const emits = defineEmits(['closeEditIssueDialog'])

const onSubmit = async () => {
  try {
    loading.value = true;
    issueState.filterDate = issueForm.issue_date
    await updateIssue(issueForm)
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422) {
        notify({
          color: 'red',
          message: error.response.data.message
        })
      }
    } else {
      throw error;
    }
  } finally {
    loading.value = false;
    emits('closeEditIssueDialog');
  }
}

const setOptions = async () => {
  try {
    const data = await getAllPlant();

    if (data.length !== 0) {
      const transformedData: QSelectOption[] = data.map(item => ({ label: item.name, value: item.id }));
      options.value = transformedData;
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

const setSelectedOptions = () => {
  const selectedOptions = options.value.find((option) => {
    return option.value == props.editedData.plant.value
  })
  if (selectedOptions) {
    issueForm.plant = selectedOptions;
  }
}

watchEffect(async () => {

  if (options.value.length === 0) {
    await setOptions();

    issueForm.shift = props.editedData.shift
    issueForm.issue_date = props.editedData.issue_date
    issueForm.id = props.editedData.id
    issueForm.user_id = props.editedData.user_id
  } else {
    issueForm.shift = props.editedData.shift
    issueForm.issue_date = props.editedData.issue_date
    issueForm.id = props.editedData.id
    issueForm.user_id = props.editedData.user_id

  }

})

</script>

<style scoped></style>
