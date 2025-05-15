import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookApi } from '../../services/api';

interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    price: number;
    stock: number;
    isbn: string;
    categories: Array<{ id: number; name: string }>;
}

interface BookState {
    books: Book[];
    selectedBook: Book | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: BookState = {
    books: [],
    selectedBook: null,
    isLoading: false,
    error: null,
};

export const fetchBooks = createAsyncThunk(
    'books/fetchBooks',
    async (params?: { category?: string; search?: string }) => {
        const response = await bookApi.getBooks(params);
        return response;
    }
);

export const fetchBookById = createAsyncThunk(
    'books/fetchBookById',
    async (id: number) => {
        const response = await bookApi.getBook(id);
        return response;
    }
);

export const createBook = createAsyncThunk(
    'books/createBook',
    async (bookData: Omit<Book, 'id'>) => {
        const response = await bookApi.createBook(bookData);
        return response;
    }
);

export const updateBook = createAsyncThunk(
    'books/updateBook',
    async ({ id, bookData }: { id: number; bookData: Partial<Book> }) => {
        const response = await bookApi.updateBook(id, bookData);
        return response;
    }
);

export const deleteBook = createAsyncThunk(
    'books/deleteBook',
    async (id: number) => {
        await bookApi.deleteBook(id);
        return id;
    }
);

const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        clearSelectedBook: (state) => {
            state.selectedBook = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch books
            .addCase(fetchBooks.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.books = action.payload;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch books';
            })
            // Fetch book by ID
            .addCase(fetchBookById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchBookById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedBook = action.payload;
            })
            .addCase(fetchBookById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch book';
            })
            // Create book
            .addCase(createBook.fulfilled, (state, action) => {
                state.books.push(action.payload);
            })
            // Update book
            .addCase(updateBook.fulfilled, (state, action) => {
                const index = state.books.findIndex((book) => book.id === action.payload.id);
                if (index !== -1) {
                    state.books[index] = action.payload;
                }
                if (state.selectedBook?.id === action.payload.id) {
                    state.selectedBook = action.payload;
                }
            })
            // Delete book
            .addCase(deleteBook.fulfilled, (state, action) => {
                state.books = state.books.filter((book) => book.id !== action.payload);
                if (state.selectedBook?.id === action.payload) {
                    state.selectedBook = null;
                }
            });
    },
});

export const { clearSelectedBook } = bookSlice.actions;
export default bookSlice.reducer; 