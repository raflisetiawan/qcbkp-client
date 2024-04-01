<template>
  <div>
    <InformationTable :isUser="true" />
  </div>
</template>

<script setup lang="ts">
import InformationTable from 'src/components/information/InformationTable.vue';
import { useMetaTitle } from 'src/composables/meta';
useMetaTitle('Informasi');
</script>

<style scoped></style>
