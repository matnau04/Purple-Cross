<script setup>
import { computed, ref } from 'vue';
import EmployeeDeleteDialog from './components/EmployeeDeleteDialog.vue';
import EmployeeFormDialog from './components/EmployeeFormDialog.vue';
import EmployeeProfileDialog from './components/EmployeeProfileDialog.vue';
import AppHeader from './components/AppHeader.vue';
import EmployeeSummary from './components/EmployeeSummary.vue';
import EmployeeTable from './components/EmployeeTable.vue';
import employeeSeedData from './data/employees.json';
import {
  getEmploymentStatus,
  getTerminationStatus,
} from './utils/employeeDates';

// Employee list.
const employees = ref([...employeeSeedData]);

// Search and sort values.
const searchQuery = ref('');
const sortConfig = ref({
  key: 'fullName',
  direction: 'asc',
});

// Selected employee and open dialogs.
const employeePendingDelete = ref(null);
const selectedEmployee = ref(null);
const isDeleteDialogOpen = ref(false);
const isViewDialogOpen = ref(false);
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);

// New employee form.
const employeeForm = ref({
  code: '',
  fullName: '',
  occupation: '',
  department: '',
  dateOfEmployment: '',
  terminationDate: '',
});
// Edit employee form.
const editEmployeeForm = ref({
  code: '',
  fullName: '',
  occupation: '',
  department: '',
  dateOfEmployment: '',
  terminationDate: '',
});

// Table columns.
const sortableColumns = [
  { key: 'code', label: 'Code' },
  { key: 'fullName', label: 'Full Name' },
  { key: 'occupation', label: 'Occupation' },
  { key: 'department', label: 'Department' },
  { key: 'dateOfEmployment', label: 'Date of Employment' },
  { key: 'terminationDate', label: 'Termination Date' },
];

// Employee count.
const employeeCount = computed(() => employees.value.length);

// Checks new employee code.
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

// Checks edited employee code.
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

// Checks date order.
const terminationDateRule = (value) => {
  if (!value || !employeeForm.value.dateOfEmployment) {
    return true;
  }

  return (
    new Date(value) >= new Date(employeeForm.value.dateOfEmployment) ||
    'Termination date cannot be before date of employment.'
  );
};

// Checks date order while editing.
const editTerminationDateRule = (value) => {
  if (!value || !editEmployeeForm.value.dateOfEmployment) {
    return true;
  }

  return (
    new Date(value) >= new Date(editEmployeeForm.value.dateOfEmployment) ||
    'Termination date cannot be before date of employment.'
  );
};

// Search filter.
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

// Sorted list.
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

// Changes sorting.
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

// Sort text.
const getSortLabel = (key) => {
  if (sortConfig.value.key !== key) {
    return 'Sort';
  }

  return sortConfig.value.direction === 'asc' ? 'Ascending' : 'Descending';
};

// Sort icon.
const getSortIcon = (key) => {
  if (sortConfig.value.key !== key) {
    return 'mdi-swap-vertical';
  }

  return sortConfig.value.direction === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down';
};

// Columns with sort info.
const sortableTableColumns = computed(() =>
  sortableColumns.map((column) => ({
    ...column,
    sortIcon: getSortIcon(column.key),
    sortLabel: getSortLabel(column.key),
  })),
);

// Open view dialog.
const viewEmployee = (employee) => {
  selectedEmployee.value = employee;
  isViewDialogOpen.value = true;
};

// Open edit dialog.
const editEmployee = (employee) => {
  selectedEmployee.value = employee;
  editEmployeeForm.value = { ...employee };
  isEditDialogOpen.value = true;
};

// Open delete dialog.
const requestDeleteEmployee = (employee) => {
  employeePendingDelete.value = employee;
  isDeleteDialogOpen.value = true;
};

// Close view dialog.
const closeViewEmployee = () => {
  selectedEmployee.value = null;
  isViewDialogOpen.value = false;
};

// Close edit dialog.
const closeEditEmployee = () => {
  selectedEmployee.value = null;
  editEmployeeForm.value = getEmptyEmployeeForm();
  isEditDialogOpen.value = false;
};

// Cancel delete.
const cancelDeleteEmployee = () => {
  employeePendingDelete.value = null;
  isDeleteDialogOpen.value = false;
};

// Delete employee.
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

// Blank form.
const getEmptyEmployeeForm = () => ({
  code: '',
  fullName: '',
  occupation: '',
  department: '',
  dateOfEmployment: '',
  terminationDate: '',
});

// Open create form.
const openCreateEmployee = () => {
  isCreateDialogOpen.value = true;
};

// Close create form.
const closeCreateEmployee = () => {
  employeeForm.value = getEmptyEmployeeForm();
  isCreateDialogOpen.value = false;
};

// Save new employee.
const saveEmployee = () => {
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

  // Show new employee near the top.
  sortConfig.value = {
    key: 'code',
    direction: 'desc',
  };
  searchQuery.value = '';
  closeCreateEmployee();
};

// Save employee changes.
const saveEmployeeEdits = () => {
  if (!selectedEmployee.value) {
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

        <EmployeeTable
          v-model:search-query="searchQuery"
          :employee-count="employeeCount"
          :employees="sortedEmployees"
          :sortable-columns="sortableTableColumns"
          @delete-employee="requestDeleteEmployee"
          @edit-employee="editEmployee"
          @set-sort="setSort"
          @view-employee="viewEmployee"
        />

        <EmployeeDeleteDialog
          v-model="isDeleteDialogOpen"
          :employee="employeePendingDelete"
          @cancel="cancelDeleteEmployee"
          @confirm="confirmDeleteEmployee"
        />

        <EmployeeProfileDialog
          v-model="isViewDialogOpen"
          :employee="selectedEmployee"
          @close="closeViewEmployee"
        />

        <v-btn
          class="create-employee-button"
          color="primary"
          prepend-icon="mdi-account-plus"
          size="large"
          @click="openCreateEmployee"
        >
          Create Employee
        </v-btn>

        <EmployeeFormDialog
          v-model="isCreateDialogOpen"
          :code-rules="[employeeCodeRule]"
          :form="employeeForm"
          :termination-date-rules="[terminationDateRule]"
          title="Create employee"
          @cancel="closeCreateEmployee"
          @save="saveEmployee"
        />

        <EmployeeFormDialog
          v-model="isEditDialogOpen"
          :code-rules="[editEmployeeCodeRule]"
          :form="editEmployeeForm"
          :termination-date-rules="[editTerminationDateRule]"
          title="Edit employee"
          @cancel="closeEditEmployee"
          @save="saveEmployeeEdits"
        />
      </div>
    </v-main>
  </v-app>
</template>
