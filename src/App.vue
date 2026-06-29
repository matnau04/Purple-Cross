<script setup>
import { computed, ref } from 'vue';
import employees from './data/employees.json';

const employeeCount = employees.length;
const searchQuery = ref('');
const sortConfig = ref({
  key: 'fullName',
  direction: 'asc',
});

const sortableColumns = [
  { key: 'code', label: 'Code' },
  { key: 'fullName', label: 'Full Name' },
  { key: 'occupation', label: 'Occupation' },
  { key: 'department', label: 'Department' },
  { key: 'dateOfEmployment', label: 'Date of Employment' },
  { key: 'terminationDate', label: 'Termination Date' },
];

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

const formatDate = (dateValue) => {
  if (!dateValue) {
    return 'Not scheduled';
  }

  return dateFormatter.format(new Date(dateValue));
};

const filteredEmployees = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) {
    return employees;
  }

  return employees.filter((employee) =>
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
</script>

<template>
  <main class="app-shell">
    <header class="top-bar">
      <div>
        <p class="eyebrow">Purple Cross Ltd</p>
        <h1>Employee Management</h1>
      </div>
      <div class="user-badge" aria-label="Logged in user">
        HR
      </div>
    </header>

    <section class="summary-band" aria-label="Employee summary">
      <div>
        <span class="summary-number">{{ employeeCount }}</span>
        <span class="summary-label">sample employee records loaded</span>
      </div>
    </section>

    <section class="table-section" aria-labelledby="employee-table-title">
      <div class="section-heading">
        <div>
          <h2 id="employee-table-title">Employees</h2>
          <p>
            Showing {{ sortedEmployees.length }} of {{ employeeCount }} employee records.
          </p>
        </div>
        <label class="search-field">
          <span>Search employees</span>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Name, department, status..."
          />
        </label>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th
                v-for="column in sortableColumns"
                :key="column.key"
                scope="col"
              >
                <button
                  class="sort-button"
                  type="button"
                  @click="setSort(column.key)"
                >
                  {{ column.label }}
                  <span class="sort-indicator">{{ getSortLabel(column.key) }}</span>
                </button>
              </th>
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
                <span class="status-pill status-pill--employment">
                  {{ getEmploymentStatus(employee.dateOfEmployment) }}
                </span>
              </td>
              <td>
                <span>{{ formatDate(employee.terminationDate) }}</span>
                <span
                  v-if="getTerminationStatus(employee.terminationDate)"
                  class="status-pill status-pill--termination"
                >
                  {{ getTerminationStatus(employee.terminationDate) }}
                </span>
              </td>
            </tr>
            <tr v-if="sortedEmployees.length === 0">
              <td class="empty-state" colspan="6">
                No employees match the current search.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>
