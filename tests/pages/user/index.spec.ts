// tests/pages/user/index.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import UserListPage from '~~/src/pages/user/index.vue';
import { useMajorFormStore, useMajorListStore } from '~~/src/pages/user/_subs/user';
import { setupPinia } from '~~/tests/utils.test';

const mockRouter = {
  push: vi.fn(),
  currentRoute: {
    value: {
      path: '/user',
    },
  },
};

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}));

describe('User List Page (~~/src/pages/user/index.vue)', () => {
  beforeEach(() => {
    setupPinia();
    mockRouter.push.mockClear();
    // Reset the path before each test
    mockRouter.currentRoute.value.path = '/user';
  });

  it('should render child components', () => {
    const wrapper = mount(UserListPage, {
      global: {
        stubs: {
          SearchFilter: true,
          DataList: true,
        },
      },
    });
    expect(wrapper.findComponent({ name: 'SearchFilter' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'DataList' }).exists()).toBe(true);
  });

  it('should call refetch on mount', () => {
    const listStore = useMajorListStore();
    const refetchSpy = vi.spyOn(listStore, 'refetch');

    mount(UserListPage, {
      global: {
        stubs: { SearchFilter: true, DataList: true },
      },
    });

    expect(refetchSpy).toHaveBeenCalled();
  });

  it('should reset and dispose stores on unmount if navigating away', () => {
    const formStore = useMajorFormStore();
    const listStore = useMajorListStore();
    const formResetSpy = vi.spyOn(formStore, '$reset');
    const listResetSpy = vi.spyOn(listStore, '$reset');
    const formDisposeSpy = vi.spyOn(formStore, '$dispose');
    const listDisposeSpy = vi.spyOn(listStore, '$dispose');

    const wrapper = mount(UserListPage, {
      global: {
        stubs: { SearchFilter: true, DataList: true },
      },
    });

    // Simulate navigating away from the user section
    mockRouter.currentRoute.value.path = '/dashboard';
    wrapper.unmount();

    expect(formResetSpy).toHaveBeenCalled();
    expect(listResetSpy).toHaveBeenCalled();
    expect(formDisposeSpy).toHaveBeenCalled();
    expect(listDisposeSpy).toHaveBeenCalled();
  });

  it('should NOT reset stores on unmount if navigating within user section', () => {
    const formStore = useMajorFormStore();
    const listStore = useMajorListStore();
    const formResetSpy = vi.spyOn(formStore, '$reset');
    const listResetSpy = vi.spyOn(listStore, '$reset');

    const wrapper = mount(UserListPage, {
      global: {
        stubs: { SearchFilter: true, DataList: true },
      },
    });

    // Simulate navigating to a user detail page
    mockRouter.currentRoute.value.path = '/user/1';
    wrapper.unmount();

    expect(formResetSpy).not.toHaveBeenCalled();
    expect(listResetSpy).not.toHaveBeenCalled();
  });
});
