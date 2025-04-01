import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Transactions from '../views/Transactions.vue';
import Stats from '../views/Stats.vue';
import Budgets from '../views/Budgets.vue';

  
const router = createRouter({
  history: createWebHistory('/gestor-gastos/'),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      component: Dashboard
    },
    {
      path: '/transactions',
      component: Transactions
    },
    {
      path: '/stats',
      component: Stats
    },
    {
      path: '/budgets',
      component: Budgets
    }
  ]
});

export default router;