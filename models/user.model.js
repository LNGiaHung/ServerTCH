import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	firstName:{
		type: String,
	},
	lastName: {
		type: String,
	},
	image: {
		type: String,
		default: "",
	},
	searchHistory: {
		type: Array,
		default: [],
	},
	refreshToken: {
		type: String,
	},
});

export const User = mongoose.model("User", userSchema);
