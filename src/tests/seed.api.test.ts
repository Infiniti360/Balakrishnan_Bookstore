import { Book, BookApi } from '../api/bookApi';
import { test } from '@playwright/test';

const initialBooks: Omit<Book, 'id'>[] = [
    {
        name: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        published_year: 1925,
        book_summary: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan."
    },
    {
        name: "To Kill a Mockingbird",
        author: "Harper Lee",
        published_year: 1960,
        book_summary: "The story of racial injustice and the loss of innocence in the American South."
    },
    {
        name: "1984",
        author: "George Orwell",
        published_year: 1949,
        book_summary: "A dystopian social science fiction novel and cautionary tale about totalitarianism."
    },
    {
        name: "Pride and Prejudice",
        author: "Jane Austen",
        published_year: 1813,
        book_summary: "A romantic novel of manners that follows the emotional development of Elizabeth Bennet."
    },
    {
        name: "The Hobbit",
        author: "J.R.R. Tolkien",
        published_year: 1937,
        book_summary: "The adventure of Bilbo Baggins, a hobbit who embarks on a quest to help a group of dwarves."
    }
];

test('seed database', async ({ request }) => {
    try {
        const bookApi = new BookApi(request);
        // Login first (using test credentials)
        const loginResponse = await bookApi.login('test@example.com', 'password123');
        if (loginResponse.status() !== 200) {
            throw new Error('Failed to login');
        }

        console.log('Seeding database with initial books...');
        for (const book of initialBooks) {
            const response = await bookApi.createBook(book);
            if (response.status() !== 200) {
                const errorText = await response.text();
                console.error(`Failed to create book ${book.name}:`, errorText);
                continue;
            }
            console.log(`Added book: ${book.name}`);
        }
        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}); 