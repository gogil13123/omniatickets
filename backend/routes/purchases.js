const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Purchase = require('../models/Purchase');
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');

const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// @route   POST api/purchases
// @desc    Submit a purchase request
// @access  Public
router.post('/', (req, res, next) => {
    upload.single('receipt')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err);
            return res.status(400).json({ msg: 'File upload error: ' + err.message });
        } else if (err) {
            console.error('Unknown Upload Error:', err);
            return res.status(500).json({ msg: 'Internal server error during upload' });
        }
        next();
    });
}, async (req, res) => {
    console.log('Purchase Request Received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    const { fullName, personalId, email, ticketQuantity, paymentMethod } = req.body;
    try {
        const ticketSettings = await Ticket.findOne({ isActive: true });
        if (!ticketSettings || ticketSettings.availableTickets < ticketQuantity) {
            return res.status(400).json({ msg: 'Not enough tickets available' });
        }

        const totalPrice = ticketSettings.price * ticketQuantity;
        const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const newPurchase = new Purchase({
            fullName,
            personalId,
            email,
            ticketQuantity,
            totalPrice,
            paymentMethod,
            confirmationCode,
            receipt: req.file ? `/uploads/${req.file.filename}` : '',
            status: 'pending'
        });

        await newPurchase.save();

        // Decrement available tickets
        ticketSettings.availableTickets -= ticketQuantity;
        await ticketSettings.save();

        res.json(newPurchase);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/purchases
// @desc    Get all purchases (for admin)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const purchases = await Purchase.find().sort({ createdAt: -1 });
        res.json(purchases);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/purchases/settings
// @desc    Get ticket settings (public)
// @access  Public
router.get('/settings', async (req, res) => {
    try {
        const settings = await Ticket.findOne({ isActive: true });
        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
