<template>
  <div>
    <q-dialog v-model="$state.showEditMemoDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card>
        <q-bar class="bg-primary text-white">
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">Edit Memo</div>
        </q-card-section>
        <q-form @submit="onSubmit">
          <q-card-section class="q-pt-none">
            <div class="row">
              <div class="col-6">
                <q-input outlined type="text" class="q-mr-sm" autogrow v-model="addMemoForm.title" lazy-rules
                  label="Judul *" :error="v$.title.$error"
                  :error-message="v$.title.$errors.map((e) => e.$message).join()" @input="v$.title.$touch"
                  @blur="v$.title.$touch" />
              </div>
            </div>
            <q-editor class="q-mt-md" v-model="addMemoForm.memo" :dense="$q.screen.lt.md" :toolbar="[
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
import { reactive, ref, watchEffect } from 'vue';
import { useRequired } from 'src/composables/validators';
import useVuelidate from '@vuelidate/core';
import { useMemoStore } from 'src/stores/memo';
import { Memo } from 'src/types/memo';
import { useRoute } from 'vue-router';
import { AxiosError } from 'axios';
import { useErrorNotify } from 'src/composables/notifications';

const { $state, updateMemo } = useMemoStore()
const addMemoForm: Memo = reactive({
  memo: '',
  title: '',
})
const { params } = useRoute();

const loading = ref(false);
const rules = {
  title: { required: useRequired() },
  memo: { required: useRequired() }
}

const v$ = useVuelidate(rules, addMemoForm)

const onSubmit = async (): Promise<void> => {
  if (!v$.value.$invalid) {
    try {
      loading.value = true;
      await updateMemo({ ...addMemoForm, issue_id: params.issueId })
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.data) {
        useErrorNotify(error.message);
      } else {
        console.error('Error fetching quality issue:', error);
      }
    } finally {
      loading.value = false;
      $state.showEditMemoDialog = false
    }
  } else {
    v$.value.$touch();
  }
}

watchEffect(() => {
  addMemoForm.id = $state.editedMemo.id;
  addMemoForm.memo = $state.editedMemo.memo;
  addMemoForm.title = $state.editedMemo.title;
})
</script>

<style scoped></style>
