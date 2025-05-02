import { BaseApi } from './baseApi';
import { APIResponse } from '@playwright/test';

export interface Book {
    id?: number;
    name: string;
    author: string;
    published_year: number;
    book_summary: string;
}

export interface UserCredentials {
    email: string;
    password: string;
}

export class BookApi extends BaseApi {
    private token: string | null = null;

    async login(email: string, password: string): Promise<APIResponse> {
        const credentials: UserCredentials = { email, password };
        const response = await this.request.post('/login', {
            data: credentials,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status() === 200) {
            const data = await response.json();
            this.token = data.access_token;
            if (!this.token) {
                throw new Error('No access token received');
            }
        }
        return response;
    }

    private getHeaders() {
        if (!this.token) {
            throw new Error('Not authenticated. Please login first.');
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    async createBook(book: Book): Promise<APIResponse> {
        return this.request.post('/books/', {
            data: book,
            headers: this.getHeaders()
        });
    }

    async getBook(id: number): Promise<APIResponse> {
        return this.request.get(`/books/${id}`, {
            headers: this.getHeaders()
        });
    }

    async updateBook(id: number, book: Partial<Book>): Promise<APIResponse> {
        return this.request.put(`/books/${id}`, {
            data: book,
            headers: this.getHeaders()
        });
    }

    async deleteBook(id: number): Promise<APIResponse> {
        return this.request.delete(`/books/${id}`, {
            headers: this.getHeaders()
        });
    }

    async getAllBooks(): Promise<APIResponse> {
        return this.request.get('/books/', {
            headers: this.getHeaders()
        });
    }
} 