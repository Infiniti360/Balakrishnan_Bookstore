describe('Book App E2E Tests', () => {
  before(async () => {
    await browser.url('http://localhost:19006');
  });

  it('should display the book list', async () => {
    const bookList = await $('~book-list');
    await expect(bookList).toBeDisplayed();
  });

  it('should add a new book', async () => {
    const addButton = await $('~add-book-button');
    await addButton.click();

    const nameInput = await $('~book-name-input');
    const authorInput = await $('~book-author-input');
    const yearInput = await $('~book-year-input');
    const summaryInput = await $('~book-summary-input');
    const submitButton = await $('~submit-book-button');

    await nameInput.setValue('Test Book');
    await authorInput.setValue('Test Author');
    await yearInput.setValue('2024');
    await summaryInput.setValue('This is a test book summary');

    await submitButton.click();

    // Verify the book was added
    const bookTitle = await $('~book-title-Test Book');
    await expect(bookTitle).toBeDisplayed();
  });

  it('should view book details', async () => {
    const bookItem = await $('~book-item-Test Book');
    await bookItem.click();

    const bookTitle = await $('~book-detail-title');
    await expect(bookTitle).toHaveText('Test Book');

    const bookAuthor = await $('~book-detail-author');
    await expect(bookAuthor).toHaveText('by Test Author');
  });

  it('should delete a book', async () => {
    const deleteButton = await $('~delete-book-button');
    await deleteButton.click();

    // Verify the book was deleted
    const bookTitle = await $('~book-title-Test Book');
    await expect(bookTitle).not.toBeDisplayed();
  });
}); 