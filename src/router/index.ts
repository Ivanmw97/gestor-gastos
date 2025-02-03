import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Transactions from '../views/Transactions.vue';
import Stats from '../views/Stats.vue';

const routes: RouteRecordRaw[] = [
    { path: '/', name: 'Dashboard', component: Dashboard },
    { path: '/transactions', name: 'Transactions', component: Transactions },
    { path: '/stats', name: 'Stats', component: Stats },
  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export default router;