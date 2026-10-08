import { test, expect } from '@playwright/test';

test('组件搜索、分类、标签组合与收藏仍可用', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.component-card')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Upload dropzone', exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: '搜索组件' }).fill('c007');
  await expect(page.locator('.component-card')).toHaveCount(1);
  await page.getByRole('textbox', { name: '搜索组件' }).fill('C001');
  await expect(page.getByText('没有找到匹配的组件')).toBeVisible();
  await page.getByRole('button', { name: '清除筛选', exact: true }).click();
  await page.getByRole('button', { name: /^表单\s+1$/ }).click();
  await page.getByRole('button', { name: '上传', exact: true }).click();
  await page.getByRole('button', { name: '动画', exact: true }).click();
  await expect(page.locator('.component-card')).toHaveCount(1);
  await page.getByRole('button', { name: '收藏 C007', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: /^我的收藏\s+1$/ }).click();
  await expect(page.locator('.component-card')).toHaveCount(1);
  await page.getByRole('button', { name: /^项目原型\s+0$/ }).click();
  await expect(page.getByText('开始你的第一个原型')).toBeVisible();
  expect(errors).toEqual([]);
});

test('键盘触发模拟上传、拒绝超大文件、自动返回托盘', async ({ page }) => {
  await page.goto('/?preview=component&id=C007');
  const image = page.getByRole('button', { name: /^mood.png/ });
  await image.press('Enter');
  await expect(page.getByText('Uploaded', { exact: false })).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Drag a file here', { exact: true })).toBeVisible();
  const video = page.getByRole('button', { name: /^demo.mp4/ });
  await video.press('Enter');
  await expect(page.getByText('Too big — up to 5 MB', { exact: true })).toBeVisible();
  await video.press('Enter');
  await expect(page.getByText("Still 12.6 MB. It didn't shrink.", { exact: true })).toBeVisible();
});

test('指针拖入图片与视频，详情可关闭', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '查看 C007 Upload dropzone', exact: true }).click();
  const preview = page.frameLocator('iframe[title="C007 交互预览"]');
  const image = await preview.getByRole('button', { name: /^mood.png/ }).boundingBox();
  const target = await preview.getByText('Drag a file here', { exact: true }).boundingBox();
  expect(image).not.toBeNull(); expect(target).not.toBeNull();
  await page.mouse.move(image!.x + image!.width / 2, image!.y + image!.height / 2);
  await page.mouse.down();
  await page.mouse.move(target!.x + target!.width / 2, target!.y + target!.height / 2, { steps: 15 });
  await expect(preview.getByText('Drop to upload', { exact: true })).toBeVisible();
  await page.mouse.up();
  await expect(preview.getByText('Uploaded', { exact: false })).toBeVisible({ timeout: 10000 });
  await expect(preview.getByText('Drag a file here', { exact: true })).toBeVisible();
  const video = await preview.getByRole('button', { name: /^demo.mp4/ }).boundingBox();
  await page.mouse.move(video!.x + video!.width / 2, video!.y + video!.height / 2);
  await page.mouse.down();
  await page.mouse.move(target!.x + target!.width / 2, target!.y + target!.height / 2, { steps: 15 });
  await page.mouse.up();
  await expect(preview.getByText('Too big — up to 5 MB', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '关闭详情' }).focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('移动布局、局部设计变量、减少动效与注销编号', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?preview=component&id=C007');
  await expect(page.getByRole('button', { name: /^mood.png/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  const rootTokens = await page.locator('#root > div > div').evaluate(el => {
    const style = getComputedStyle(el);
    return { ink: style.getPropertyValue('--ink').trim(), signal: style.getPropertyValue('--signal').trim(), font: style.fontFamily };
  });
  expect(rootTokens.ink).toBe('#282e32');
  expect(rootTokens.signal).toBe('#146b57');
  expect(rootTokens.font).toContain('sans-serif');
  await page.getByRole('button', { name: /^mood.png/ }).press('Enter');
  await expect(page.getByText('Uploaded', { exact: false })).toBeVisible();
  await page.screenshot({ path: 'test-results/dropzone-mobile.png', fullPage: true });
  await page.goto('/?preview=component&id=C001');
  await expect(page.getByRole('alert')).toHaveText('没有找到这个预览。请核对编号或原型名称。');
});

test('桌面预览截图', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.component-card')).toHaveCount(2);
  await expect(page.frameLocator('iframe[title="C007 Upload dropzone缩略预览"]').getByText('Drag a file here', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/catalog-desktop.png', fullPage: true });
  await page.getByRole('button', { name: '查看 C007 Upload dropzone', exact: true }).click();
  await expect(page.frameLocator('iframe[title="C007 交互预览"]').getByText('Drag a file here', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/dropzone-detail.png', fullPage: true });
});
