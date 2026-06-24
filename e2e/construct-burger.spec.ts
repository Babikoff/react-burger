import { test, expect } from '@playwright/test';

import { HomePageObjectModel } from './pom-classes/home-page-object-model';

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
  const pageModel = new HomePageObjectModel(page);
  await pageModel.goto();

  await pageModel.addBun(bunName);

  // Подмотаем список доступных ингредиентов на Начинки, чтобы прошёл drag and drop
  await pageModel.navigateToIngredientType('Начинки');

  // Добавим первый игредиент
  await pageModel.addBunFilling(ingredientName1); // 1

  // Добавим второй ингредиент два раза
  await pageModel.addBunFilling(ingredientName2); // 2
  await pageModel.addBunFilling(ingredientName2); // 3

  // Проверяем начальный порядок ингредиентов
  const items = pageModel.getBunFillingsLocator();
  expect(items).toHaveCount(3);
  await expect(items.nth(0)).toContainText(ingredientName1);
  await expect(items.nth(1)).toContainText(ingredientName2);
  await expect(items.nth(2)).toContainText(ingredientName2);

  // В Firefox dragTo() не заработал для сортировки,
  // поэтому в Firefox проверять пересортировку в Firefox не будем
  if (!isFirefox) {
    // Переместим первый ингредиент в самый низ списка
    await pageModel.moveBunFilling(1, 3);

    // Проверим, что первый элемент переместился вниз списка
    await expect(items.nth(0)).toContainText(ingredientName2);
    await expect(items.nth(1)).toContainText(ingredientName2);
    await expect(items.nth(2)).toContainText(ingredientName1);
  }

  await pageModel.createOrder();

  if (page.url().endsWith('/login')) {
    pageModel.login('autotest.xcv@c-loud.ru', '123456789');
  }

  // Проверка создания заказа и демонстрации созданного заказа в 
  // модальном окне
  await pageModel.checkOrderCreatedWindow(expectedOrderNumber);
});
