import { testConfig } from './config/test.config';
import { browser, $, expect } from '@wdio/globals';
import { describe, it, beforeEach } from 'mocha';

describe('Mobile App Tests', () => {
    beforeEach(async () => {
        // Wait for the app to load
        await browser.waitUntil(
            async () => {
                try {
                    const loginScreen = await $('~loginScreen');
                    return await loginScreen.isDisplayed();
                } catch (e) {
                    return false;
                }
            },
            {
                timeout: 10000,
                timeoutMsg: 'Login screen did not appear after 10s',
                interval: 1000
            }
        );
    });

    it('should login with valid credentials', async () => {
        // Find and fill email field
        const emailInput = await $('~email-input');
        await emailInput.waitForDisplayed({ timeout: 5000 });
        await emailInput.setValue('test@example.com');

        // Find and fill password field
        const passwordInput = await $('~password-input');
        await passwordInput.waitForDisplayed({ timeout: 5000 });
        await passwordInput.setValue('password123');

        // Find and click login button
        const loginButton = await $('~login-button');
        await loginButton.waitForDisplayed({ timeout: 5000 });
        await loginButton.click();

        // Wait for book list to appear
        const bookList = await $('~bookList');
        await bookList.waitForDisplayed({ timeout: 5000 });
        await expect(bookList).toBeDisplayed();
    });

    it('should show error with invalid credentials', async () => {
        // Wait for the app to load
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Find and fill email field
        const emailInput = await $('~email-input');
        await emailInput.setValue('invalid');

        // Find and fill password field
        const passwordInput = await $('~password-input');
        await passwordInput.setValue('invalid');

        // Find and click login button
        const loginButton = await $('~login-button');
        await loginButton.click();

        // Wait for error message
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verify error message is displayed
        const errorMessage = await $('~errorText');
        await expect(errorMessage).toBeDisplayed();
    });

    it('should add a new book', async () => {
        // Login first
        await new Promise(resolve => setTimeout(resolve, 5000));
        const emailInput = await $(testConfig.testIDs.emailInput);
        await emailInput.setValue(testConfig.testData.validUser.email);
        const passwordInput = await $(testConfig.testIDs.passwordInput);
        await passwordInput.setValue(testConfig.testData.validUser.password);
        const loginButton = await $(testConfig.testIDs.loginButton);
        await loginButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Click add book button
        const addBookButton = await $(testConfig.testIDs.addBookButton);
        await addBookButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Fill in book details
        const titleInput = await $(testConfig.testIDs.titleInput);
        await titleInput.setValue(testConfig.testData.newBook.name);
        const authorInput = await $(testConfig.testIDs.authorInput);
        await authorInput.setValue(testConfig.testData.newBook.author);
        const yearInput = await $(testConfig.testIDs.yearInput);
        await yearInput.setValue(testConfig.testData.newBook.published_year.toString());
        const summaryInput = await $(testConfig.testIDs.summaryInput);
        await summaryInput.setValue(testConfig.testData.newBook.book_summary);

        // Save the book
        const saveButton = await $(testConfig.testIDs.saveButton);
        await saveButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verify book was added
        const bookList = await $(testConfig.testIDs.bookList);
        await expect(bookList).toHaveTextContaining(testConfig.testData.newBook.name);
    });

    it('should edit an existing book', async () => {
        // Login first
        await new Promise(resolve => setTimeout(resolve, 5000));
        const emailInput = await $(testConfig.testIDs.emailInput);
        await emailInput.setValue(testConfig.testData.validUser.email);
        const passwordInput = await $(testConfig.testIDs.passwordInput);
        await passwordInput.setValue(testConfig.testData.validUser.password);
        const loginButton = await $(testConfig.testIDs.loginButton);
        await loginButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Find and click the first book
        const firstBook = await $(testConfig.testIDs.bookItem);
        await firstBook.click();
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Edit book details
        const titleInput = await $(testConfig.testIDs.titleInput);
        await titleInput.setValue('Updated Title');
        const saveButton = await $(testConfig.testIDs.saveButton);
        await saveButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verify book was updated
        const bookList = await $(testConfig.testIDs.bookList);
        await expect(bookList).toHaveTextContaining('Updated Title');
    });

    it('should delete a book', async () => {
        // Login first
        await new Promise(resolve => setTimeout(resolve, 5000));
        const emailInput = await $(testConfig.testIDs.emailInput);
        await emailInput.setValue(testConfig.testData.validUser.email);
        const passwordInput = await $(testConfig.testIDs.passwordInput);
        await passwordInput.setValue(testConfig.testData.validUser.password);
        const loginButton = await $(testConfig.testIDs.loginButton);
        await loginButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Find and click the first book
        const firstBook = await $(testConfig.testIDs.bookItem);
        await firstBook.click();
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Click delete button
        const deleteButton = await $(testConfig.testIDs.deleteButton);
        await deleteButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Confirm deletion
        const confirmButton = await $(testConfig.testIDs.confirmButton);
        await confirmButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verify book was deleted
        const bookList = await $(testConfig.testIDs.bookList);
        await expect(bookList).not.toHaveTextContaining('Updated Title');
    });

    it('should logout successfully', async () => {
        // Login first
        await new Promise(resolve => setTimeout(resolve, 5000));
        const emailInput = await $(testConfig.testIDs.emailInput);
        await emailInput.setValue(testConfig.testData.validUser.email);
        const passwordInput = await $(testConfig.testIDs.passwordInput);
        await passwordInput.setValue(testConfig.testData.validUser.password);
        const loginButton = await $(testConfig.testIDs.loginButton);
        await loginButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Click logout button
        const logoutButton = await $(testConfig.testIDs.logoutButton);
        await logoutButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verify we're back at the login screen
        const loginScreen = await $(testConfig.testIDs.loginScreen);
        await expect(loginScreen).toBeDisplayed();
    });
}); 