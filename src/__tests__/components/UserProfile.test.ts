import { describe, it, expect, beforeEach, vi} from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import UserProfile from '../../components/UserProfile.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { ChevronDown, LogOut } from 'lucide-vue-next';

// Mock the supabase client
vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({
            data: { first_name: 'Ivan', last_name: 'Mendez' },
            error: null
          })
        })
      })
    })
  }
}));

describe('UserProfile', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia());
  });

  // Remove the fake timers setup and cleanup

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: {} },
      { path: '/auth', component: {} }
    ]
  });

  it('renders properly for authenticated user', async () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              user: {
                user: {
                  id: 'test-user-id',
                  email: 'test@example.com',
                  user_metadata: {
                    first_name: 'Test',
                    last_name: 'User'
                  }
                },
                isGuestMode: false,
                isLoading: false
              }
            }
          })
        ],
        components: {
          ChevronDown,
          LogOut
        }
      }
    });

    // Wait for all promises to resolve
    await flushPromises();
    
    // Should display initials from the database (IM for Ivan Mendez)
    const initialElement = wrapper.find('.w-10.h-10.rounded-full');
    expect(initialElement.text()).toBe('IM');

    // Should display full name from the database
    const nameElement = wrapper.find('.text-sm.font-medium.truncate');
    expect(nameElement.text()).toBe('Ivan Mendez');
  });

  it('renders properly for guest user', async () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              user: {
                user: null,
                isGuestMode: true,
                isLoading: false
              }
            }
          })
        ],
        components: {
          ChevronDown,
          LogOut
        }
      }
    });

    // Wait for all promises to resolve
    await flushPromises();

    // Should display G for Guest
    const initialElement = wrapper.find('.w-10.h-10.rounded-full');
    expect(initialElement.text()).toBe('G');

    // Should display Guest User
    const nameElement = wrapper.find('.text-sm.font-medium.truncate');
    expect(nameElement.text()).toBe('Guest User');
  });

  it('opens dropdown when clicked', async () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              user: {
                user: {
                  id: 'test-user-id',
                  email: 'test@example.com'
                },
                isGuestMode: false,
                isLoading: false
              }
            }
          })
        ],
        components: {
          ChevronDown,
          LogOut
        }
      }
    });

    // Dropdown should be closed initially
    expect(wrapper.find('.absolute.bottom-full').exists()).toBe(false);

    // Click the button to open dropdown
    await wrapper.find('button').trigger('click');

    // Dropdown should be open
    expect(wrapper.find('.absolute.bottom-full').exists()).toBe(true);
  });

  it('signs out when sign out button is clicked', async () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              user: {
                user: {
                  id: 'test-user-id',
                  email: 'test@example.com'
                },
                isGuestMode: false,
                isLoading: false
              }
            },
            stubActions: false
          })
        ],
        components: {
          ChevronDown,
          LogOut
        }
      }
    });

    // Open dropdown
    await wrapper.find('button').trigger('click');
    
    // Mock router push
    router.push = vi.fn();
    
    // Click sign out button
    await wrapper.find('.text-red-400').trigger('click');
    
    // Should redirect to auth page
    expect(router.push).toHaveBeenCalledWith('/auth');
  });
});