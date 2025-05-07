import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { testConfig } from '../config/test.config';

export class LoginPage extends BasePage {
    // Selectors
    private emailInput = '[data-testid="email-input"]';
    private passwordInput = '[data-testid="password-input"]';
    private loginButton = '[data-testid="login-button"]';
    private errorMessage = '[data-testid="error-message"]';

    constructor(page: Page) {
        super(page);
    }

    async login(email: string = testConfig.testData.validUser.email,
        password: string = testConfig.testData.validUser.password) {
        await this.type(this.emailInput, email);
        await this.type(this.passwordInput, password);
        await this.click(this.loginButton);
        await this.waitForNavigation();
    }

    async getErrorMessage(): Promise<string> {
        return await this.getText(this.errorMessage);
    }

    async isLoginPage(): Promise<boolean> {
        return await this.isVisible(this.emailInput);
    }
} 