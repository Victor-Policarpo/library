import { createLibraryDatabase, getAllLibrariesDatabase, updateLibraryDatabase, deleteLibraryDatabase, getLibraryByIdDatabase } from "../repository/libraryRepository.js";

export const createLibrary = async (req, res) => {
    try {
        const { name, address } = req.body;
        if (!name || !address) {
            return res.status(400).json({ message: "Name and address are required" });
        }

        const library = await createLibraryDatabase(name, address);
        if (!library) {
            return res.status(400).json({ message: "Library not created" });
        }

        return res.status(201).json(library);
    } catch (error) {
        return res.status(500).json({
            message: "Error creating library",
            error: error.message
        });
    }
};

export const getAllLibraries = async (req, res) => {
    try {
        const libraries = await getAllLibrariesDatabase();
        return res.status(200).json(libraries || []);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching libraries",
            error: error.message
        });
    }
};

export const getLibraryById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Library ID is required" });
        }
        const library = await getLibraryByIdDatabase(req.params.id);
        
        if (!library) {
            return res.status(404).json({ message: "Library not found" });
        }
        
        return res.status(200).json(library);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching library",
            error: error.message
        });
    }
};

export const updateLibrary = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Library ID is required" });
        }
        const { name, address } = req.body;
        if (!name || !address) {
            return res.status(400).json({ message: "Name and address are required" });
        }
        const updated = await updateLibraryDatabase(req.params.id, name, address);
        
        if (updated.affectedRows === 0) {
            return res.status(404).json({ message: "Library not found" });
        }
        
        return res.status(200).json({ id: req.params.id, name, address });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating library",
            error: error.message
        });
    }
};

export const deleteLibrary = async (req, res) => {
    try {
        const deleted = await deleteLibraryDatabase(req.params.id);
        if (deleted.affectedRows === 0) {
            return res.status(404).json({ message: "Library not found" });
        }
        
        return res.status(200).json({ message: "Library deleted successfully" });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting library",
            error: error.message
        });
    }
};
