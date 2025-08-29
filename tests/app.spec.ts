import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '~~/src/app.vue';

describe('App', () => {
  it('renders', () => {
    const wrapper = mount(App);
    expect(wrapper.find('div').exists()).toBe(true);
  });
});
