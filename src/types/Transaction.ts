export interface Transaction {
    id: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    description?: string;
  }
  