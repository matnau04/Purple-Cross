<script setup>
import { computed, ref } from 'vue';
import employeeSeedData from './data/employees.json';

const employees = ref([...employeeSeedData]);
const searchQuery = ref('');
const sortConfig = ref({
  key: 'fullName',
  direction: 'asc',
});
const employeePendingDelete = ref(null);
const isDeleteDialogOpen = ref(false);
const isCreateDialogOpen = ref(false);
const employeeForm = ref({
  code: '',
  fullName: '',
  occupation: '',
  department: '',
  dateOfEmployment: '',
  terminationDate: '',
});

const sortableColumns = [
  { key: 'code', label: 'Code' },
  { key: 'fullName', label: 'Full Name' },
  { key: 'occupation', label: 'Occupation' },
  { key: 'department', label: 'Department' },
  { key: 'dateOfEmployment', label: 'Date of Employment' },
  { key: 'terminationDate', label: 'Termination Date' },
];
const employeeCount = computed(() => employees.value.length);

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const getDateStatus = (dateValue, futureLabel, pastLabel) => {
  if (!dateValue) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dateValue);
  targetDate.setHours(0, 0, 0, 0);

  return targetDate > today ? futureLabel : pastLabel;
};

const getEmploymentStatus = (dateValue) =>
  getDateStatus(dateValue, 'Employed soon', 'Currently employed');

const getTerminationStatus = (dateValue) =>
  getDateStatus(dateValue, 'To be terminated', 'Terminated');

const getEmploymentStatusColor = (dateValue) =>
  getEmploymentStatus(dateValue) === 'Employed soon' ? 'info' : 'success';

const getTerminationStatusColor = (dateValue) =>
  getTerminationStatus(dateValue) === 'To be terminated' ? 'warning' : 'error';

const formatDate = (dateValue) => {
  if (!dateValue) {
    return 'Not scheduled';
  }

  return dateFormatter.format(new Date(dateValue));
};

const filteredEmployees = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) {
    return employees.value;
  }

  return employees.value.filter((employee) =>
    [
      employee.code,
      employee.fullName,
      employee.occupation,
      employee.department,
      employee.dateOfEmployment,
      employee.terminationDate,
      getEmploymentStatus(employee.dateOfEmployment),
      getTerminationStatus(employee.terminationDate),
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query)),
  );
});

const sortedEmployees = computed(() => {
  const { key, direction } = sortConfig.value;
  const directionMultiplier = direction === 'asc' ? 1 : -1;

  return [...filteredEmployees.value].sort((firstEmployee, secondEmployee) => {
    const firstValue = firstEmployee[key] ?? '';
    const secondValue = secondEmployee[key] ?? '';

    return (
      String(firstValue).localeCompare(String(secondValue), undefined, {
        numeric: true,
        sensitivity: 'base',
      }) * directionMultiplier
    );
  });
});

const setSort = (key) => {
  if (sortConfig.value.key === key) {
    sortConfig.value = {
      key,
      direction: sortConfig.value.direction === 'asc' ? 'desc' : 'asc',
    };
    return;
  }

  sortConfig.value = {
    key,
    direction: 'asc',
  };
};

const getSortLabel = (key) => {
  if (sortConfig.value.key !== key) {
    return 'Sort';
  }

  return sortConfig.value.direction === 'asc' ? 'Ascending' : 'Descending';
};

const getSortIcon = (key) => {
  if (sortConfig.value.key !== key) {
    return 'mdi-swap-vertical';
  }

  return sortConfig.value.direction === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down';
};

const viewEmployee = (employee) => {
  window.alert(`Viewing ${employee.fullName}'s profile will be added in the profile feature.`);
};

const editEmployee = (employee) => {
  window.alert(`Editing ${employee.fullName}'s profile will be added in the profile feature.`);
};

const requestDeleteEmployee = (employee) => {
  employeePendingDelete.value = employee;
  isDeleteDialogOpen.value = true;
};

const cancelDeleteEmployee = () => {
  employeePendingDelete.value = null;
  isDeleteDialogOpen.value = false;
};

const confirmDeleteEmployee = () => {
  if (!employeePendingDelete.value) {
    return;
  }

  const employeeCode = employeePendingDelete.value.code;
  employees.value = employees.value.filter(
    (currentEmployee) => currentEmployee.code !== employeeCode,
  );
  cancelDeleteEmployee();
};

