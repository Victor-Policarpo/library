import db from "../config.js";

export async function createLoanDatabase( userId, bookId, loanDate) {
    if (!userId || !bookId || !loanDate) {
        throw new Error("User ID, book ID and loan date are required");
    }
    const [result] = await db.execute(`INSERT INTO loans (user_id, book_id, loan_date) VALUES (?, ?, ?)`, [userId, bookId, loanDate]
    );
    return { id: result.insertId, userId, bookId, loanDate };
};

export async function getLoansDatabase() {
    const [rows] = await db.execute(`
        SELECT loans.id, loans.loan_date, loans.return_date, users.id AS user_id, users.name AS user_name, books.id AS book_id, books.title AS book_title
        FROM loans INNER JOIN users ON loans.user_id = users.id INNER JOIN books ON loans.book_id = books.id
    `);
    return rows;
};

export async function getLoanByIdDatabase(id) {
    if (!id) {
        throw new Error("ID is required");
    }
    const [rows] = await db.execute(`
        SELECT loans.id, loans.loan_date, loans.return_date, users.id AS user_id, users.name AS user_name, books.id AS book_id, books.title AS book_title
        FROM loans INNER JOIN users ON loans.user_id = users.id INNER JOIN books ON loans.book_id = books.id WHERE loans.id = ?
    `, [id]);
    return rows[0];
};

export async function updateLoanDatabase(id, returnDate) {
    if (!id || !returnDate) {
        throw new Error("ID and return date are required");
    }
    const [result] = await db.execute(`
        UPDATE loans SET return_date = ? WHERE id = ?`,
        [returnDate, id]
    );
    return result;
};

export async function deleteLoanDatabase(id) {
    if (!id) {
        throw new Error("ID is required");
    }
    const [result] = await db.execute(
        `DELETE FROM loans WHERE id = ?`,
        [id]);
    return result;
}