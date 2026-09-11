import db from "../config.js";

export async function createBookDatabase(title, author, publication_year, library_id) {
    if (!title || !author || !library_id) {
        throw new Error("Title, author, and library_id are required");
    }
    const [result] = await db.execute(
        "INSERT INTO books (title, author, publication_year, library_id) VALUES (?, ?, ?, ?)",
        [title, author, publication_year || null, library_id]
    );
    return { id: result.insertId, title, author, publication_year, library_id };
}

export async function getAllBooksDatabase() {
    const [rows] = await db.execute(`
        SELECT b.id, b.title, b.author, b.publication_year, b.library_id, l.name AS library_name
        FROM books b
        INNER JOIN libraries l ON b.library_id = l.id
    `);
    return rows;
}

export async function getBookByIdDatabase(id) {
    if (!id) {
        throw new Error("ID is required");
    }
    const [rows] = await db.execute(`
        SELECT b.id, b.title, b.author, b.publication_year, b.library_id, l.name AS library_name
        FROM books b
        INNER JOIN libraries l ON b.library_id = l.id
        WHERE b.id = ?
    `, [id]);
    return rows[0] || null;
}

export async function getBooksByLibraryIdDatabase(libraryId) {
    if (!libraryId) {
        throw new Error("Library ID is required");
    }
    const [rows] = await db.execute("SELECT * FROM books WHERE library_id = ?", [libraryId]);
    return rows;
}

export async function updateBookDatabase(id, title, author, publication_year, library_id) {
    if (!id || !title || !author || !library_id) {
        throw new Error("ID, title, author, and library_id are required");
    }
    const [result] = await db.execute(
        "UPDATE books SET title = ?, author = ?, publication_year = ?, library_id = ? WHERE id = ?",
        [title, author, publication_year || null, library_id, id]
    );
    return result;
}

export async function deleteBookDatabase(id) {
    if (!id) {
        throw new Error("ID is required");
    }
    const [result] = await db.execute("DELETE FROM books WHERE id = ?", [id]);
    return result;
}