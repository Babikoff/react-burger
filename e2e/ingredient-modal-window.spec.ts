import { test, expect, type Page } from '@playwright/test';

const ingedentName = 'Соус с шипами Антарианского плоскоходца';

test('Test ingredient modal window', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page.getByText('Соберите бургер')).toBeVisible();

  // Проверим, как работает перемещение по вкладкам типов ингредиентов
  await page.locator('span').filter({ hasText: 'Соусы' }).click();
  const ingredient = await page.getByRole('link', { name: ingedentName });
  await expect(ingredient).toBeVisible();

  // Проверим, что модальное окно ингредиента откроется по клику на ингредиенте
  await ingredient.click();
  await checkModalWindow(page);

  // Проверим, что модальное окно ингредиента откроется по нажатию Enter
  await ingredient.press('Enter');
  await checkModalWindow(page);
});

async function checkModalWindow(page: Page): Promise<void> {
  const modalWindow = await page.locator('#modal');
  await expect(page).toHaveURL(/\/ingredients\/[a-fA-F0-9]{24}$/);
  await expect(modalWindow).toContainText('Детали ингредиента');
  // Проверим, что модальное окно открылось с правильным ингредиентом
  await expect(modalWindow).toContainText(ingedentName);
  await page.locator('body').press('Escape');

  // Проверим, что модальное окно закрылось
  await expect(modalWindow).not.toContainText('Детали ингредиента');
}