import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";

/** 
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication operations
 */

/** 
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User signed up successfully
 *       400:
 *         description: Email already exists or fields are missing
 *       500:
 *         description: Internal server error
 */
export async function signup(req, res) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ success: false, message: "Email and password are required" });
		}

		const existingUser = await User.findOne({ email: email });
		if (existingUser) {
			return res.status(400).json({ success: false, message: "Email already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);

		const newUser = new User({
			email,
			password: hashedPassword,
		});

		await newUser.save();

		res.status(201).json({ success: true, message: "User signed up successfully" });
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials or fields are missing
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function login(req, res) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ success: false, message: "Email and password are required" });
		}

		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(404).json({ success: false, message: "Invalid credentials" });
		}

		const isPasswordCorrect = await bcryptjs.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		res.status(200).json({ success: true, message: "User logged in successfully" });
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}
