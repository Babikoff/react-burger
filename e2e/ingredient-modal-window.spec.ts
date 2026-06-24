import { test } from '@playwright/test';

import { HomePageObjectModel } from './pom-classes/home-page-object-model';

const ingredientName = 'Соус с шипами Антарианского плоскоходца';

test('Test ingredient modal window', async ({ page }) => {
  // Arrange:
  await page.routeFromHAR('./e2e/hars/ingredients.default.har', {
    url: '**/api/ingredients',
    update: false,
  });

  // Act
  const pageModel = new HomePageObjectModel(page);
  await pageModel.goto();

  // Проверим, как работает перемещение по вкладкам типов ингредиентов
  await pageModel.navigateToIngredientType('Соусы');
  await pageModel.checkIngredientVisibility(ingredientName);

  // Проверим, что модальное окно ингредиента откроется по клику на ингредиенте
  await pageModel.openIngredientDetails(ingredientName, 'click');
  await pageModel.checkIngredientDetailsWindow(ingredientName);

  // Проверим, что модальное окно ингредиента откроется по нажатию Enter
  await pageModel.openIngredientDetails(ingredientName, 'pressEnter');
  await pageModel.checkIngredientDetailsWindow(ingredientName);
});