const openCreateEmployee = () => {
  isCreateDialogOpen.value = true;
};

const closeCreateEmployee = () => {
  isCreateDialogOpen.value = false;
};
</script>

<template>
  <v-app>
    <v-main>
      <div class="app-shell">
        <v-sheet class="top-bar" color="surface" elevation="0" rounded="lg">
          <div>
            <p class="eyebrow">Purple Cross Ltd</p>
            <h1>Employee Management</h1>
          </div>
          <v-spacer />
          <v-avatar color="primary" size="48">
            <span class="user-initials">HR</span>
          </v-avatar>
        </v-sheet>

        <v-sheet class="summary-band" elevation="0" rounded="lg">
          <span class="summary-number">{{ employeeCount }}</span>
          <span class="summary-label">sample employee records loaded</span>
        </v-sheet>

        <section class="table-section" aria-labelledby="employee-table-title">
          <div class="section-heading">
            <div>
              <h2 id="employee-table-title">Employees</h2>
              <p>
                Showing {{ sortedEmployees.length }} of {{ employeeCount }} employee records.
              </p>
            </div>
            <v-text-field
              v-model="searchQuery"
              class="search-control"
              clearable
              density="comfortable"
              hide-details
              label="Search employees"
              placeholder="Name, department, status..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
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
                    :append-icon="getSortIcon(column.key)"
                    :aria-label="`${getSortLabel(column.key)} by ${column.label}`"
                    class="sort-button"
                    size="small"
                    variant="text"
                    @click="setSort(column.key)"
                  >
                    {{ column.label }}
                  </v-btn>
                </th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in sortedEmployees" :key="employee.code">
                <td>{{ employee.code }}</td>
                <td>{{ employee.fullName }}</td>
                <td>{{ employee.occupation }}</td>
                <td>{{ employee.department }}</td>
                <td>
                  <span>{{ formatDate(employee.dateOfEmployment) }}</span>
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
                      @click="viewEmployee(employee)"
                    >
                      View
                    </v-btn>
                    <v-btn
                      prepend-icon="mdi-pencil"
                      size="small"
                      variant="outlined"
                      @click="editEmployee(employee)"
                    >
                      Edit
                    </v-btn>
                    <v-btn
                      color="error"
                      prepend-icon="mdi-delete"
                      size="small"
                      variant="outlined"
                      @click="requestDeleteEmployee(employee)"
                    >
                      Delete
                    </v-btn>
                  </div>
                </td>
              </tr>
              <tr v-if="sortedEmployees.length === 0">
                <td class="empty-state" colspan="7">
                  No employees match the current search.
                </td>
              </tr>
            </tbody>
          </v-table>
        </section>

        <v-dialog v-model="isDeleteDialogOpen" max-width="440">
          <v-card rounded="lg">
            <v-card-title>Delete employee</v-card-title>
            <v-card-text>
              Delete {{ employeePendingDelete?.fullName }} from the employee list?
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn variant="text" @click="cancelDeleteEmployee">
                Cancel
              </v-btn>
              <v-btn color="error" variant="flat" @click="confirmDeleteEmployee">
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-btn
          class="create-employee-button"
          color="primary"
          prepend-icon="mdi-account-plus"
          size="large"
          @click="openCreateEmployee"
        >
          Create Employee
        </v-btn>

        <v-dialog v-model="isCreateDialogOpen" max-width="720" persistent>
          <v-card rounded="lg">
            <v-card-title>Create employee</v-card-title>
            <v-card-text>
              <v-form class="employee-form">
                <v-text-field
                  v-model="employeeForm.code"
                  label="Code"
                  variant="outlined"
                />
                <v-text-field
                  v-model="employeeForm.fullName"
                  label="Full Name"
                  variant="outlined"
                />
                <v-text-field
                  v-model="employeeForm.occupation"
                  label="Occupation"
                  variant="outlined"
                />
                <v-text-field
                  v-model="employeeForm.department"
                  label="Department"
                  variant="outlined"
                />
                <v-text-field
                  v-model="employeeForm.dateOfEmployment"
                  label="Date of Employment"
                  type="date"
                  variant="outlined"
                />
                <v-text-field
                  v-model="employeeForm.terminationDate"
                  label="Termination Date"
                  type="date"
                  variant="outlined"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn variant="text" @click="closeCreateEmployee">
                Cancel
              </v-btn>
              <v-btn color="primary" disabled variant="flat">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-main>
  </v-app>
</template>
