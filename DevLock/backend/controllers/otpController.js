import Message from "../models/Message.js";

export const receiveOTP = async (req, res) => {
  try {
    const { aliasId, content, sender } = req.body;
    const otp = content.match(/\b\d{4,8}\b/)?.[0] || null;
    const message = await Message.create({ aliasId, content, otp, sender });
    res.json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOTP = async (req, res) => {
  try {
    const messages = await Message.find({ aliasId: req.params.aliasId });
    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


