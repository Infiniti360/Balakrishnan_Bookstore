import { Page } from '@playwright/test';
import { testConfig } from '../config/test.config';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForElement(selector: string, timeout = testConfig.timeout) {
        await this.page.waitForSelector(selector, { timeout });
    }

    async click(selector: string) {
        await this.waitForElement(selector);
        await this.page.click(selector);
    }

    async type(selector: string, text: string) {
        await this.waitForElement(selector);
        await this.page.fill(selector, text);
    }

    async getText(selector: string): Promise<string> {
        await this.waitForElement(selector);
        return await this.page.textContent(selector) || '';
    }

    async isVisible(selector: string): Promise<boolean> {
        try {
            await this.waitForElement(selector, 5000);
            return true;
        } catch {
            return false;
        }
    }

    async waitForNavigation() {
        await this.page.waitForNavigation();
    }
} 