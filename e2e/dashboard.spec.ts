import { test, expect } from '@playwright/test';

test.describe('Dashboard (Unauthenticated)', () => {
  test('should redirect to auth when accessing dashboard without login', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to auth page
    await expect(page).toHaveURL(/\/auth/);
  });

  test('should redirect to auth when accessing protected routes', async ({ page }) => {
    const protectedRoutes = [
      '/dashboard/wallet',
      '/dashboard/trading-bots',
      '/dashboard/signals',
      '/dashboard/profile',
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/auth/);
    }
  });
});

// Note: Authenticated tests would require setting up test user credentials
// and login flow. This is a starting point for E2E testing.
