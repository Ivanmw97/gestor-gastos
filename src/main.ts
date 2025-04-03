import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import './styles/main.css';
import { useUserStore } from './store/user';
import { useTransactionStore } from './store/transactions';
import { useBudgetStore } from './store/budgets';

const pinia = createPinia();
pinia.use(createPersistedState());

const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount('#app');

// Initialize stores
const userStore = useUserStore();
const transactionStore = useTransactionStore();
const budgetStore = useBudgetStore();

// Initialize user first, then load data
userStore.initialize().then(() => {
  if (userStore.user || userStore.isGuestMode) {
    transactionStore.loadTransactions();
    budgetStore.loadBudgets();
  }
});
