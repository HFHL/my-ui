import { test, expect } from '@playwright/test';

// Source-based DOM/event checks only; no screenshots or visual comparison.
test('P002 展示来源内容与六周期图表切换', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?preview=prototype&id=P002');
  await expect(page.getByText('Fred Palmer', { exact: true })).toBeAttached();
  await expect(page.getByRole('heading', { name: 'Portfolio', exact: true })).toBeAttached();
  await expect(page.locator('.line-chart')).toHaveAttribute('data-period', '1M');
  const initialChart = await page.locator('.line-chart svg').getAttribute('viewBox');
  expect(initialChart).toBeTruthy();
  await page.getByRole('button', { name: '1D', exact: true }).click();
  await expect(page.locator('.line-chart')).toHaveAttribute('data-period', '1D');
  await expect(page.getByText('+2.82%', { exact: true })).toBeAttached();
  await expect(page.getByRole('button', { name: '1D', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.getByText('+785.32%', { exact: true })).toBeAttached();
  expect(errors).toEqual([]);
});

test('P002 侧栏开关、日期排序及本地 Send 演示', async ({ page }) => {
  await page.goto('/?preview=prototype&id=P002');
  await page.getByRole('button', { name: 'Toggle navigation', exact: true }).click();
  await expect(page.locator('[data-app-layout]')).toHaveAttribute('data-state', 'collapsed');
  await page.getByRole('button', { name: 'Toggle navigation', exact: true }).click();
  await expect(page.locator('[data-app-layout]')).toHaveAttribute('data-state', 'expanded');
  await page.getByRole('columnheader', { name: 'Date', exact: true }).click();
  await expect(page.getByRole('columnheader', { name: 'Date', exact: true })).toHaveAttribute('aria-sort', 'ascending');
  await page.getByRole('button', { name: 'Send', exact: true }).filter({ visible: true }).first().click();
  await expect(page.getByRole('dialog')).toBeAttached();
  await page.getByRole('spinbutton', { name: 'Amount' }).fill('1.2');
  await page.getByRole('textbox', { name: 'Recipient' }).fill('demo-recipient');
  await page.getByRole('button', { name: 'Preview send', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Demo complete. No transaction was sent.');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('P002 小屏菜单入口与原型收藏索引', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?preview=prototype&id=P002');
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await expect(page.locator('[data-app-layout]')).toHaveAttribute('data-mobile-open', 'true');
  await expect(page.getByRole('button', { name: 'Dashboard', exact: true })).toBeAttached();
  await page.goto('/');
  await page.getByRole('button', { name: /^项目原型\s+2$/ }).click();
  await expect(page.getByRole('heading', { name: 'P002', exact: true })).toBeAttached();
  await expect(page.getByRole('heading', { name: 'P001', exact: true })).toBeAttached();
});
