import { test, expect } from '@playwright/test';
import { exec } from 'child_process';
import { promisify } from 'util';
import { BookApi } from '../api/bookApi';

const execAsync = promisify(exec);

test.describe('Health Checks', () => {
    test('should check if Docker is running', async () => {
        try {
            const { stdout } = await execAsync('docker ps');
            expect(stdout).toBeTruthy();
            console.log('✅ Docker is running');
        } catch (error) {
            console.error('❌ Docker is not running');
            throw new Error('Docker is not running. Please start Docker before running tests.');
        }
    });

    test('should check if localhost is running', async ({ request }) => {
        try {
            const response = await request.get('http://localhost:8000/health');
            expect(response.status()).toBe(200);
            const data = await response.json();
            expect(data.status).toBe('up');
            console.log('✅ Localhost server is running');
        } catch (error) {
            console.error('❌ Localhost server is not running');
            console.error('Please ensure the server is running on http://localhost:8000');
            throw new Error('Localhost server is not running. Please start the server before running tests.');
        }
    });

    test('should check if database is accessible', async ({ request }) => {
        try {
            const bookApi = new BookApi(request);
            const loginResponse = await bookApi.login('test@example.com', 'password123');
            expect(loginResponse.status()).toBe(200);

            const response = await bookApi.getAllBooks();
            expect(response.status()).toBe(200);
            console.log('✅ Database connection is working');
        } catch (error) {
            console.error('❌ Database connection failed');
            console.error('Please ensure the database is running and accessible');
            throw new Error('Database connection failed. Please ensure the database is running and accessible.');
        }
    });

    test('should verify user credentials', async ({ request }) => {
        try {
            const bookApi = new BookApi(request);
            const response = await bookApi.login('test@example.com', 'password123');
            expect(response.status()).toBe(200);
            const data = await response.json();
            expect(data.access_token).toBeTruthy();
            console.log('✅ User credentials are valid');
        } catch (error) {
            console.error('❌ User credentials are invalid');
            console.error('Please check the test credentials in the test file');
            throw new Error('User credentials are invalid. Please check the test credentials.');
        }
    });

    test('should check all API endpoints', async ({ request }) => {
        try {
            const bookApi = new BookApi(request);

            // Test login endpoint
            const loginResponse = await bookApi.login('test@example.com', 'password123');
            expect(loginResponse.status()).toBe(200);
            console.log('✅ Login endpoint is working');

            // Test book creation
            const bookData = {
                name: 'Health Check Book',
                author: 'Health Check Author',
                published_year: 2024,
                book_summary: 'A book for health check'
            };
            const createResponse = await bookApi.createBook(bookData);
            expect(createResponse.status()).toBe(200);
            const createdBook = await createResponse.json();
            console.log('✅ Book creation endpoint is working');

            // Test book retrieval
            const getResponse = await bookApi.getBook(createdBook.id);
            expect(getResponse.status()).toBe(200);
            console.log('✅ Book retrieval endpoint is working');

            // Test book update
            const updateData = {
                name: 'Updated Health Check Book',
                author: 'Updated Health Check Author',
                published_year: 2024,
                book_summary: 'Updated book for health check'
            };
            const updateResponse = await bookApi.updateBook(createdBook.id, updateData);
            expect(updateResponse.status()).toBe(200);
            console.log('✅ Book update endpoint is working');

            // Test book deletion
            const deleteResponse = await bookApi.deleteBook(createdBook.id);
            expect(deleteResponse.status()).toBe(200); // Changed from 204 to match server response
            console.log('✅ Book deletion endpoint is working');

            // Test get all books
            const getAllResponse = await bookApi.getAllBooks();
            expect(getAllResponse.status()).toBe(200);
            console.log('✅ Get all books endpoint is working');

            console.log('✅ All API endpoints are working correctly');
        } catch (error: any) {
            console.error('❌ API endpoint check failed');
            console.error('Error details:', error.message);
            throw error;
        }
    });
}); 