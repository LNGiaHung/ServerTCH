import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVar.js";

export const generateAccessToken = (userId) => {
	return jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "10m" });
};

export const generateRefreshToken = (userId) => {
	return jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "15d" });
};

export const setRefreshTokenCookie = (refreshToken, res) => {
	res.cookie("refreshToken", refreshToken, {
		domain: ".tchmovie.edwardxd.site", 
		maxAge: 15 * 24 * 60 * 60 * 1000, 
		httpOnly: true, 
		sameSite: "none", 
		secure: true, 
	});
};
