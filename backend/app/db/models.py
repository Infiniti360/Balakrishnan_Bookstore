from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Table, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

# Association table for many-to-many relationship between books and categories
book_category = Table(
    'book_category',
    Base.metadata,
    Column('book_id', Integer, ForeignKey('books.id')),
    Column('category_id', Integer, ForeignKey('categories.id'))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    orders = relationship("Order", back_populates="user")

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)
    stock = Column(Integer, default=0)
    isbn = Column(String, unique=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    categories = relationship("Category", secondary=book_category, back_populates="books")
    order_items = relationship("OrderItem", back_populates="book")
    category = relationship("Category", back_populates="books")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    books = relationship("Book", secondary=book_category, back_populates="categories")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    total_price = Column(Float)
    status = Column(String)  # pending, completed, cancelled
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    book_id = Column(Integer, ForeignKey("books.id"))
    quantity = Column(Integer)
    price_at_purchase = Column(Float)
    order = relationship("Order", back_populates="items")
    book = relationship("Book", back_populates="order_items") 