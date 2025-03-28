export interface Budget {
  category: string;
  limit: number;
}

export interface BudgetWithSpent extends Budget {
  spent: number;
}