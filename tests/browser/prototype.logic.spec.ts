import { test, expect } from '@playwright/test';

// DOM/event checks only. No screenshots or image inspection.
test('P001 默认浅色、空白工作台、菜单选择不填入工作区', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?preview=prototype&id=P001');
  const shell = page.locator('[data-prototype="P001"]');
  const sidebar = page.getByRole('complementary', { name: 'Dashboard sidebar navigation' });
  const workbench = page.getByRole('main', { name: '工作台' });
  await expect(shell).toHaveAttribute('data-theme', 'light');
  await expect(sidebar).toHaveAttribute('data-theme', 'light');
  await expect(workbench).toBeEmpty();
  await expect(page.getByRole('searchbox')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Search navigation' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Projects', exact: true })).toBeAttached();
  await expect(page.getByRole('navigation', { name: '项目列表' }).getByRole('button')).toHaveCount(3);
  await expect(page.getByRole('button', { name: '新建项目', exact: true }).locator('svg')).toHaveCount(1);
  await page.getByRole('button', { name: '项目 02', exact: true }).click();
  await expect(page.getByRole('button', { name: '项目 02', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(workbench).toBeEmpty();
  await page.getByRole('switch', { name: 'Light mode' }).click();
  await expect(shell).toHaveAttribute('data-theme', 'dark');
  await expect(sidebar).toHaveAttribute('data-theme', 'dark');
  await expect(workbench).toBeEmpty();
  expect(errors).toEqual([]);
});

test('P001 收起展开与新建项目，以及收藏库原始 C008 不受影响', async ({ page }) => {
  await page.goto('/?preview=prototype&id=P001');
  const sidebar = page.getByRole('complementary', { name: 'Dashboard sidebar navigation' });
  await page.getByRole('button', { name: '收起侧栏' }).click();
  await expect(sidebar).toHaveAttribute('data-collapsed', 'true');
  await expect(page.getByRole('button', { name: 'Search navigation' })).toHaveCount(0);
  await page.getByRole('button', { name: '新建项目', exact: true }).click();
  await expect(page.getByRole('navigation', { name: '项目列表' }).getByRole('button')).toHaveCount(4);
  await expect(page.getByRole('button', { name: '项目 04', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button', { name: '展开侧栏' }).click();
  await expect(sidebar).toHaveAttribute('data-collapsed', 'false');
  await expect(page.getByRole('button', { name: '项目 04', exact: true })).toBeAttached();
  await expect(page.getByRole('main', { name: '工作台' })).toBeEmpty();
  await page.goto('/?preview=component&id=C008');
  await expect(page.getByRole('complementary', { name: 'Dashboard sidebar navigation' })).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Dashboard', exact: true })).toBeAttached();
});

test('P001 原型入口与小屏收起操作', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^项目原型\s+1$/ }).click();
  await expect(page.getByRole('heading', { name: 'P001', exact: true })).toBeAttached();
  await expect(page.getByRole('link', { name: '打开原型' })).toHaveAttribute('href', '/?preview=prototype&id=P001');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?preview=prototype&id=P001');
  await page.getByRole('button', { name: '收起侧栏' }).click();
  await expect(page.locator('[data-prototype="P001"]')).toHaveAttribute('data-collapsed', 'true');
  await page.getByRole('button', { name: '展开侧栏' }).click();
  await expect(page.getByRole('main', { name: '工作台' })).toBeEmpty();
});
