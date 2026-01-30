const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

// GET: Get all resume analysis history
router.get('/', historyController.getHistory);

// DELETE: Delete a specific analysis
router.delete('/:id', historyController.deleteAnalysis);

// GET: Get summary stats
router.get('/stats/summary', historyController.getStats);

module.exports = router;
