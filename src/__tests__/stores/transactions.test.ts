import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTransactionStore } from '../../store/transactions';
import type { TransactionType } from '../../types/Transaction';

// Mock the supabase client
vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            data: [],
            error: null
          })
        })
      }),
      insert: () => ({
        select: () => ({
          single: () => ({
            data: { id: 'mock-id' },
            error: null
          })
        })
      }),
      update: () => ({
        eq: () => ({
          eq: () => ({
            data: null,
            error: null
          })
        })
      }),
      delete: () => ({
        eq: () => ({
          eq: () => ({
            error: null
          })
        })
      })
    })
  }
}));

// Mock the user store
vi.mock('../../store/user', () => ({
  useUserStore: () => ({
    isGuestMode: true,
    user: { id: 'test-user-id' }
  })
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock crypto.randomUUID
if (!window.crypto) {
  Object.defineProperty(window, 'crypto', {
    value: {
      randomUUID: () => 'test-uuid'
    }
  });
} else if (!window.crypto.randomUUID) {
  Object.defineProperty(window.crypto, 'randomUUID', {
    value: () => 'test-uuid'
  });
}

describe('Transaction Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('should add a transaction', async () => {
    const store = useTransactionStore();
    const transaction = {
      type: 'expense' as TransactionType,
      description: 'Test expense',
      category: 'Food',
      amount: 50,
      date: '2024-04-01'
    };
    
    // Add the transaction and wait for it to complete
    await store.addTransaction(transaction);
    
    // Check if the transaction was added correctly
    expect(store.transactions).toHaveLength(1);
    expect(store.transactions[0]).toMatchObject({
      description: 'Test expense',
      category: 'Food',
      amount: 50,
      type: 'expense'
    });
  });
  
  it('should filter transactions by month', async () => {
    const store = useTransactionStore();
    // Use a fixed date for testing
    const testMonth = '2024-04';
    
    // Add a transaction for the test month
    const transaction1 = {
      type: 'expense' as TransactionType,
      description: 'Test expense',
      category: 'Food',
      amount: 50,
      date: '2024-04-01'
    };
    
    await store.addTransaction(transaction1);
    
    // Verify the transaction was added
    expect(store.transactions).toHaveLength(1);
    
    // Get transactions for the test month
    const monthlyTransactions = store.getTransactionsByMonth(testMonth);
    
    // Verify we got the transaction back
    expect(monthlyTransactions).toHaveLength(1);
    expect(monthlyTransactions[0].description).toBe('Test expense');
  });
  
  it('should add multiple transactions', async () => {
    const store = useTransactionStore();
    
    // Add first transaction
    await store.addTransaction({
      type: 'expense' as TransactionType,
      description: 'Test expense',
      category: 'Food',
      amount: 50,
      date: '2024-04-01'
    });
    
    // Verify first transaction was added
    expect(store.transactions).toHaveLength(1);
    
    // Add second transaction
    await store.addTransaction({
      type: 'income' as TransactionType,
      description: 'Test income',
      category: 'Salary',
      amount: 1000,
      date: '2024-04-01'
    });
    
    // Verify both transactions are in the store
    expect(store.transactions).toHaveLength(2);
    
    // Verify we can find both transaction types
    const hasExpense = store.transactions.some(t => t.type === 'expense');
    const hasIncome = store.transactions.some(t => t.type === 'income');
    
    expect(hasExpense).toBe(true);
    expect(hasIncome).toBe(true);
  });
});