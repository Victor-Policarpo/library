import { getUserByEmailDatabase } from "../repository/userRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await getUserByEmailDatabase(email);
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch  = await bcrypt.compare(password, user.password);
        if (!passwordMatch ) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            }, process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            return res.status(200).json({
                message: "Login successful",
                token
            })


    } catch (error) {
        return res.status(500).json({
            message: "Error during login",
            error: error.message
        });
    }
}