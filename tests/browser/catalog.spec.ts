import { test, expect } from '@playwright/test';

test('编号搜索、分类、标签组合、空结果与收藏持久化', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.component-card')).toHaveCount(6);
  await page.getByRole('textbox', { name: '搜索组件' }).fill('c002');
  await expect(page.locator('.component-card')).toHaveCount(1);
  await expect(page.getByRole('button', { name: '指标卡片', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '清空搜索' }).click();
  await page.getByRole('button', { name: /^导航\s+2$/ }).click();
  await expect(page.locator('.component-card')).toHaveCount(2);
  await page.getByRole('button', { name: '切换', exact: true }).click();
  await expect(page.locator('.component-card')).toHaveCount(1);
  await page.getByRole('textbox', { name: '搜索组件' }).fill('不存在');
  await expect(page.getByText('没有找到匹配的组件')).toBeVisible();
  await page.getByRole('button', { name: '清除筛选', exact: true }).click();
  await page.getByRole('button', { name: '收藏 C002', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: /^我的收藏\s+1$/ }).click();
  await expect(page.locator('.component-card')).toHaveCount(1);
  expect(errors).toEqual([]);
});
test('独立 iframe 交互、详情键盘关闭、原型交互', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '查看 C001 基础按钮', exact: true }).click();
  const preview = page.frameLocator('iframe[title="C001 交互预览"]');
  await preview.getByRole('button', { name: '保存更改' }).click();
  await expect(preview.getByText('更改已保存')).toBeVisible();
  await page.getByRole('button', { name: '关闭详情' }).focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goto('/?preview=prototype&id=studio-overview');
  await page.getByRole('button', { name: '创建示例项目' }).click();
  await expect(page.getByText('09', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '本周', exact: true }).click();
  await expect(page.getByText('3,201', { exact: true })).toBeVisible();
});
test('移动布局无横向溢出，非法预览显示错误', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.component-card')).toHaveCount(6);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  for (const iframe of await page.locator('.component-stage iframe').all()) {
    await iframe.scrollIntoViewIfNeeded();
    await expect(iframe.contentFrame().getByRole('status')).toHaveCount(0);
    await expect(iframe.contentFrame().locator('#root > div')).toBeVisible();
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'test-results/catalog-mobile.png', fullPage: true });
  await page.goto('/?preview=component&id=C999');
  await expect(page.getByRole('alert')).toHaveText('没有找到这个预览。请核对编号或原型名称。');
});
test('桌面页面截图', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.component-card')).toHaveCount(6);
  for (const iframe of await page.locator('.component-stage iframe').all()) {
    await iframe.scrollIntoViewIfNeeded();
    await expect(iframe.contentFrame().locator('#root > div')).toBeVisible();
    await expect(iframe.contentFrame().getByRole('status')).toHaveCount(0);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'test-results/catalog-desktop.png', fullPage: true });
});
