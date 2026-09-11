import bcrypt from "bcryptjs";
import { createUserDatabase, getUsersDatabase, getUserByIdDatabase, updateUserDatabase, deleteUserDatabase} from "../repository/userRepository.js";

export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                    message: "Name, email, and password are required"
            });
        }
        const hash = await bcrypt.hash(password, 10);
        const newUser = await createUserDatabase(name, email, hash);
        return res.status(201).json(newUser);

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await getUsersDatabase();
        return res.status(200).json(users);

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching users",
            error: error.message
        });
    }
};


export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserByIdDatabase(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching user",
            error: error.message
        });
    }
};


export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }
        const user = await getUserByIdDatabase(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await updateUserDatabase(id, name, email);
        return res.status(200).json({
            message: "User updated successfully"
        });

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                message: "Email already exists"
            });
        }
        return res.status(500).json({
            message: "Error updating user",
            error: error.message
        });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserByIdDatabase(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        await deleteUserDatabase(id);
        return res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error deleting user",
            error: error.message
        });
    }
};