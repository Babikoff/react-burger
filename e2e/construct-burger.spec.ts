import { test, expect } from '@playwright/test';

import { testOrder, testUser1 } from '@/utils/tests/test-data';
import { testIngredients } from '@/utils/tests/test-ingredients';

const bunName = 'Краторная булка N-200i 1255';
const ingredientName1 = 'Плоды Фалленианского дерева';
const ingredientName2 = 'Мини-салат Экзо-Плантаго';

test('Construct burger test', async ({ page }, testInfo) => {
  // Arrange
  const browserName = testInfo.project.name;
  const isFirefox = browserName === 'firefox';

  const expectedOrderNumber = '1827';

  // В браузере Firefox отличается формат HAR-файлов, поэтому
  // для Firefox отдельные HAR-файлы.
  // Прим. реально отличия в форматах обнаружены только для файла orders,
  // но для порядка разделим все файлы.
  const harSuffix = browserName === 'firefox' ? 'firefox' : 'default';

  // Мокаем API с помощью HAR
  await page.routeFromHAR(`./e2e/hars/ingredients.${harSuffix}.har`, {
    url: '**/api/ingredients',
    update: false,
  });

  await page.routeFromHAR(`./e2e/hars/orders.${harSuffix}.har`, {
    url: '**/api/orders',
    update: false,
  });

  await page.routeFromHAR(`./e2e/hars/login.${harSuffix}.har`, {
    url: '**/auth/login',
    update: false,
  });

  // Мокируем получение данных о пользователе и accessToken,
  // чтобы избежать появления окна ввода логина и пароля
  await page.routeFromHAR(`./e2e/hars/user.${harSuffix}.har`, {
    url: '**/auth/user',
    update: false,
  });

  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'Bearer my-accessToken');
  });

  // Act: Начало теста
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const bun = await page.getByRole('link', { name: bunName });
  const constructorDropTarget = page.getByTestId('burger-constructor');
  await bun.dragTo(constructorDropTarget);

  // Подмотаем список доступных ингредиентов на Начинки, чтобы прошёл drag and drop
  await page.locator('span').filter({ hasText: 'Начинки' }).click();
  // Добавим первый игредиент
  const ingredient = await page.getByRole('link', { name: ingredientName1 });
  await ingredient.dragTo(constructorDropTarget); // 1

  // Добавим второй ингредиент два раза
  const ingredient2 = await page.getByRole('link', { name: ingredientName2 });
  await ingredient2.dragTo(constructorDropTarget); // 2
  await ingredient2.dragTo(constructorDropTarget); // 3

  const list = page.getByTestId('constructor-ingredients-list');

  // Проверяем начальный порядок ингредиентов
  const items = list.locator('li');
  expect(items).toHaveCount(3);
  await expect(items.nth(0)).toContainText(ingredientName1);
  await expect(items.nth(1)).toContainText(ingredientName2);
  await expect(items.nth(2)).toContainText(ingredientName2);

  // В Firefox dragTo() не заработал для сортировки,
  // поэтому в Firefox проверять пересортировку в Firefox не будем
  if (!isFirefox) {
    // Проверям сортировку списка ингредиентов в констуркторе
    // Переместим первый ингредиент в самый низ списка
    const ingredientToMoveDown = page.getByTestId('constructor-item-1');
    const ingredientToMoveUp = page.getByTestId('constructor-item-3');

    await ingredientToMoveDown.dragTo(ingredientToMoveUp, {
      force: true,
      sourcePosition: { x: 50, y: 0 },
      targetPosition: { x: 50, y: 50 },
      steps: 100,
    });

    // Проверим, что первый элемент переместился вниз списка
    await expect(items.nth(0)).toContainText(ingredientName2);
    await expect(items.nth(1)).toContainText(ingredientName2);
    await expect(items.nth(2)).toContainText(ingredientName1);
  }

  await page.getByText('Оформить заказ').click();

  if (page.url().endsWith('/login')) {
    await expect(page.locator('#email')).toBeVisible();
    await page.locator('#email').click();
    await page.locator('#email').fill('autotest.xcv@c-loud.ru');
    await page.locator('#password').click();
    await page.locator('#password').fill('123456789');
    await page.getByRole('button', { name: 'Войти' }).click();
    await page.getByText('Оформить заказ').click();
  }

  // Проверим, что модальное окно открылось
  await expect(page.getByText('идентификатор заказа')).toBeVisible();
  await expect(page.locator('#modal')).toContainText('идентификатор заказа');

  await expect(
    page.locator('#modal').getByRole('heading', { level: 1, name: expectedOrderNumber })
  ).toBeVisible();

  await page.locator('body').press('Escape');

  await expect(page.getByText('идентификатор заказа')).not.toBeVisible();
});
