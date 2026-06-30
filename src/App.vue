<script setup>
import { computed, ref } from 'vue';
import AppHeader from './components/AppHeader.vue';
import EmployeeSummary from './components/EmployeeSummary.vue';
import employeeSeedData from './data/employees.json';
import {
  formatDate,
  getEmploymentStatus,
  getEmploymentStatusColor,
  getTerminationStatus,
  getTerminationStatusColor,
} from './utils/employeeDates';

const employees = ref([...employeeSeedData]);
const searchQuery = ref('');
const sortConfig = ref({
  key: 'fullName',
  direction: 'asc',
});
const employeePendingDelete = ref(null);
const selectedEmployee = ref(null);
const isDeleteDialogOpen = ref(false);
const isViewDialogOpen = ref(false);
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const createFormRef = ref(null);
const editFormRef = ref(null);
const employeeForm = ref({
  code: '',
  fullName: '',
  occupation: '',
  department: '',
  dateOfEmployment: '',
  terminationDate: '',
});
const editEmployeeForm = ref({
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
const requiredRule = (value) => Boolean(String(value ?? '').trim()) || 'This field is required.';
const employeeCodeRule = (value) => {
  const code = String(value ?? '').trim();

  if (!code) {
    return 'This field is required.';
  }

  return (
    !employees.value.some(
      (employee) => employee.code.toLowerCase() === code.toLowerCase(),
    ) || 'Employee code must be unique.'
  );
};
const editEmployeeCodeRule = (value) => {
  const code = String(value ?? '').trim();

  if (!code) {
    return 'This field is required.';
  }

  return (
    !employees.value.some(
      (employee) =>
        employee.code.toLowerCase() === code.toLowerCase() &&
        employee.code !== selectedEmployee.value?.code,
    ) || 'Employee code must be unique.'
  );
};
const terminationDateRule = (value) => {
  if (!value || !employeeForm.value.dateOfEmployment) {
    return true;
  }

  return (
    new Date(value) >= new Date(employeeForm.value.dateOfEmployment) ||
    'Termination date cannot be before date of employment.'
  );
};
const editTerminationDateRule = (value) => {
  if (!value || !editEmployeeForm.value.dateOfEmployment) {
    return true;
  }

  return (
    new Date(value) >= new Date(editEmployeeForm.value.dateOfEmployment) ||
    'Termination date cannot be before date of employment.'
  );
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
  selectedEmployee.value = employee;
  isViewDialogOpen.value = true;
};

const editEmployee = (employee) => {
  selectedEmployee.value = employee;
  editEmployeeForm.value = { ...employee };
  isEditDialogOpen.value = true;
};

const requestDeleteEmployee = (employee) => {
  employeePendingDelete.value = employee;
  isDeleteDialogOpen.value = true;
};

const closeViewEmployee = () => {
  selectedEmployee.value = null;
  isViewDialogOpen.value = false;
};

const closeEditEmployee = () => {
  selectedEmployee.value = null;
  editEmployeeForm.value = getEmptyEmployeeForm();
  isEditDialogOpen.value = false;
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

const getEmptyEmployeeForm = () => ({
  code: '',
  fullName: '',
  occupation: '',
  department: '',
  dateOfEmployment: '',
  terminationDate: '',
});

const openCreateEmployee = () => {
  isCreateDialogOpen.value = true;
};

const closeCreateEmployee = () => {
  employeeForm.value = getEmptyEmployeeForm();
  isCreateDialogOpen.value = false;
};

const saveEmployee = async () => {
  const validation = await createFormRef.value?.validate();

  if (!validation?.valid) {
    return;
  }

  employees.value = [
    ...employees.value,
    {
      code: employeeForm.value.code.trim(),
      fullName: employeeForm.value.fullName.trim(),
      occupation: employeeForm.value.occupation.trim(),
      department: employeeForm.value.department.trim(),
      dateOfEmployment: employeeForm.value.dateOfEmployment || null,
      terminationDate: employeeForm.value.terminationDate || null,
    },
  ];

  sortConfig.value = {
    key: 'code',
    direction: 'desc',
  };
  searchQuery.value = '';
  closeCreateEmployee();
};

const saveEmployeeEdits = async () => {
  const validation = await editFormRef.value?.validate();

  if (!validation?.valid || !selectedEmployee.value) {
    return;
  }

  const editedEmployee = {
    code: editEmployeeForm.value.code.trim(),
    fullName: editEmployeeForm.value.fullName.trim(),
    occupation: editEmployeeForm.value.occupation.trim(),
    department: editEmployeeForm.value.department.trim(),
    dateOfEmployment: editEmployeeForm.value.dateOfEmployment || null,
    terminationDate: editEmployeeForm.value.terminationDate || null,
  };

  employees.value = employees.value.map((employee) =>
    employee.code === selectedEmployee.value.code ? editedEmployee : employee,
  );
  closeEditEmployee();
};
</script>

<template>
  <v-app>
    <v-main>
      <div class="app-shell">
        <AppHeader />

        <EmployeeSummary :employee-count="employeeCount" />

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

        <v-dialog v-model="isViewDialogOpen" max-width="680">
          <v-card rounded="lg">
            <v-card-title>Employee profile</v-card-title>
            <v-card-text v-if="selectedEmployee">
              <dl class="profile-details">
                <div>
                  <dt>Code</dt>
                  <dd>{{ selectedEmployee.code }}</dd>
                </div>
                <div>
                  <dt>Full Name</dt>
                  <dd>{{ selectedEmployee.fullName }}</dd>
                </div>
                <div>
                  <dt>Occupation</dt>
                  <dd>{{ selectedEmployee.occupation }}</dd>
                </div>
                <div>
                  <dt>Department</dt>
                  <dd>{{ selectedEmployee.department }}</dd>
                </div>
                <div>
                  <dt>Date of Employment</dt>
                  <dd>
                    {{ formatDate(selectedEmployee.dateOfEmployment) }}
                    <v-chip
                      class="status-chip"
                      :color="getEmploymentStatusColor(selectedEmployee.dateOfEmployment)"
                      size="small"
                      variant="tonal"
                    >
                      {{ getEmploymentStatus(selectedEmployee.dateOfEmployment) }}
                    </v-chip>
                  </dd>
                </div>
                <div>
                  <dt>Termination Date</dt>
                  <dd>
                    {{ formatDate(selectedEmployee.terminationDate) }}
                    <v-chip
                      v-if="getTerminationStatus(selectedEmployee.terminationDate)"
                      class="status-chip"
                      :color="getTerminationStatusColor(selectedEmployee.terminationDate)"
                      size="small"
                      variant="tonal"
                    >
                      {{ getTerminationStatus(selectedEmployee.terminationDate) }}
                    </v-chip>
                  </dd>
                </div>
              </dl>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" variant="flat" @click="closeViewEmployee">
                Close
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
              <v-form
                ref="createFormRef"
                class="employee-form"
                validate-on="submit"
                @submit.prevent="saveEmployee"
              >
                <v-text-field
                  v-model="employeeForm.code"
                  label="Code"
                  :rules="[employeeCodeRule]"
                  variant="outlined"
                />
                <v-text-field
                  v-model="employeeForm.fullName"
                  label="Full Name"
                  :rules="[requiredRule]"
                  variant="outlined"
                />
                <v-text-field
                  v-model="employeeForm.occupation"
                  label="Occupation"
                  :rules="[requiredRule]"
                  variant="outlined"
                />
                <v-text-field
                  v-model="employeeForm.department"
                  label="Department"
                  :rules="[requiredRule]"
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
                  :rules="[terminationDateRule]"
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
              <v-btn color="primary" variant="flat" @click="saveEmployee">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="isEditDialogOpen" max-width="720" persistent>
          <v-card rounded="lg">
            <v-card-title>Edit employee</v-card-title>
            <v-card-text>
              <v-form
                ref="editFormRef"
                class="employee-form"
                validate-on="submit"
                @submit.prevent="saveEmployeeEdits"
              >
                <v-text-field
                  v-model="editEmployeeForm.code"
                  label="Code"
                  :rules="[editEmployeeCodeRule]"
                  variant="outlined"
                />
                <v-text-field
                  v-model="editEmployeeForm.fullName"
                  label="Full Name"
                  :rules="[requiredRule]"
                  variant="outlined"
                />
                <v-text-field
                  v-model="editEmployeeForm.occupation"
                  label="Occupation"
                  :rules="[requiredRule]"
                  variant="outlined"
                />
                <v-text-field
                  v-model="editEmployeeForm.department"
                  label="Department"
                  :rules="[requiredRule]"
                  variant="outlined"
                />
                <v-text-field
                  v-model="editEmployeeForm.dateOfEmployment"
                  label="Date of Employment"
                  type="date"
                  variant="outlined"
                />
                <v-text-field
                  v-model="editEmployeeForm.terminationDate"
                  label="Termination Date"
                  :rules="[editTerminationDateRule]"
                  type="date"
                  variant="outlined"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn variant="text" @click="closeEditEmployee">
                Cancel
              </v-btn>
              <v-btn color="primary" variant="flat" @click="saveEmployeeEdits">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-main>
  </v-app>
</template>
