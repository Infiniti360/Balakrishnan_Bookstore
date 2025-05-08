class BookPage {
    // Page elements
    get addBookButton() { return $('.book-page-header .btn-primary'); }
    get bookCards() { return $$('.book-card'); }
    get bookTitles() { return $$('.book-title'); }
    get editButtons() { return $$('.btn-edit'); }
    get deleteButtons() { return $$('.btn-delete'); }
    get successMessage() { return $('.alert-success'); }
    get errorMessage() { return $('.alert-error'); }
    get deleteConfirmButton() { return $('.modal .btn-danger'); }
    get deleteCancelButton() { return $('.modal .btn-secondary'); }
    
    // Form elements
    get bookTitleInput() { return $('input[name="name"]'); }
    get authorInput() { return $('input[name="author"]'); }
    get yearInput() { return $('input[name="published_year"]'); }
    get summaryInput() { return $('textarea[name="book_summary"]'); }
    get submitButton() { return $('.form-actions .btn-primary'); }
    get cancelButton() { return $('.form-actions .btn-secondary'); }
    
    /**
     * Open books page
     */
    async open() {
        await browser.url('/books');
    }
    
    /**
     * Click on add book button
     */
    async clickAddBook() {
        await this.addBookButton.click();
    }
    
    /**
     * Add a new book
     * @param {Object} bookData Book data to add
     */
    async addBook(bookData) {
        await this.clickAddBook();
        await this.fillBookForm(bookData);
        await this.submitButton.click();
    }
    
    /**
     * Fill the book form
     * @param {Object} bookData 
     */
    async fillBookForm(bookData) {
        if (bookData.name) {
            await this.bookTitleInput.setValue(bookData.name);
        }
        if (bookData.author) {
            await this.authorInput.setValue(bookData.author);
        }
        if (bookData.published_year) {
            await this.yearInput.setValue(bookData.published_year.toString());
        }
        if (bookData.book_summary) {
            await this.summaryInput.setValue(bookData.book_summary);
        }
    }
    
    /**
     * Edit a book by title
     * @param {string} bookTitle 
     * @param {Object} newData 
     */
    async editBook(bookTitle, newData) {
        const index = await this.findBookIndex(bookTitle);
        if (index === -1) {
            throw new Error(`Book with title "${bookTitle}" not found`);
        }
        
        await this.editButtons[index].click();
        await this.fillBookForm(newData);
        await this.submitButton.click();
    }
    
    /**
     * Delete a book by title
     * @param {string} bookTitle 
     * @param {boolean} confirm Whether to confirm or cancel deletion
     */
    async deleteBook(bookTitle, confirm = true) {
        const index = await this.findBookIndex(bookTitle);
        if (index === -1) {
            throw new Error(`Book with title "${bookTitle}" not found`);
        }
        
        await this.deleteButtons[index].click();
        
        if (confirm) {
            await this.deleteConfirmButton.waitForDisplayed();
            await this.deleteConfirmButton.click();
        } else {
            await this.deleteCancelButton.waitForDisplayed();
            await this.deleteCancelButton.click();
        }
    }
    
    /**
     * Find the index of a book by title
     * @param {string} bookTitle 
     * @returns {number} Index of the book, or -1 if not found
     */
    async findBookIndex(bookTitle) {
        const titles = await Promise.all(
            await this.bookTitles.map(element => element.getText())
        );
        return titles.findIndex(title => title === bookTitle);
    }
    
    /**
     * Get all book titles
     * @returns {Array<string>} Array of book titles
     */
    async getBookTitles() {
        return Promise.all(
            await this.bookTitles.map(element => element.getText())
        );
    }
    
    /**
     * Check if a book exists by title
     * @param {string} bookTitle 
     * @returns {boolean}
     */
    async bookExists(bookTitle) {
        const index = await this.findBookIndex(bookTitle);
        return index !== -1;
    }
    
    /**
     * Get success message text if present
     */
    async getSuccessMessage() {
        try {
            await this.successMessage.waitForDisplayed({ timeout: 3000 });
            return await this.successMessage.getText();
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Get error message text if present
     */
    async getErrorMessage() {
        try {
            return await this.errorMessage.getText();
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Check if user is on books page
     */
    async isOnPage() {
        try {
            await this.addBookButton.waitForDisplayed({ timeout: 5000 });
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = new BookPage(); 