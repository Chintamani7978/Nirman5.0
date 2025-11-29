const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema({
    farmerAadhar: {
        type: String,
        required: true
    },
    farmerName: {
        type: String,
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    baseAmount: {
        type: Number,
        required: true
    },
    deliveryCharge: {
        type: Number,
        default: 0
    },
    deliveryType: {
        type: String,
        enum: ['pickup', 'home_delivery'],
        default: 'pickup'
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        default: 'qr_payment'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    }
}, {
    timestamps: true
});

// Index for better query performance
revenueSchema.index({ farmerAadhar: 1, createdAt: -1 });
revenueSchema.index({ orderId: 1 }, { unique: true });

module.exports = mongoose.model('Revenue', revenueSchema);