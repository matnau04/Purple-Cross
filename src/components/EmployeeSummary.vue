<script setup>
// Shows employee count.
defineProps({
  employeeCount: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <!-- Count summary. -->
  <v-sheet class="summary-band" elevation="0" rounded="lg">
    <span class="summary-number">{{ employeeCount }}</span>
    <span class="summary-label">sample employee records loaded</span>
  </v-sheet>
</template>
