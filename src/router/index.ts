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
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: Transactions
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats
    },
    {
      path: '/budgets',
      name: 'budgets',
      component: Budgets
    },
    // Add a catch-all route to handle direct URL access
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
});

export default router;