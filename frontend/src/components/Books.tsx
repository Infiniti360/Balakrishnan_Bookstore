import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    price: number;
    cover_image: string;
}

const Books: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/books`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBooks(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch books');
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Books</h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="bg-white overflow-hidden shadow-sm rounded-lg"
                        >
                            <div className="aspect-w-3 aspect-h-4">
                                <img
                                    src={book.cover_image || 'https://via.placeholder.com/300x400'}
                                    alt={book.title}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    {book.title}
                                </h2>
                                <p className="text-gray-600 mb-2">by {book.author}</p>
                                <p className="text-gray-500 mb-4 line-clamp-3">
                                    {book.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-gray-900">
                                        ${book.price.toFixed(2)}
                                    </span>
                                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Books; 