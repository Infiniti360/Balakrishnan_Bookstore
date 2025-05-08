const LoginPage = require('../pageObjects/LoginPage');
const BookPage = require('../pageObjects/BookPage');

describe('Book functionality', () => {
    before(async () => {
        // Login before running book tests
        await LoginPage.open();
        await LoginPage.login('admin@bookstore.com', 'admin123');
        
        // Wait for redirection to books page
        await BookPage.isOnPage();
    });
    
    it('should display books page after login', async () => {
        const isOnPage = await BookPage.isOnPage();
        expect(isOnPage).toBe(true);
    });
    
    it('should add a new book', async () => {
        const newBook = {
            name: 'Test Book',
            author: 'Test Author',
            published_year: 2023,
            book_summary: 'This is a test book created for WebDriver testing.'
        };
        
        await BookPage.addBook(newBook);
        
        // Check if book was added
        const bookExists = await BookPage.bookExists(newBook.name);
        expect(bookExists).toBe(true);
        
        // Check success message
        const successMessage = await BookPage.getSuccessMessage();
        expect(successMessage).toContain('added successfully');
    });
    
    it('should edit an existing book', async () => {
        const updatedData = {
            name: 'Updated Test Book',
            author: 'Updated Author',
            published_year: 2024,
            book_summary: 'This book has been updated through WebDriver testing.'
        };
        
        await BookPage.editBook('Test Book', updatedData);
        
        // Check if book was updated
        const bookExists = await BookPage.bookExists(updatedData.name);
        expect(bookExists).toBe(true);
        
        // Check success message
        const successMessage = await BookPage.getSuccessMessage();
        expect(successMessage).toContain('updated successfully');
    });
    
    it('should delete a book', async () => {
        await BookPage.deleteBook('Updated Test Book');
        
        // Check if book was deleted
        const bookExists = await BookPage.bookExists('Updated Test Book');
        expect(bookExists).toBe(false);
        
        // Check success message
        const successMessage = await BookPage.getSuccessMessage();
        expect(successMessage).toContain('deleted successfully');
    });
}); 