<template>
  <div>
    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Akun Anda belum disetujui oleh admin. Mohon tunggu persetujuan.</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-btn class="q-mb-md" label="Hubungi Admin Melalui Via Whatsapp" href="https://wa.me/+6281334388233"
            target="_blank" color="green" icon-right="fa-brands fa-whatsapp"></q-btn>
          <q-btn label="Hubungi Admin Melalui Via Email" color="red" icon-right="mail"
            href="mailto:raflisetiawan654@gmail.com"></q-btn>

        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" @click="$emit('closeApprovalMessageDialog')" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps(['showApprovalMessage'])
const dialog = computed(() => props.showApprovalMessage);
</script>

<style scoped></style>
