import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SidebarItem from '../../components/SidebarItem.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { LayoutDashboard } from 'lucide-vue-next'

describe('SidebarItem', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/test', component: {} }]
  })

  it('renders with correct props', () => {
    const wrapper = mount(SidebarItem, {
      props: {
        to: '/test',
        icon: 'LayoutDashboard',
        label: 'Test Item'
      },
      global: {
        plugins: [router],
        components: {
          LayoutDashboard
        }
      }
    })

    expect(wrapper.text()).toContain('Test Item')
    expect(wrapper.findComponent(LayoutDashboard).exists()).toBe(true)
  })

  it('applies active class when route matches', async () => {
    const wrapper = mount(SidebarItem, {
      props: {
        to: '/test',
        icon: 'LayoutDashboard',
        label: 'Test Item'
      },
      global: {
        plugins: [router],
        components: {
          LayoutDashboard
        }
      }
    })

    await router.push('/test')
    await wrapper.vm.$nextTick()
    expect(wrapper.classes()).toContain('bg-blue-600')
  })
})