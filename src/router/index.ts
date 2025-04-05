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
  history: createWebHistory(import.meta.env.BASE_URL || '/gestor-gastos/'),
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
router.beforeEach(async (to, _, next) => {
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

// Add this to handle initial navigation
router.beforeEach((to, _, next) => {
  // Handle GitHub Pages 404 redirect
  if (to.fullPath.includes('/?p=')) {
    const path = to.fullPath.split('/?p=')[1];
    next({ path, replace: true });
    return;
  }
  next();
});

export default router;