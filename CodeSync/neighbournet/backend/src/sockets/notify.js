const User = require('../models/user');

const notifyNearby = async (io, userSocketMap, requestDoc) => {
    try {
        const { location } = requestDoc;
        // Find volunteers within 5000m (5km)
        const volunteers = await User.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: location.coordinates,
                    },
                    $maxDistance: 5000,
                },
            },
            _id: { $ne: requestDoc.requesterId } // Don't notify the requester
        });

        volunteers.forEach(volunteer => {
            const socketId = userSocketMap.get(volunteer._id.toString());
            if (socketId) {
                io.to(socketId).emit('request:nearby', requestDoc);
                console.log(`Notified user ${volunteer._id} on socket ${socketId}`);
            }
        });
    } catch (error) {
        console.error('Notify Error:', error);
    }
};

module.exports = notifyNearby;
