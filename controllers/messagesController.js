const messagesModel = require('../models/messagesModel');

const createMessage = async (req, res) => {
  const { message, nickname } = req.body;

  const result = await messagesModel.createMessage(message, nickname);

  res.status(201).json(result);
};

const getAllMessages = async (_req, res) => {
  const result = await messagesModel.getAllMessages();

  res.status(200).json(result);
};

module.exports = {
  createMessage,
  getAllMessages,
};
