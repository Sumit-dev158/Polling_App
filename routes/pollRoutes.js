import express from 'express';
import Poll from '../models/Poll.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Option:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *         votes:
 *           type: integer
 *     Poll:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         question:
 *           type: string
 *         options:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Option'
 *         createdAt:
 *           type: string
 *     CreatePollInput:
 *       type: object
 *       required:
 *         - question
 *         - options
 *       properties:
 *         question:
 *           type: string
 *           example: "What is your favorite color?"
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Red", "Blue", "Green"]
 *     VoteInput:
 *       type: object
 *       required:
 *         - optionIndex
 *       properties:
 *         optionIndex:
 *           type: integer
 *           example: 0
 */

/**
 * @swagger
 * /api/polls:
 *   post:
 *     summary: Create a new poll
 *     tags: [Polls]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePollInput'
 *     responses:
 *       201:
 *         description: Poll created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', async (req, res) => {
    try {
        const { question, options } = req.body;

        if (!question || !options || options.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a question and at least 2 options'
            });
        }

        const pollOptions = options.map(text => ({ text, votes: 0 }));

        const poll = await Poll.create({
            question,
            options: pollOptions
        });

        res.status(201).json({
            success: true,
            data: poll
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @swagger
 * /api/polls:
 *   get:
 *     summary: Get all polls
 *     tags: [Polls]
 *     responses:
 *       200:
 *         description: List of all polls
 */
router.get('/', async (req, res) => {
    try {
        const polls = await Poll.find().select('-voters').sort('-createdAt');

        res.status(200).json({
            success: true,
            count: polls.length,
            data: polls
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @swagger
 * /api/polls/{id}:
 *   get:
 *     summary: Get poll by ID with vote counts
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Poll details
 *       404:
 *         description: Poll not found
 */
router.get('/:id', async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id).select('-voters');

        if (!poll) {
            return res.status(404).json({
                success: false,
                message: 'Poll not found'
            });
        }

        const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

        res.status(200).json({
            success: true,
            data: {
                ...poll.toObject(),
                totalVotes
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @swagger
 * /api/polls/{id}/vote:
 *   post:
 *     summary: Vote on a poll option
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VoteInput'
 *     responses:
 *       200:
 *         description: Vote recorded
 *       400:
 *         description: Already voted or invalid option
 *       404:
 *         description: Poll not found
 */
router.post('/:id/vote', async (req, res) => {
    try {
        const { optionIndex } = req.body;
        const clientIP = req.ip || req.headers['x-forwarded-for'] || 'unknown';

        const poll = await Poll.findById(req.params.id);

        if (!poll) {
            return res.status(404).json({
                success: false,
                message: 'Poll not found'
            });
        }

        if (poll.voters.includes(clientIP)) {
            return res.status(400).json({
                success: false,
                message: 'You have already voted on this poll'
            });
        }

        if (optionIndex === undefined || optionIndex < 0 || optionIndex >= poll.options.length) {
            return res.status(400).json({
                success: false,
                message: 'Invalid option index'
            });
        }

        poll.options[optionIndex].votes += 1;
        poll.voters.push(clientIP);
        await poll.save();

        res.status(200).json({
            success: true,
            message: 'Vote recorded successfully',
            data: {
                question: poll.question,
                options: poll.options,
                totalVotes: poll.options.reduce((sum, opt) => sum + opt.votes, 0)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
