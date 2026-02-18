const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    eventName: {
        type: String,
        default: 'Omnia After Lecture'
    },
    totalTickets: {
        type: Number,
        required: true
    },
    availableTickets: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    eventDate: {
        type: Date,
        default: Date.now
    },
    locationTitle: {
        type: String,
        default: 'ლოკაცია და დრო'
    },
    locationText: {
        type: String,
        default: 'თბილისი, ექსკლუზიური ტერიტორია. 24 მაისი, 22:00-დან გვიანობამდე.'
    },
    lineupTitle: {
        type: String,
        default: 'ლაინაფი'
    },
    lineupText: {
        type: String,
        default: 'საუკეთესო DJ-ები და დაუვიწყარი ვიზუალური ეფექტები.'
    },
    promoText: {
        type: String,
        default: 'ბილეთების რაოდენობა მკაცრად შეზღუდულია. იჩქარე და დაიკავე ადგილი წლის მთავარ მოვლენაზე.'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);
