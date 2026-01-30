const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const emailController = require('../controllers/emailController');
const upload = require('../middleware/fileUpload');

// POST: Upload resume and get ATS score
router.post('/analyze', upload.single('resume'), scoreController.analyzeResume);

// POST: Score with raw text (instead of file)
router.post('/score-text', scoreController.scoreText);

// GET: Get score details by ID
router.get('/:id', scoreController.getScoreDetails);

// POST: Send analysis results via email
router.post('/send-email', emailController.sendAnalysisEmail);

module.exports = router;
