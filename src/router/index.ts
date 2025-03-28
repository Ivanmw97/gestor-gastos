import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Transactions from '../views/Transactions.vue';
import Stats from '../views/Stats.vue';
import Budgets from '../views/Budgets.vue';

const routes: RouteRecordRaw[] = [
    { path: '/', name: 'Dashboard', component: Dashboard },
    { path: '/transactions', name: 'Transactions', component: Transactions },
    { path: '/stats', name: 'Stats', component: Stats },
    { path: '/budgets', name: 'Budgets', component: Budgets }, // Add this line
];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export default router;