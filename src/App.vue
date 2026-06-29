<script setup>
import employees from './data/employees.json';

const employeeCount = employees.length;

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
          <p>Initial data view from the provided Purple Cross employee sample.</p>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Full Name</th>
              <th scope="col">Occupation</th>
              <th scope="col">Department</th>
              <th scope="col">Date of Employment</th>
              <th scope="col">Termination Date</th>
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
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>
