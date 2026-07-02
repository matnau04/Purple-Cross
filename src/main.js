import { createApp } from 'vue';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import App from './App.vue';
import './styles.css';

// Adds Vuetify to the app.
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    // Main app colours.
    defaultTheme: 'purpleCrossTheme',
    themes: {
      purpleCrossTheme: {
        dark: false,
        colors: {
          primary: '#3b2870',
          secondary: '#166447',
          error: '#b42318',
          surface: '#ffffff',
          background: '#f5f7fb',
        },
      },
    },
  },
});

createApp(App).use(vuetify).mount('#app');
