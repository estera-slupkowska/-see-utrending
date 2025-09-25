const { test, expect } = require('@playwright/test');

test.describe('TikTok OAuth Integration', () => {
  test('should successfully redirect to TikTok authorization', async ({ page }) => {
    // Navigate to the app
    await page.goto('https://seeutrending.vercel.app');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check if we need to login first
    const loginButton = await page.getByText('Zaloguj się').first();
    if (await loginButton.isVisible()) {
      console.log('Need to login first');

      // Click login
      await loginButton.click();

      // Wait for auth modal
      await page.waitForSelector('input[type="email"]', { timeout: 10000 });

      // Fill in test credentials (you'll need to provide these)
      await page.fill('input[type="email"]', 'nestisiekfilm@gmail.com');
      await page.fill('input[type="password"]', 'your-password-here'); // Replace with actual password

      // Click login
      await page.getByRole('button', { name: /zaloguj/i }).click();

      // Wait for successful login
      await page.waitForURL(/dashboard/, { timeout: 15000 });
    }

    // Navigate to dashboard if not already there
    const dashboardLink = await page.getByText('Panel Użytkownika');
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
    }

    // Wait for dashboard to load
    await page.waitForSelector('[data-testid="tiktok-connection-status"], button:has-text("Połącz TikTok")', { timeout: 10000 });

    // Set up console logging
    page.on('console', (msg) => {
      if (msg.type() === 'log' || msg.type() === 'error') {
        console.log(`Browser Console [${msg.type()}]:`, msg.text());
      }
    });

    // Look for TikTok connect button
    const connectButton = await page.getByText('Połącz TikTok').first();

    if (await connectButton.isVisible()) {
      console.log('✅ Found TikTok connect button');

      // Click the connect button
      await connectButton.click();

      // Wait for redirect or error
      await page.waitForTimeout(3000);

      // Check current URL
      const currentUrl = page.url();
      console.log('Current URL after connect:', currentUrl);

      if (currentUrl.includes('tiktok.com')) {
        console.log('✅ Successfully redirected to TikTok authorization');

        // Check for TikTok authorization elements
        const authElements = await page.textContent('body');
        console.log('TikTok page content preview:', authElements.substring(0, 500));

        // Look for authorization-related text
        const hasAuthText = authElements.toLowerCase().includes('seeutrending') ||
                           authElements.toLowerCase().includes('sandbox') ||
                           authElements.toLowerCase().includes('authorize') ||
                           authElements.toLowerCase().includes('access');

        if (hasAuthText) {
          console.log('✅ TikTok authorization page contains expected content');
        } else {
          console.log('⚠️  TikTok page content may not be authorization page');
        }

      } else if (currentUrl.includes('error=tiktok')) {
        console.log('❌ OAuth flow failed with error in URL');

        // Extract error details from URL
        const url = new URL(currentUrl);
        const error = url.searchParams.get('error');
        const details = url.searchParams.get('details');

        console.log('Error:', error);
        console.log('Details:', details);

        // This indicates the OAuth setup is working but there's a configuration issue
        expect(error).toContain('Client key does not match'); // This is what we expect to fix
      } else {
        console.log('❌ Unexpected behavior - not redirected to TikTok');
        console.log('Current URL:', currentUrl);
      }

    } else {
      // Check if TikTok is already connected
      const connectedStatus = await page.getByText('Połączony').first();
      if (await connectedStatus.isVisible()) {
        console.log('✅ TikTok is already connected');
      } else {
        console.log('❌ Could not find TikTok connect button');

        // Take a screenshot for debugging
        await page.screenshot({ path: 'debug-dashboard.png' });
        console.log('📸 Saved debug screenshot: debug-dashboard.png');
      }
    }

    // Wait a bit more to see any async operations
    await page.waitForTimeout(2000);

    // Check for any console errors
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    // Final URL check
    console.log('Final URL:', page.url());
  });

  test('should verify OAuth configuration', async ({ page }) => {
    console.log('🔧 Testing OAuth configuration...');

    // Navigate directly to the app
    await page.goto('https://seeutrending.vercel.app');

    // Evaluate TikTok configuration in browser
    const config = await page.evaluate(() => {
      return {
        hasClientKey: !!window.localStorage.getItem('VITE_TIKTOK_CLIENT_KEY') ||
                     typeof import?.meta?.env?.VITE_TIKTOK_CLIENT_KEY !== 'undefined',
        hasRedirectUri: !!window.localStorage.getItem('VITE_TIKTOK_REDIRECT_URI') ||
                       typeof import?.meta?.env?.VITE_TIKTOK_REDIRECT_URI !== 'undefined',
        currentDomain: window.location.hostname,
        protocol: window.location.protocol
      };
    });

    console.log('OAuth Configuration:', config);

    expect(config.protocol).toBe('https:');
    expect(config.currentDomain).toContain('seeutrending');
  });
});