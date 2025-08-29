// tests/pages/user/[id]/index.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { setupPinia } from '~~/tests/utils.test';
import UserDetailPage from '~~/src/pages/user/[id]/index.vue';

const mockRouter = {
  push: vi.fn(),
};
const mockRoute = {
  params: { id: '1' },
};

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  useRoute: () => mockRoute,
}));

describe('User Detail Page (~~/src/pages/user/[id]/index.vue)', () => {
  beforeEach(() => {
    setupPinia();
  });

  it('should render child components', () => {
    const wrapper = mount(UserDetailPage, {
      global: {
        stubs: {
          DetailHeader: true,
          DetailContents: true,
          NDivider: true,
        },
      },
    });
    expect(wrapper.findComponent({ name: 'DetailHeader' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'DetailContents' }).exists()).toBe(true);
  });
});
