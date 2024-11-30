import cloudinary from '../config/cloudinary.js';
import { User } from '../models/user.model.js';

/**
 * @swagger
 * /user/avatars/folders:
 *   get:
 *     tags: 
 *       - User
 *     summary: Get list of available avatar folders
 */
export async function getAvatarFolders(req, res) {
    try {
        // First, get the root folder structure
        const result = await cloudinary.v2.api.root_folders();
        console.log('Root folders:', result);

        // Then get Netflix Avatars subfolders
        const netflixFolders = await cloudinary.v2.api.sub_folders('Netflix Avatars');
        console.log('Netflix Avatars subfolders:', netflixFolders);

        const folders = netflixFolders.folders.map(folder => ({
            name: folder.name,
            path: `Netflix Avatars/${folder.name}`
        }));

        res.json({ folders });
    } catch (error) {
        console.error('Error getting avatar folders:', error);
        res.status(500).json({ error: 'Failed to get avatar folders' });
    }
}

/**
 * @swagger
 * /user/avatars/list:
 *   get:
 *     tags: 
 *       - User
 *     summary: Get list of avatars by path
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Path to the avatar folder
 *     responses:
 *       '200':
 *         description: Successfully retrieved avatars
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *       '400':
 *         description: Missing or invalid path parameter
 *       '500':
 *         description: Internal Server Error
 */
export async function getAvatarsByPath(req, res) {
    try {
        const { path } = req.query;
        console.log('Fetching avatars for path:', path);
        
        if (!path) {
            return res.status(400).json({ error: 'Path parameter is required' });
        }

        // Get resources and filter for PNG images only
        const searchResult = await cloudinary.v2.api.resources({
            type: 'upload',
            prefix: path,
        });

        console.log('Raw search result:', JSON.stringify(searchResult, null, 2));
        console.log(`Total resources found: ${searchResult.resources.length}`);

        res.json({ images: searchResult.resources });
    } catch (error) {
        console.error('Error fetching avatars:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ error: 'Failed to fetch avatars', details: error.message });
    }
}

/**
 * @swagger
 * /user/avatar:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user's avatar
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatarUrl:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Avatar updated successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */
export async function updateUserAvatar(req, res) {
    try {
        const { avatarUrl } = req.body;
        const userId = req.user._id;

        console.log('Updating user avatar for user:', userId);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatarUrl },
            { new: true }
        ).select('-password');

        console.log('Updated user:', updatedUser);

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ error: 'Failed to update avatar', details: error.message });
    }
}
