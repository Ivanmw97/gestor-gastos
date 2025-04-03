import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Transactions from '../views/Transactions.vue';
import Stats from '../views/Stats.vue';
import Budgets from '../views/Budgets.vue';
import Auth from '../views/Auth.vue';
import { useUserStore } from '../store/user';

// Check if we have a redirect in the URL (from 404.html)
const redirect = window.location.search.replace('?', '');
if (redirect) {
  window.history.replaceState(null, '', '/gestor-gastos/' + redirect);
}

const router = createRouter({
  history: createWebHistory('/gestor-gastos/'),
  routes: [
    {
      path: '/',
      redirect: '/auth'
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: Transactions,
      meta: { requiresAuth: true }
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats,
      meta: { requiresAuth: true }
    },
    {
      path: '/budgets',
      name: 'budgets',
      component: Budgets,
      meta: { requiresAuth: true }
    },
    // Catch-all route
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  
  // Wait for user initialization if it's the first navigation
  if (userStore.isLoading) {
    await userStore.initialize();
  }
  
  const isAuthenticated = userStore.user !== null || userStore.isGuestMode;
  
  // Routes that require authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth');
  } 
  // Routes that require guest (non-authenticated)
  else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard');
  } 
  else {
    next();
  }
});

export default router;