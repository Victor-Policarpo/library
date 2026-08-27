import db from "../config.js";

export async function createUserDatabase(name, email, password) {
    if (!name || !email || !password) {
        throw new Error("Name, email, and password are required");
    }
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password]
    );
    return { id: result.insertId, name, email };
}

export const getUsersDatabase = async () => {
    const [rows] = await db.execute(
        "SELECT id, name, email FROM users"
    );

    return rows;
};

export const getUserByIdDatabase = async (id) => {
    if (!id) {
        throw new Error("ID is required");
    }
    const [rows] = await db.execute(
        "SELECT id, name, email FROM users WHERE id = ?",
        [id]
    );

    return rows[0];
};

export const updateUserDatabase = async (id, name, email) => {
    if (!id || !name || !email) {
        throw new Error("ID, name, and email are required");
    }
    const [result] = await db.execute(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [name, email, id]
    );

    return result;
};

export const deleteUserDatabase = async (id) => {
    if (!id) {
        throw new Error("ID is required");
    }
    const [result] = await db.execute(
        "DELETE FROM users WHERE id = ?",
        [id]
    );

    return result;
};