import { test, expect } from '@playwright/test';

test('P002 拆分组件独立预览，无运行时错误', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (let number = 10; number <= 24; number++) {
    await page.goto(`/?preview=component&id=C${String(number).padStart(3, '0')}`);
    await expect(page.locator('#root > div')).toBeAttached();
    await expect(page.locator('#root > div > :not([role="status"])').first()).toBeAttached();
    await expect(page.getByRole('alert')).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test('侧栏、顶部操作和周期选择回调', async ({ page }) => {
  await page.goto('/?preview=component&id=C010');
  await page.getByRole('button', { name: 'Portfolio', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Portfolio', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('status')).toHaveText('Portfolio');
  await page.goto('/?preview=component&id=C011');
  await page.getByRole('button', { name: 'Receive', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Receive');
  await page.goto('/?preview=component&id=C014');
  await page.getByRole('button', { name: '1Y', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('1Y');
});

test('图表周期、持仓选择、表格日期排序', async ({ page }) => {
  await page.goto('/?preview=component&id=C015');
  await expect(page.locator('[data-period]')).toHaveAttribute('data-period', '1M');
  await page.getByRole('button', { name: '1D', exact: true }).click();
  await expect(page.locator('[data-period]')).toHaveAttribute('data-period', '1D');
  await expect(page.getByText('+2.82%', { exact: false })).toBeAttached();
  await page.goto('/?preview=component&id=C016');
  await page.getByRole('button').filter({ hasText: 'BTC' }).click();
  await expect(page.getByRole('status')).toHaveText('BTC');
  await page.getByRole('button', { name: 'See all holdings', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('See all holdings callback');
  await page.goto('/?preview=component&id=C017');
  await page.getByRole('button', { name: 'Date', exact: true }).click();
  await expect(page.getByRole('columnheader', { name: 'Date', exact: true })).toHaveAttribute('aria-sort', 'ascending');
  await expect(page.locator('tbody tr').first()).toContainText('0xff9d0a7102…');
});

test('独立弹窗、按钮、布局与列表项交互', async ({ page }) => {
  await page.goto('/?preview=component&id=C018');
  await page.getByRole('button', { name: 'Open Send', exact: true }).click();
  await page.getByRole('spinbutton', { name: 'Amount' }).fill('1');
  await page.getByRole('textbox', { name: 'Recipient' }).fill('demo');
  await page.getByRole('button', { name: 'Preview send', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Demo complete. No transaction was sent.');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goto('/?preview=component&id=C020');
  await page.getByRole('button', { name: 'Swap', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Swap');
  await page.goto('/?preview=component&id=C021');
  await page.getByRole('button', { name: 'Toggle navigation', exact: true }).click();
  await expect(page.locator('[data-collapsed]')).toHaveAttribute('data-collapsed', 'true');
  await page.goto('/?preview=component&id=C022');
  await page.getByRole('button').click();
  await expect(page.getByRole('status')).toHaveText('BTC selected');
  await page.goto('/?preview=component&id=C024');
  await page.getByRole('button').click();
  await expect(page.getByRole('status')).toHaveText('Profile selected');
});

test('收藏库收录所有拆分组件，支持来源搜索', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.component-card')).toHaveCount(18);
  await page.getByRole('textbox', { name: '搜索组件' }).fill('C024');
  await expect(page.locator('.component-card')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'User Profile', exact: true })).toBeAttached();
  await page.getByRole('textbox', { name: '搜索组件' }).fill('P002');
  await expect(page.locator('.component-card')).toHaveCount(15);
});
