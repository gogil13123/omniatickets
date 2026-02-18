const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    personalId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    ticketQuantity: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['BOG', 'TBC'],
        required: true
    },
    confirmationCode: {
        type: String,
        unique: true
    },
    receipt: {
        type: String, // URL to uploaded file
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'used', 'rejected'],
        default: 'pending'
    },
    usedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', PurchaseSchema);
