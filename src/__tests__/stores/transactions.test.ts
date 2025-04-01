import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTransactionStore } from '../../store/transactions';

describe('Transaction Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should add a transaction', () => {
    const store = useTransactionStore();
    const transaction = {
      id: '1',
      type: 'expense',
      description: 'Test expense',
      category: 'Food',
      amount: 50,
      date: '2024-04-01'
    };

    store.addTransaction({ ...transaction, type: 'expense' as const });
    expect(store.transactions).toContainEqual(transaction);
  });
});