export interface Budget {
  id?: string;
  user_id?: string;
  category: string;
  budget_limit: number;
  month?: string;
  created_at?: string;
}

export interface BudgetWithSpent extends Budget {
  spent: number;
}