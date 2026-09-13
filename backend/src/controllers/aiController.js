const AIService = require('../services/aiService');
const RAGService = require('../services/ragService');
const { successResponse, errorResponse } = require('../utils/response');

exports.requestUnderstanding = async (req, res) => {
  try {
    const { description, serviceName } = req.body;
    const result = await AIService.understandRequest({ description, serviceName });
    return successResponse(res, result);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

exports.analyzeIssue = async (req, res) => {
  try {
    const { description, image } = req.body;
    const result = await AIService.analyzeIssueWithPhoto({ description, imageBase64OrUrl: image });
    return successResponse(res, result);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

exports.concierge = async (req, res) => {
  try {
    const { question } = req.body;
    const result = await RAGService.answerConcierge({
      hotelId: req.user.hotelId,
      question
    });
    return successResponse(res, result);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

exports.staffAssistant = async (req, res) => {
  try {
    const { query } = req.body;
    const result = await RAGService.answerStaffAssistant({
      hotelId: req.user.hotelId,
      query
    });
    return successResponse(res, result);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};
