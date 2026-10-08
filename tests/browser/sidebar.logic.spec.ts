import { test, expect } from '@playwright/test';

// DOM/event checks only: no screenshots, image reads, geometry or visual checks.
test('C008 导航选择、搜索过滤、主题与退出回调', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?preview=component&id=C008');
  const sidebar = page.getByRole('complementary', { name: 'Dashboard sidebar navigation' });
  await expect(sidebar).toHaveAttribute('data-theme', 'dark');
  await expect(sidebar).toHaveAttribute('data-collapsed', 'false');
  await page.getByRole('button', { name: 'Analytics', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Analytics', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('status')).toHaveText('Selected: Analytics');
  await page.getByRole('searchbox', { name: 'Search navigation' }).fill('REV');
  await expect(page.getByRole('navigation', { name: 'Dashboard sections' }).getByRole('button')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Revenue', exact: true })).toBeAttached();
  await page.getByRole('searchbox', { name: 'Search navigation' }).fill('no-such-section');
  await expect(page.getByText('No matching sections')).toBeAttached();
  await page.getByRole('switch', { name: 'Light mode' }).click();
  await expect(sidebar).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('switch', { name: 'Light mode' })).toBeChecked();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Logout', exact: true }).click();
  await expect(page.getByRole('status').first()).toHaveText('Logout callback triggered (demo only).');
  expect(errors).toEqual([]);
});

test('收起与搜索展开、收藏库保持独立组件索引', async ({ page }) => {
  await page.goto('/?preview=component&id=C008');
  const sidebar = page.getByRole('complementary', { name: 'Dashboard sidebar navigation' });
  await page.getByRole('button', { name: '收起侧栏' }).click();
  await expect(sidebar).toHaveAttribute('data-collapsed', 'true');
  await page.getByRole('button', { name: 'Search navigation' }).click();
  await expect(sidebar).toHaveAttribute('data-collapsed', 'false');
  await expect(page.getByRole('searchbox', { name: 'Search navigation' })).toBeFocused();
  await page.goto('/');
  await expect(page.locator('.component-card')).toHaveCount(3);
  await page.getByRole('textbox', { name: '搜索组件' }).fill('C008');
  await expect(page.locator('.component-card')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Dashboard Sidebar Navigation', exact: true })).toBeAttached();
});
