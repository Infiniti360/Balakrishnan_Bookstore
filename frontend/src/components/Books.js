import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/books');
                setBooks(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch books');
                console.error('Error fetching books:', error);
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigation.navigate('Login');
    };

    const renderBookItem = ({ item }) => (
        <View style={styles.bookCard}>
            {item.cover_image && (
                <Image
                    source={{ uri: item.cover_image }}
                    style={styles.coverImage}
                    resizeMode="cover"
                />
            )}
            <View style={styles.bookInfo}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.author}>By {item.author}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6366F1" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Bookstore</Text>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={books}
                        renderItem={renderBookItem}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.booksList}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No books available.</Text>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    logoutButton: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    logoutText: {
        color: 'white',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    booksList: {
        paddingBottom: 16,
    },
    bookCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    coverImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    bookInfo: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#1F2937',
    },
    author: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 8,
        lineHeight: 20,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6366F1',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        backgroundColor: '#FEE2E2',
        borderWidth: 1,
        borderColor: '#EF4444',
        borderRadius: 6,
        padding: 12,
        marginBottom: 16,
    },
    errorText: {
        color: '#B91C1C',
    },
    emptyText: {
        textAlign: 'center',
        color: '#6B7280',
        marginTop: 24,
    },
});

export default Books;