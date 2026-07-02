<script setup>
// Delete popup.
defineProps({
  employee: {
    type: Object,
    default: null,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
});

// Sends the user's choice back.
const emit = defineEmits(['cancel', 'confirm', 'update:modelValue']);
</script>

<template>
  <!-- Delete confirmation. -->
  <v-dialog
    :model-value="modelValue"
    max-width="440"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title>Delete employee</v-card-title>
      <v-card-text>
        <!-- Employee may be empty while closing. -->
        Delete {{ employee?.fullName }} from the employee list?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="emit('cancel')">
          Cancel
        </v-btn>
        <v-btn color="error" variant="flat" @click="emit('confirm')">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
