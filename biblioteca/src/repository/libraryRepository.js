import db from "../config.js";

export async function createLibraryDatabase(name, address){
    if (!name || !address) {
        throw new Error("Name and address are required");
    }
    const [result] = await db.execute("INSERT INTO libraries (name, address) VALUES (?, ?)", [name, address]);
    return { id: result.insertId, name, address };
}

export async function getAllLibrariesDatabase(){
    const [rows] = await db.execute("SELECT * FROM libraries");
    return rows;
}

export async function getLibraryByIdDatabase(id){
    if (!id) {
        throw new Error("ID is required");
    }
    const [rows] = await db.execute("SELECT * FROM libraries WHERE id = ?", [id]);
    return rows[0];
}

export async function updateLibraryDatabase(id, name, address){
    if (!id) {
        throw new Error("ID is required");
    }
    if (!name || !address) {
        throw new Error("Name and address are required");
    }
    const [result] = await db.execute("UPDATE libraries SET name = ?, address = ? WHERE id = ?", [name, address, id]);
    return result; 
}

export async function deleteLibraryDatabase(id){
    if (!id) {
        throw new Error("ID is required");
    }
    const [result] = await db.execute("DELETE FROM libraries WHERE id = ?", [id]);
    return result;
}