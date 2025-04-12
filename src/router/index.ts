import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Transactions from '../views/Transactions.vue';
import Stats from '../views/Stats.vue';
import Budgets from '../views/Budgets.vue';
import Auth from '../views/Auth.vue';
import { useUserStore } from '../store/user';
import AuthCallback from '../views/AuthCallback.vue';

// GitHub Pages redirect support using spa-github-pages (preserve query + hash)
const rawRedirect = window.location.search;
if (rawRedirect.startsWith('?/')) {
  const redirectPath = rawRedirect.slice(2); // remove "?/"
  const newUrl = `${import.meta.env.BASE_URL}${redirectPath}`;
  window.history.replaceState(null, '', newUrl);
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
      path: '/reset-password',
      name: 'ResetPassword',
      component: Auth,
      meta: {
        requiresAuth: false,
        title: 'Reset Password'
      },
      children: [
        {
          path: '',
          component: () => import('../views/ResetPassword.vue')
        }
      ]
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
    },
    // Auth callback route
    {
      path: '/auth/callback',
      name: 'AuthCallback',
      component: AuthCallback,
      meta: {
        requiresAuth: false
      }
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
  
  // Special case for password reset - allow access even when authenticated
  if (to.path.includes('/reset-password') && to.hash.includes('type=recovery')) {
    return next();
  }
  
  // Routes that require authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth');
  } 
  // Routes that require guest (non-authenticated)
  else if (to.meta.requiresGuest && isAuthenticated && !to.path.includes('/reset-password')) {
    next('/dashboard');
  } 
  else {
    next();
  }
});

export default router;