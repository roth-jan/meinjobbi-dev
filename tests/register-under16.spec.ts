import { test, expect } from '@playwright/test';

test('navigate to parental consent screen (under 16)', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  // Click "Login für Schüler" to expand the panel
  await page.getByRole('button', { name: 'Login für Schüler' }).click();
  await page.waitForTimeout(600);

  // Click "Registrierung" link
  await page.getByRole('link', { name: 'Registrierung', exact: true }).click();
  await page.waitForTimeout(600);

  // Fill registration form
  await page.locator('input[placeholder="E-Mail"]').fill('test@example.com');
  await page.locator('input[placeholder="Username"]').fill('testuser');
  await page.locator('input[placeholder="Vorname"]').fill('Max');
  await page.locator('input[placeholder="Name"]').fill('Mustermann');

  // Select Geschlecht
  await page.locator('input[placeholder="Geschlecht"]').click();
  await page.getByRole('option', { name: 'Männlich' }).click();

  // Birthdate under 16
  await page.locator('input[placeholder="Geburtsdatum"]').fill('2012-01-01');

  // Abschlussjahr
  await page.locator('input[placeholder="Voraussichtliches Abschlussjahr"]').click();
  await page.getByRole('option', { name: '2027' }).click();

  // Schule
  await page.locator('input[placeholder="Schulauswahl"]').click();
  await page.getByRole('option', { name: 'Gymnasium' }).click();

  // Passwords
  await page.locator('input[placeholder="Passwort"]').fill('Test1234!');
  await page.locator('input[placeholder="Passwort bestätigen"]').fill('Test1234!');

  // Accept terms
  await page.getByRole('checkbox', { name: /Datenschutzbestimmungen/ }).check();

  // Submit
  await page.getByRole('button', { name: 'Nächster Schritt' }).click();

  // Verify interests screen
  await page.waitForTimeout(500);
  await expect(page.getByText('Deine Stärken')).toBeVisible();

  // Select 3 interests
  await page.getByText('Handwerklich', { exact: true }).click();
  await page.getByText('Technik & IT', { exact: true }).click();
  await page.getByText('Kommunikation', { exact: true }).click();

  // Submit interests
  await page.getByRole('button', { name: 'Profil erstellen' }).click();

  // Verify parental consent screen
  await page.waitForTimeout(500);
  await expect(
    page.locator('input[placeholder="E-Mail der erziehungsberechtigten Person"]')
  ).toBeVisible();

  // Fill guardian email
  await page
    .locator('input[placeholder="E-Mail der erziehungsberechtigten Person"]')
    .fill('guardian@example.com');

  // Submit parental consent
  await page.getByRole('button', { name: 'Absenden und weiter' }).click();

  // Verify code verification screen
  await page.waitForTimeout(500);
  await expect(page.locator('input[placeholder="Code eingeben"]')).toBeVisible();

  // Skip code verification (DEV mode)
  await page.getByRole('button', { name: 'DEV: Skip' }).click();

  // Verify success screen
  await page.waitForTimeout(500);
  await expect(page.getByRole('button', { name: 'Zum Login' })).toBeVisible();

  // Keep browser open for manual testing - press Ctrl+C to close
  await page.waitForTimeout(600000);
});
