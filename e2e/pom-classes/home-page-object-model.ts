import { expect, type Locator, type Page } from '@playwright/test';

export class HomePageObjectModel {
  readonly page: Page;
  readonly constructorDropTarget: Locator;
  readonly list: Locator;
  constructor(page: Page) {
    this.page = page;
    this.constructorDropTarget = this.page.getByTestId('burger-constructor');
    this.list = page.getByTestId('constructor-ingredients-list');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToIngredientType(ingredientType: string): Promise<void> {
    await this.page.locator('span').filter({ hasText: ingredientType }).click();
  }

  async addBun(bunName: string): Promise<void> {
    const bun = await this.page.getByRole('link', { name: bunName });
    await bun.dragTo(this.constructorDropTarget);
  }

  async addBunFilling(ingredientName: string): Promise<void> {
    const bun = await this.page.getByRole('link', { name: ingredientName });
    await bun.dragTo(this.constructorDropTarget);
  }

  getBunFillingsLocator(): Locator {
    return this.list.locator('li');
  }

  async moveBunFilling(from: number, to: number): Promise<void> {
    const ingredientToMove = this.page.getByTestId(`constructor-item-${from}`);
    const ingredientToMoveTo = this.page.getByTestId(`constructor-item-${to}`);

    await ingredientToMove.dragTo(ingredientToMoveTo, {
      force: true,
      sourcePosition: { x: 50, y: 0 },
      targetPosition: { x: 50, y: 50 },
      steps: 100,
    });
  }

  async createOrder(): Promise<void> {
    await this.page.getByText('Оформить заказ').click();
  }

  async login(email: string, password: string): Promise<void> {
    await expect(this.page.locator('#email')).toBeVisible();
    await this.page.locator('#email').click();
    await this.page.locator('#email').fill(email);
    await this.page.locator('#password').click();
    await this.page.locator('#password').fill(password);
    await this.page.getByRole('button', { name: 'Войти' }).click();
    await this.page.getByText('Оформить заказ').click();
  }

  async checkOrderCreatedWindow(orderNumber: string): Promise<void> {
    // Проверим, что модальное окно открылось
    await expect(this.page.getByText('идентификатор заказа')).toBeVisible();
    await expect(this.page.locator('#modal')).toContainText('идентификатор заказа');

    await expect(
      this.page.locator('#modal').getByRole('heading', { level: 1, name: orderNumber })
    ).toBeVisible();

    await this.page.locator('body').press('Escape');

    // Проверим, что модальное окно закрылось
    await expect(this.page.getByText('идентификатор заказа')).not.toBeVisible();
  }
}
