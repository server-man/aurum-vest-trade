import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load the landing page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Aurum Vest/);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    
    // Check for hero section elements
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
  });

  test('should navigate to auth page when CTA is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Find and click the main CTA button
    const ctaButton = page.getByRole('link', { name: /start trading/i }).first();
    await ctaButton.click();
    
    // Check if navigation happened
    await expect(page).toHaveURL(/\/auth/);
  });

  test('should display features section', async ({ page }) => {
    await page.goto('/');
    
    // Check for features section
    const featuresSection = page.locator('text=Features').first();
    await expect(featuresSection).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile menu exists
    const mobileMenu = page.locator('[role="button"]').first();
    await expect(mobileMenu).toBeVisible();
  });
});
