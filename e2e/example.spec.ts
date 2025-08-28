import { test, expect } from '@playwright/test';

test('has welcome text', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toContainText('Welcome');
});
