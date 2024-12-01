import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVar.js";

export const generateAccessToken = (userId) => {
	return jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "10m" });
};

export const generateRefreshToken = (userId) => {
	return jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "15d" });
};

export const setRefreshTokenCookie = (refreshToken, res) => {
	// Get the origin from request headers to determine the domain
	const origin = res.req.headers.origin;
	const cookieOptions = {
		maxAge: 15 * 24 * 60 * 60 * 1000,
		httpOnly: true,
		sameSite: "none",
		secure: true,
		path: "/"
	};

	// Set domain only for custom domain, not for Vercel
	if (origin && origin.includes("edwardxd.site")) {
		cookieOptions.domain = "edwardxd.site";
	}

	res.cookie("refreshToken", refreshToken, cookieOptions);
};
