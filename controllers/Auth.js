import UserModel from "../models/user.js"
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

// Use a consistent JWT secret - either from environment or fallback
const JWT_SECRET = process.env.JWT_SECRET || "THIS IS SECRETE";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Ensure password is a string
    if (typeof password !== 'string') {
      return res.status(400).json({ success: false, message: "Password must be a string" });
    }

    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res.status(401).json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(200).json({ message: "User registered successfully", newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};


const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,     // ⚠️ important on Vercel
      sameSite: "none", // ⚠️ important for cross-site
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "Login successfully", user, token });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
    console.log("Login error:", error);
  }
};

const Logout = async (req, res) => {
  try {
    res.clearCookie('token')
    res.status(200).json({ message: "user Logout successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: "interanl server ereo" })
    console.log(error)
  }
}
const CheckUser = async (req, res) => {
  try {
    const user = req.user
    if (!user) {
      res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user)


  } catch (error) {
    res.status(500).json({ message: "internal server error" })
    console.log(error)

  }
}

export { register, Login, Logout, CheckUser }