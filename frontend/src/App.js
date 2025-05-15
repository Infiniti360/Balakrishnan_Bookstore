import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Books from './components/Books';
import AuthService from './services/auth.service';

const PrivateRoute = ({ children }) => {
    const token = AuthService.getToken();
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/books"
                        element={
                            <PrivateRoute>
                                <Books />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/books" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App; 