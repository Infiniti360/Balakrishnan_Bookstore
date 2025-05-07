import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { BooksPage } from './pages/BooksPage';
import { testConfig } from './config/test.config';

test.describe('Bookstore App Tests', () => {
    let loginPage: LoginPage;
    let booksPage: BooksPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        booksPage = new BooksPage(page);
        await page.goto(testConfig.baseURL);
    });

    test('should login successfully with valid credentials', async () => {
        await loginPage.login();
        expect(await booksPage.isBooksPage()).toBeTruthy();
    });

    test('should fail login with invalid credentials', async () => {
        await loginPage.login('invalid@email.com', 'wrongpassword');
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Invalid credentials');
    });

    test('should add a new book', async () => {
        await loginPage.login();
        const newBook = {
            name: 'Test Book ' + Date.now(),
            author: 'Test Author',
            published_year: 2024,
            book_summary: 'This is a test book summary'
        };
        await booksPage.addNewBook(newBook);
        // Verify the book was added (you'll need to implement this verification)
    });

    test('should edit an existing book', async () => {
        await loginPage.login();
        const bookId = 1; // You'll need to get this dynamically
        const updatedBook = {
            name: 'Updated Book Name',
            author: 'Updated Author'
        };
        await booksPage.editBook(bookId, updatedBook);
        const bookDetails = await booksPage.getBookDetails(bookId);
        expect(bookDetails.name).toBe(updatedBook.name);
        expect(bookDetails.author).toBe(updatedBook.author);
    });

    test('should delete a book', async () => {
        await loginPage.login();
        const bookId = 1; // You'll need to get this dynamically
        await booksPage.deleteBook(bookId);
        // Verify the book was deleted (you'll need to implement this verification)
    });

    test('should logout successfully', async () => {
        await loginPage.login();
        await booksPage.logout();
        expect(await loginPage.isLoginPage()).toBeTruthy();
    });
}); 