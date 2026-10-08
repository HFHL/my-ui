import { test, expect } from '@playwright/test';

// Only DOM and event checks, without screenshots or image inspection.
test('C009 默认选中 Awards，支持导航选择和 Contact 回调', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?preview=component&id=C009');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(nav.getByRole('button')).toHaveCount(6);
  await expect(nav.getByRole('button', { name: 'Awards', exact: true })).toHaveAttribute('aria-current', 'page');
  await nav.getByRole('button', { name: 'Work', exact: true }).click();
  await expect(nav.getByRole('button', { name: 'Work', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(nav.getByRole('button', { name: 'Awards', exact: true })).not.toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('status')).toHaveText('Selected: Work');
  await nav.getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Contact action triggered.');
  expect(errors).toEqual([]);
});

test('C009 小屏键盘操作与收藏库索引', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?preview=component&id=C009');
  await page.getByRole('button', { name: 'Team', exact: true }).press('Enter');
  await expect(page.getByRole('button', { name: 'Team', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.goto('/');
  await expect(page.locator('.component-card')).toHaveCount(18);
  await page.getByRole('textbox', { name: '搜索组件' }).fill('C009');
  await expect(page.locator('.component-card')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Modern Navbar', exact: true })).toBeAttached();
});
