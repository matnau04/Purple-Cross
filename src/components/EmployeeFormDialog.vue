<script setup>
import { ref } from 'vue';

// Create/edit form popup.
defineProps({
  codeRules: {
    type: Array,
    required: true,
  },
  form: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
  terminationDateRules: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

// Checks the form before saving.
const emit = defineEmits(['cancel', 'save', 'update:modelValue']);
const formRef = ref(null);
const requiredRule = (value) => Boolean(String(value ?? '').trim()) || 'This field is required.';

const submitForm = async () => {
  const validation = await formRef.value?.validate();

  if (validation?.valid) {
    emit('save');
  }
};
</script>

<template>
  <!-- Keep form open while editing. -->
  <v-dialog
    :model-value="modelValue"
    max-width="720"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <v-form
          ref="formRef"
          class="employee-form"
          validate-on="submit"
          @submit.prevent="submitForm"
        >
          <!-- Rules from App.vue. -->
          <v-text-field
            v-model="form.code"
            label="Code"
            :rules="codeRules"
            variant="outlined"
          />
          <v-text-field
            v-model="form.fullName"
            label="Full Name"
            :rules="[requiredRule]"
            variant="outlined"
          />
          <v-text-field
            v-model="form.occupation"
            label="Occupation"
            :rules="[requiredRule]"
            variant="outlined"
          />
          <v-text-field
            v-model="form.department"
            label="Department"
            :rules="[requiredRule]"
            variant="outlined"
          />
          <v-text-field
            v-model="form.dateOfEmployment"
            label="Date of Employment"
            type="date"
            variant="outlined"
          />
          <v-text-field
            v-model="form.terminationDate"
            label="Termination Date"
            :rules="terminationDateRules"
            type="date"
            variant="outlined"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="emit('cancel')">
          Cancel
        </v-btn>
        <v-btn color="primary" variant="flat" @click="submitForm">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
