<script setup>
import {
  formatDate,
  getEmploymentStatus,
  getEmploymentStatusColor,
  getTerminationStatus,
  getTerminationStatusColor,
} from '../utils/employeeDates';

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

const emit = defineEmits(['close', 'update:modelValue']);
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="680"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title>Employee profile</v-card-title>
      <v-card-text v-if="employee">
        <dl class="profile-details">
          <div>
            <dt>Code</dt>
            <dd>{{ employee.code }}</dd>
          </div>
          <div>
            <dt>Full Name</dt>
            <dd>{{ employee.fullName }}</dd>
          </div>
          <div>
            <dt>Occupation</dt>
            <dd>{{ employee.occupation }}</dd>
          </div>
          <div>
            <dt>Department</dt>
            <dd>{{ employee.department }}</dd>
          </div>
          <div>
            <dt>Date of Employment</dt>
            <dd>
              {{ formatDate(employee.dateOfEmployment) }}
              <v-chip
                class="status-chip"
                :color="getEmploymentStatusColor(employee.dateOfEmployment)"
                size="small"
                variant="tonal"
              >
                {{ getEmploymentStatus(employee.dateOfEmployment) }}
              </v-chip>
            </dd>
          </div>
          <div>
            <dt>Termination Date</dt>
            <dd>
              {{ formatDate(employee.terminationDate) }}
              <v-chip
                v-if="getTerminationStatus(employee.terminationDate)"
                class="status-chip"
                :color="getTerminationStatusColor(employee.terminationDate)"
                size="small"
                variant="tonal"
              >
                {{ getTerminationStatus(employee.terminationDate) }}
              </v-chip>
            </dd>
          </div>
        </dl>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="flat" @click="emit('close')">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
