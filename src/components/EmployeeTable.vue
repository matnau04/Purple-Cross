<script setup>
import {
  formatDate,
  getEmploymentStatus,
  getEmploymentStatusColor,
  getTerminationStatus,
  getTerminationStatusColor,
} from '../utils/employeeDates';

defineProps({
  employeeCount: {
    type: Number,
    required: true,
  },
  employees: {
    type: Array,
    required: true,
  },
  searchQuery: {
    type: String,
    required: true,
  },
  sortableColumns: {
    type: Array,
    required: true,
  },
});


const emit = defineEmits([
  'delete-employee',
  'edit-employee',
  'update:search-query',
  'set-sort',
  'view-employee',
]);


const getSortLabel = (column) => column.sortLabel;
const getSortIcon = (column) => column.sortIcon;
</script>

<template>
  <!-- Main grid section: search, sortable headers, employee rows, and row actions. -->
  <section class="table-section" aria-labelledby="employee-table-title">
    <div class="section-heading">
      <div>
        <h2 id="employee-table-title">Employees</h2>
        <p>
          Showing {{ employees.length }} of {{ employeeCount }} employee records.
        </p>
      </div>
      <!-- Emit an empty string instead of null when Vuetify's clear button is used. -->
      <v-text-field
        class="search-control"
        clearable
        density="comfortable"
        hide-details
        label="Search employees"
        :model-value="searchQuery"
        placeholder="Name, department, status..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        @update:model-value="emit('update:search-query', $event || '')"
      />
    </div>

    <v-table class="employee-table" density="comfortable">
      <thead>
        <tr>
          <th
            v-for="column in sortableColumns"
            :key="column.key"
            scope="col"
          >
            <v-btn
              :append-icon="getSortIcon(column)"
              :aria-label="`${getSortLabel(column)} by ${column.label}`"
              class="sort-button"
              size="small"
              variant="text"
              @click="emit('set-sort', column.key)"
            >
              {{ column.label }}
            </v-btn>
          </th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in employees" :key="employee.code">
          <td>{{ employee.code }}</td>
          <td>{{ employee.fullName }}</td>
          <td>{{ employee.occupation }}</td>
          <td>{{ employee.department }}</td>
          <td>
            <span>{{ formatDate(employee.dateOfEmployment) }}</span>
            <!-- Employment status is derived from the date, not stored separately in JSON. -->
            <v-chip
              class="status-chip"
              :color="getEmploymentStatusColor(employee.dateOfEmployment)"
              size="small"
              variant="tonal"
            >
              {{ getEmploymentStatus(employee.dateOfEmployment) }}
            </v-chip>
          </td>
          <td>
            <span>{{ formatDate(employee.terminationDate) }}</span>
            <!-- No termination chip is shown when terminationDate is empty/null. -->
            <v-chip
              v-if="getTerminationStatus(employee.terminationDate)"
              class="status-chip"
              :color="getTerminationStatusColor(employee.terminationDate)"
              size="small"
              variant="tonal"
            >
              {{ getTerminationStatus(employee.terminationDate) }}
            </v-chip>
          </td>
          <td>
            <div class="row-actions" :aria-label="`Actions for ${employee.fullName}`">
              <v-btn
                prepend-icon="mdi-eye"
                size="small"
                variant="outlined"
                @click="emit('view-employee', employee)"
              >
                View
              </v-btn>
              <v-btn
                prepend-icon="mdi-pencil"
                size="small"
                variant="outlined"
                @click="emit('edit-employee', employee)"
              >
                Edit
              </v-btn>
              <v-btn
                color="error"
                prepend-icon="mdi-delete"
                size="small"
                variant="outlined"
                @click="emit('delete-employee', employee)"
              >
                Delete
              </v-btn>
            </div>
          </td>
        </tr>
        <tr v-if="employees.length === 0">
          <td class="empty-state" colspan="7">
            No employees match the current search.
          </td>
        </tr>
      </tbody>
    </v-table>
  </section>
</template>
