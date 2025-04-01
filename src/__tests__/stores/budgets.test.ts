import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBudgetStore } from '../../store/budgets'
import type { Budget } from '../../types/Budget'

describe('Budget Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const createTestBudget = (): Budget => ({
    category: 'Food',
    limit: 1000
  })

  it('initializes with empty budgets', () => {
    const store = useBudgetStore()
    expect(store.budgets).toEqual([])
  })

  it('adds a new budget', () => {
    const store = useBudgetStore()
    const budget = createTestBudget()
    
    store.addBudget(budget)
    expect(store.budgets[0]).toMatchObject(budget)
  })

  it('removes a budget', () => {
    const store = useBudgetStore()
    const budget = createTestBudget()
    
    store.addBudget(budget)
    store.removeBudget(budget.category)
    expect(store.budgets).toHaveLength(0)
  })

  it('updates a budget', () => {
    const store = useBudgetStore()
    const budget = createTestBudget()
    
    store.addBudget(budget)
    store.updateBudget(budget.category, 2000)
    
    expect(store.budgets[0].limit).toBe(2000)
  })

  it('checks monthly reset', () => {
    const store = useBudgetStore()
    const budget = createTestBudget()
    store.addBudget(budget)
    
    store.checkMonthlyReset()
    expect(store.currentMonth).toBe(new Date().toISOString().substring(0, 7))
  })
})