import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useModalStore } from '../../store/modal'

describe('Modal Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with modal closed', () => {
    const store = useModalStore()
    expect(store.isOpen).toBe(false)
  })

  it('opens modal', () => {
    const store = useModalStore()
    store.openModal()
    expect(store.isOpen).toBe(true)
  })

  it('closes modal', () => {
    const store = useModalStore()
    store.openModal()
    store.closeModal()
    expect(store.isOpen).toBe(false)
  })

  it('toggles modal state correctly', () => {
    const store = useModalStore()
    expect(store.isOpen).toBe(false)
    store.openModal()
    expect(store.isOpen).toBe(true)
    store.closeModal()
    expect(store.isOpen).toBe(false)
  })
})