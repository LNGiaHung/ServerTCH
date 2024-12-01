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
        const netflixFolders = await cloudinary.v2.api.sub_folders('Netflix Avatars');
        const folders = netflixFolders.folders.map(folder => ({
            name: folder.name,
            path: `Netflix Avatars/${folder.name}`
        }));

        res.json({ folders });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get avatar folders' });
    }
}

/**
 * @swagger
 * /user/avatars/list:
 *   get:
 *     tags: 
 *       - User
 *     summary: Get list of avatars by show folder
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Path to the show folder (e.g., "Netflix Avatars/Stranger Things")
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
        
        if (!path) {
            return res.status(400).json({ error: 'Path parameter is required' });
        }

        // List all assets in the folder
        const assetsList = await cloudinary.v2.api.resources_by_asset_folder(path, {
            resource_type: "image",
            type: "upload",
            max_results: 100,
        });

        // If no assets found, try regular resources API
        if (!assetsList.resources || assetsList.resources.length === 0) {
            const searchResult = await cloudinary.v2.api.resources({
                type: 'upload',
                prefix: path,
                max_results: 100,
                resource_type: 'image'
            });
            
            if (searchResult.resources && searchResult.resources.length > 0) {
                assetsList.resources = searchResult.resources;
            }
        }

        // Transform the resources to include proper URLs
        const images = (assetsList.resources || []).map(resource => ({
            url: resource.secure_url,
            id: resource.public_id,
            name: resource.public_id.split('/').pop().split('.')[0],
            format: resource.format,
            folder: resource.folder
        }));

        res.json({ images });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch avatars' });
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

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { image: avatarUrl },  
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update avatar' });
    }
}
