import { expect, test } from '@playwright/test';

test('homepage renders with heading', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Upload Your Image' })).toBeVisible();
});
