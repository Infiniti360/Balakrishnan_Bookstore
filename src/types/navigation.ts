export type RootStackParamList = {
    Login: undefined;
    BookList: undefined;
    BookDetail: { bookId: string };
    AddBook: { bookId?: string };
}; 