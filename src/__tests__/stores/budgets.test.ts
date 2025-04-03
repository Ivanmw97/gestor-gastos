import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBudgetStore } from '../../store/budgets'
import type { Budget } from '../../types/Budget'

// Mock the supabase client
vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            data: [],
            error: null
          })
        })
      }),
      insert: () => ({
        select: () => ({
          single: () => ({
            data: { id: 'mock-id', category: 'Food', budget_limit: 1000 },
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
}))

// Mock the user store
vi.mock('../../store/user', () => ({
  useUserStore: () => ({
    isGuestMode: true,
    user: { id: 'test-user-id' }
  })
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock crypto.randomUUID
if (!window.crypto) {
  Object.defineProperty(window, 'crypto', {
    value: {
      randomUUID: () => 'test-uuid'
    }
  })
} else if (!window.crypto.randomUUID) {
  Object.defineProperty(window.crypto, 'randomUUID', {
    value: () => 'test-uuid'
  })
}

describe('Budget Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  const createTestBudget = (): Budget => ({
    category: 'Food',
    budget_limit: 1000
  })

  it('initializes with empty budgets', () => {
    const store = useBudgetStore()
    expect(store.budgets).toEqual([])
  })

  it('adds a new budget', async () => {
    const store = useBudgetStore()
    const budget = createTestBudget()
    
    // Add the budget and wait for the async operation
    await store.addBudget(budget)
    
    // Check if budgets array has at least one item
    expect(store.budgets.length).toBeGreaterThan(0)
    
    // Find the added budget by category
    const addedBudget = store.budgets.find(b => b.category === budget.category)
    expect(addedBudget).toBeDefined()
    expect(addedBudget?.category).toBe(budget.category)
    expect(addedBudget?.budget_limit).toBe(budget.budget_limit)
  })

  it('removes a budget', async () => {
    const store = useBudgetStore()
    const budget = createTestBudget()
    
    // Add the budget and wait for the async operation
    await store.addBudget(budget)
    
    // Verify the budget was added
    expect(store.budgets.length).toBeGreaterThan(0)
    const addedBudget = store.budgets[0]
    
    // Now remove it using the ID
    await store.removeBudget(addedBudget.id as string)
    expect(store.budgets).toHaveLength(0)
  })

  it('updates a budget', async () => {
    const store = useBudgetStore()
    const budget = createTestBudget()
    
    // Add the budget and wait for the async operation
    await store.addBudget(budget)
    
    // Verify the budget was added
    const addedBudget = store.budgets.find(b => b.category === budget.category)
    expect(addedBudget).toBeDefined()
    expect(addedBudget?.budget_limit).toBe(1000)
    
    // Now update the budget
    await store.updateBudget(budget.category, 2000)
    
    // Find the updated budget by category
    const updatedBudget = store.budgets.find(b => b.category === budget.category)
    expect(updatedBudget).toBeDefined()
    expect(updatedBudget?.budget_limit).toBe(2000)
  })

  it('checks monthly reset', async () => {
    const store = useBudgetStore()
    const budget = createTestBudget()
    
    // Add the budget and wait for the async operation
    await store.addBudget(budget)
    
    // Verify the budget was added
    const addedBudget = store.budgets.find(b => b.category === budget.category)
    expect(addedBudget).toBeDefined()
    
    await store.checkMonthlyReset()
    expect(store.currentMonth).toBe(new Date().toISOString().substring(0, 7))
  })
})