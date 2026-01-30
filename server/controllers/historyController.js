const Resume = require('../models/Resume');

// Get all analysis history
exports.getHistory = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: resumes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a specific analysis
exports.deleteAnalysis = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    res.json({ success: true, message: 'Analysis deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get summary statistics
exports.getStats = async (req, res) => {
  try {
    const total = await Resume.countDocuments();
    const avgScore = await Resume.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$atsScore' } } },
    ]);
    const avgMatch = await Resume.aggregate([
      { $group: { _id: null, avgMatch: { $avg: '$matchPercentage' } } },
    ]);

    res.json({
      success: true,
      data: {
        totalAnalyzed: total,
        averageAtsScore: avgScore[0]?.avgScore || 0,
        averageMatchPercentage: avgMatch[0]?.avgMatch || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
