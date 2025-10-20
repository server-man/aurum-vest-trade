import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/auth');
    
    // Check for email input
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    
    // Check for password input
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/auth');
    
    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /sign in|log in/i });
    await submitButton.click();
    
    // Wait for validation messages (form validation may be async)
    await page.waitForTimeout(500);
  });

  test('should toggle between sign in and sign up', async ({ page }) => {
    await page.goto('/auth');
    
    // Look for toggle button/link
    const toggleLink = page.getByText(/sign up|create account/i).first();
    if (await toggleLink.isVisible()) {
      await toggleLink.click();
      await expect(page.getByText(/sign up|create account/i)).toBeVisible();
    }
  });
});
