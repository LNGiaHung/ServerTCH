import express from 'express';
import { getAvatarFolders, getAvatarsByPath, updateUserAvatar } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Get list of available avatar folders
router.get('/avatars/folders', getAvatarFolders);

// Get avatars by path with pagination
router.get('/avatars/list', getAvatarsByPath);

// Update user's avatar
router.put('/avatar', protectRoute, updateUserAvatar);

export default router;
