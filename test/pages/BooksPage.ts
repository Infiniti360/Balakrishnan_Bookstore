import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { testConfig } from '../config/test.config';

export class BooksPage extends BasePage {
    // Selectors
    private addBookButton = '[data-testid="add-book-button"]';
    private bookList = '[data-testid="book-list"]';
    private bookItem = '[data-testid="book-item"]';
    private bookNameInput = '[data-testid="book-name-input"]';
    private bookAuthorInput = '[data-testid="book-author-input"]';
    private bookYearInput = '[data-testid="book-year-input"]';
    private bookSummaryInput = '[data-testid="book-summary-input"]';
    private saveBookButton = '[data-testid="save-book-button"]';
    private editBookButton = '[data-testid="edit-book-button"]';
    private deleteBookButton = '[data-testid="delete-book-button"]';
    private confirmDeleteButton = '[data-testid="confirm-delete-button"]';
    private logoutButton = '[data-testid="logout-button"]';

    constructor(page: Page) {
        super(page);
    }

    async addNewBook(book = testConfig.testData.newBook) {
        await this.click(this.addBookButton);
        await this.type(this.bookNameInput, book.name);
        await this.type(this.bookAuthorInput, book.author);
        await this.type(this.bookYearInput, book.published_year.toString());
        await this.type(this.bookSummaryInput, book.book_summary);
        await this.click(this.saveBookButton);
        await this.waitForNavigation();
    }

    async editBook(bookId: number, updatedBook: Partial<typeof testConfig.testData.newBook>) {
        const bookSelector = `${this.bookItem}[data-id="${bookId}"]`;
        await this.click(`${bookSelector} ${this.editBookButton}`);

        if (updatedBook.name) await this.type(this.bookNameInput, updatedBook.name);
        if (updatedBook.author) await this.type(this.bookAuthorInput, updatedBook.author);
        if (updatedBook.published_year) await this.type(this.bookYearInput, updatedBook.published_year.toString());
        if (updatedBook.book_summary) await this.type(this.bookSummaryInput, updatedBook.book_summary);

        await this.click(this.saveBookButton);
        await this.waitForNavigation();
    }

    async deleteBook(bookId: number) {
        const bookSelector = `${this.bookItem}[data-id="${bookId}"]`;
        await this.click(`${bookSelector} ${this.deleteBookButton}`);
        await this.click(this.confirmDeleteButton);
        await this.waitForNavigation();
    }

    async getBookDetails(bookId: number) {
        const bookSelector = `${this.bookItem}[data-id="${bookId}"]`;
        return {
            name: await this.getText(`${bookSelector} [data-testid="book-name"]`),
            author: await this.getText(`${bookSelector} [data-testid="book-author"]`),
            year: await this.getText(`${bookSelector} [data-testid="book-year"]`),
            summary: await this.getText(`${bookSelector} [data-testid="book-summary"]`)
        };
    }

    async logout() {
        await this.click(this.logoutButton);
        await this.waitForNavigation();
    }

    async isBooksPage(): Promise<boolean> {
        return await this.isVisible(this.bookList);
    }
} 