import '@fontsource-variable/inter'
import './assets/main.css'
import 'primevue/resources/themes/aura-light-noir/theme.css'
import 'primeicons/primeicons.css'
import 'aos/dist/aos.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import BadgeDirective from 'primevue/badgedirective';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import socket from '@/config/socket.config';
import { useUserStore } from '@/stores/user';


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia());
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);
app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.mount('#app');



const userStore = useUserStore();

window.addEventListener('vite:preloadError', () => {
    window.reload()
});

window.addEventListener('beforeunload', () => {
    socket.emit('offline', userStore.user.id);
    socket.disconnect();
});
