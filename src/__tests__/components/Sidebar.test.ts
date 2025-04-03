import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Sidebar from '../../components/Sidebar.vue'
import SidebarItem from '../../components/SidebarItem.vue'
import { createRouter, createWebHistory } from 'vue-router'
import * as LucideIcons from 'lucide-vue-next'
import { createPinia, setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'

// Mock the supabase client
vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null })
    }
  }
}))

describe('Sidebar', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia())
  })

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: {} },
      { path: '/transactions', component: {} },
      { path: '/budgets', component: {} },
      { path: '/stats', component: {} }
    ]
  })

  it('renders properly', () => {
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [
          router,
          createTestingPinia() // Use testing pinia
        ],
        components: {
          ...LucideIcons
        }
      }
    })
    const logoText = wrapper.find('span.text-blue-500')
    const managerText = wrapper.find('span.text-white')
    
    expect(logoText.text()).toBe('Financial')
    expect(managerText.text()).toBe('Manager')
  })

  it('displays correct version', () => {
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [
          router,
          createTestingPinia() // Use testing pinia
        ],
        components: {
          ...LucideIcons
        }
      }
    })
    const versionText = wrapper.find('.version')
    expect(versionText.text()).toBe('v1.1.0')
  })

  it('contains all navigation items', () => {
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [
          router,
          createTestingPinia() // Use testing pinia
        ],
        components: {
          ...LucideIcons
        }
      }
    })
    const navItems = wrapper.findAllComponents(SidebarItem)
    expect(navItems).toHaveLength(4)
  })
})