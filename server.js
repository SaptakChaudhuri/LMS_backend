const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();  // Ensure this line is correctly used

const app = express();
const PORT = process.env.PORT || 3000;  // Use environment variable for port

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const bookSchema = new mongoose.Schema({
    name: String,
    author: String,
    isbn: String,
});

const Book = mongoose.model('Book', bookSchema);

// CRUD operations

// Create Book
app.post('/books', async (req, res) => {
    const book = new Book(req.body);
    try {
        await book.save();
        res.status(201).send(book);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Read all Books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find({});
        res.send(books);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a book by ID
app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { name, author, isbn } = req.body;

    try {
        const updatedBook = await Book.findByIdAndUpdate(id, { name, author, isbn }, { new: true });
        res.json(updatedBook);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).send();
        }
        res.send(book);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
