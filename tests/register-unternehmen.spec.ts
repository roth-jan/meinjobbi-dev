import { test, expect } from '@playwright/test';

test('register as unternehmen', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  // Click "Login für Unternehmen" to expand the panel
  await page.getByRole('button', { name: 'Login für Unternehmen' }).click();
  await page.waitForTimeout(600);

  // Click "Registrierung" link
  await page.getByRole('link', { name: 'Registrierung', exact: true }).click();
  await page.waitForTimeout(600);

  // Fill registration form - Company info
  await page.locator('input[placeholder="Unternehmen"]').fill('Test GmbH');
  await page.locator('input[placeholder="Postleitzahl"]').fill('12345');
  await page.locator('input[placeholder="Ort"]').fill('Berlin');
  await page.locator('input[placeholder="Straße/Hausnummer"]').fill('Teststraße 1');

  // Select Branche
  await page.locator('input[placeholder="Branche"]').click();
  await page.getByRole('option', { name: 'IT & Technik' }).click();

  // Select Mitarbeiterzahl
  await page.locator('input[placeholder="Mitarbeiterzahl"]').click();
  await page.getByRole('option', { name: '11-50' }).click();

  // Fill registration form - Contact person info
  await page.locator('input[placeholder="Name"]').fill('Mustermann');
  await page.locator('input[placeholder="Vorname"]').fill('Max');
  await page.locator('input[placeholder="E-Mail"]').fill('max@testgmbh.de');
  await page.locator('input[placeholder="Telefonnummer"]').fill('+49 123 456789');

  // Passwords
  await page.locator('input[placeholder="Passwort"]').fill('Test1234!');
  await page.locator('input[placeholder="Passwort bestätigen"]').fill('Test1234!');

  // Accept terms
  await page.getByRole('checkbox', { name: /Datenschutzbestimmungen/ }).check();

  // Submit
  await page.getByRole('button', { name: 'Jetzt registrieren' }).click();

  // Verify success screen - click button to confirm it works
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Zum Login' }).click();

  // Verify we're back at login page
  await expect(page.getByRole('button', { name: 'Login für Unternehmen' })).toBeVisible();

  // Keep browser open for manual testing - press Ctrl+C to close
  await page.waitForTimeout(600000);
});
