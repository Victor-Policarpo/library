import { createBookDatabase, getAllBooksDatabase, getBookByIdDatabase, getBooksByLibraryIdDatabase, updateBookDatabase, deleteBookDatabase } from "../repository/bookRepository.js";

export const createBook = async (req, res) => {
    try {
        const { title, author, publication_year, library_id } = req.body;
        if (!title || !author || !library_id) {
            return res.status(400).json({ 
                message: "Title, author, and library_id are required" 
            });
        }
        const newBook = await createBookDatabase(title, author, publication_year, library_id);
        if (!newBook) {
            return res.status(400).json({ message: "Book not created" });
        }
        return res.status(201).json(newBook);
    } catch (error) {
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(404).json({ message: "Referenced library_id does not exist" });
        }
        return res.status(500).json({
            message: "Error creating book",
            error: error.message
        });
    }
};

export const getAllBooks = async (req, res) => {
    try {
        const books = await getAllBooksDatabase();
        return res.status(200).json(books || []);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching books",
            error: error.message
        });
    }
};

export const getBookById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Book ID is required" });
        }
        const book = await getBookByIdDatabase(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching book",
            error: error.message
        });
    }
};

export const getBooksByLibrary = async (req, res) => {
    try {
        if (!req.params.libraryId) {
            return res.status(400).json({ message: "Library ID is required" });
        }
        const books = await getBooksByLibraryIdDatabase(req.params.libraryId);
        return res.status(200).json(books || []);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching books for library",
            error: error.message
        });
    }
};

export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        const { title, author, publication_year, library_id } = req.body;
        if (!title || !author || !library_id) {
            return res.status(400).json({ 
                message: "Title, author, and library_id are required" 
            });
        }

        const result = await updateBookDatabase(id, title, author, publication_year, library_id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json({ id, title, author, publication_year, library_id });
    } catch (error) {
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(404).json({ message: "Referenced library_id does not exist" });
        }
        return res.status(500).json({
            message: "Error updating book",
            error: error.message
        });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Book ID is required" });
        }
        const result = await deleteBookDatabase(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting book",
            error: error.message
        });
    }
};