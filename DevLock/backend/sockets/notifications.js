let ioInstance = null;

export const initNotifications = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("joinAlias", (aliasId) => {
      if (!aliasId) {
        return;
      }
      socket.join(aliasId);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export const notifyUser = (aliasId, message) => {
  if (!ioInstance) {
    console.warn("Attempted to notify user before socket.io was initialised.");
    return;
  }

  ioInstance.to(aliasId).emit("notification", {
    aliasId,
    message,
    timestamp: new Date().toISOString(),
  });
};


