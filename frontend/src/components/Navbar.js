import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/auth.service';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = AuthService.getCurrentUser();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${
            scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            <svg className={`h-8 w-8 transition-colors duration-200 ${
                                scrolled ? 'text-purple-600' : 'text-white'
                            } group-hover:text-purple-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className={`ml-2 text-xl font-bold transition-colors duration-200 ${
                                scrolled ? 'text-gray-900' : 'text-white'
                            } group-hover:text-purple-500`}>
                                Bookstore
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center space-x-4">
                            <Link 
                                to="/books" 
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    isActive('/books')
                                        ? 'bg-purple-600 text-white'
                                        : scrolled
                                            ? 'text-gray-900 hover:text-purple-600'
                                            : 'text-white hover:bg-white/10'
                                }`}
                            >
                                Books
                            </Link>
                            {currentUser ? (
                                <div className="flex items-center space-x-4">
                                    <span className={`px-3 py-2 text-sm font-medium ${
                                        scrolled ? 'text-gray-900' : 'text-white'
                                    }`}>
                                        Welcome, {currentUser.username}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to="/login"
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                            isActive('/login')
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-white text-purple-600 hover:bg-purple-50'
                                        }`}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                            isActive('/register')
                                                ? 'bg-purple-700 text-white'
                                                : 'bg-purple-600 text-white hover:bg-purple-700'
                                        }`}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-200 ${
                                scrolled
                                    ? 'text-gray-900 hover:text-purple-600'
                                    : 'text-white hover:bg-white/10'
                            }`}
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden absolute w-full bg-white shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link
                            to="/books"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                isActive('/books')
                                    ? 'bg-purple-600 text-white'
                                    : 'text-gray-900 hover:bg-purple-50'
                            }`}
                            onClick={() => setIsOpen(false)}
                        >
                            Books
                        </Link>
                        {currentUser ? (
                            <>
                                <span className="block px-3 py-2 text-base font-medium text-gray-900">
                                    Welcome, {currentUser.username}
                                </span>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        isActive('/login')
                                            ? 'bg-purple-600 text-white'
                                            : 'text-gray-900 hover:bg-purple-50'
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        isActive('/register')
                                            ? 'bg-purple-600 text-white'
                                            : 'text-gray-900 hover:bg-purple-50'
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar; 