import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";

const Getuser = async (req, res) => {
    try {
        const users = await UserModel.find()
        res.status(200).json({ users })
    } catch (error) {
        res.status(500).json({ message: "intenral server error" })
        console.log(error)
    }
}

const deletUser = async (req, res) => {
    try {
        const userId = req.params.id
        const checkAdmin = await UserModel.findById(userId)

        if (checkAdmin.role == 'admin') {
            return res.status(409).json({ message: "you can not delete yourself" })
        }
        const user = await UserModel.findByIdAndDelete(userId)
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        res.status(200).json({ message: "user delete successfully ", user })
    } catch (error) {
        res.status(500).json({ message: "intenral server error" })
        console.log(error)
    }
}

// Update admin's name, email, and password
const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, password, newPassword } = req.body

        const admin = await UserModel.findById(id)
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" })
        }

        if (admin.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized access" })
        }

        // Check if the current password is valid
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid current password" })
        }

        // Update name if provided
        if (name) {
            admin.name = name
        }

        // Update email if provided
        if (email) {
            admin.email = email
        }

        // Update password if a new one is provided
        if (newPassword) {
            const salt = await bcrypt.genSalt(10)
            admin.password = await bcrypt.hash(newPassword, salt)
        }

        await admin.save()

        res.status(200).json({ message: "Admin details updated successfully", admin })
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
        console.log(error)
    }
}




export { Getuser, deletUser, updateAdmin }