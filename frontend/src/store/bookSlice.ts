import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    price: number;
    stock: number;
}

interface BookState {
    books: Book[];
    selectedBook: Book | null;
    loading: boolean;
    error: string | null;
}

const initialState: BookState = {
    books: [],
    selectedBook: null,
    loading: false,
    error: null,
};

export const fetchBooks = createAsyncThunk(
    'books/fetchBooks',
    async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/books`);
        return response.data;
    }
);

export const fetchBookById = createAsyncThunk(
    'books/fetchBookById',
    async (id: number) => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/books/${id}`);
        return response.data;
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
            .addCase(fetchBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.books = action.payload;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch books';
            })
            .addCase(fetchBookById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedBook = action.payload;
            })
            .addCase(fetchBookById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch book';
            });
    },
});

export const { clearSelectedBook } = bookSlice.actions;
export default bookSlice.reducer; 