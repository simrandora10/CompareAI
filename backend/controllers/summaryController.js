import Summary from "../models/Summary.js";
import { scrapeProduct } from "../utils/scraper.js";
import geminiService from "../utils/geminiService.js";

const createSummary = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ error: "No input provided" });
    }

    // Check if input is a URL
    const isUrl = geminiService.isUrl(input);
    
    let productAnalysis;
    try {
      // Use Gemini service for analysis
      productAnalysis = await geminiService.generateSummary(input, isUrl);
    } catch (geminiError) {
      console.error("Gemini analysis failed:", geminiError);
      
      // Fallback to basic scraping for URLs
      if (isUrl) {
        try {
          const scrapedText = await scrapeProduct(input);
          productAnalysis = await geminiService.generateSummary(scrapedText, false);
        } catch (scrapeError) {
          console.error("Scraping fallback failed:", scrapeError);
          return res.status(500).json({ 
            error: "Failed to analyze product. Please try with a different URL or provide product description." 
          });
        }
      } else {
        return res.status(500).json({ 
          error: "Failed to analyze product description. Please try again." 
        });
      }
    }

    // Save to database with proper user ID
    const savedSummary = await Summary.create({
      userId: req.user.id, // Fixed: Use actual user ID from JWT
      rawInput: input,
      sourceUrl: isUrl ? input : null,
      aiSummary: productAnalysis, // Store the structured JSON response
      aiMetadata: {
        model: "gemini-2.5-flash",
        timestamp: new Date(),
        inputType: isUrl ? "url" : "text"
      }
    });

    res.json({
      success: true,
      data: savedSummary,
    });
  } catch (err) {
    console.error("Error in createSummary:", err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
};

const compareSummaries = async (req, res) => {
  try {
    const { ids } = req.body; 
    if (!ids || !Array.isArray(ids) || ids.length < 2) {
      return res
        .status(400)
        .json({ error: "Please provide at least 2 summary IDs." });
    }

    const summaries = await Summary.find({
      _id: { $in: ids },
      userId: req.user.id,
    });

    if (summaries.length < 2) {
      return res
        .status(404)
        .json({ error: "Some summaries not found for this user." });
    }

    try {
      // Use Gemini service for comparison
      const comparison = await geminiService.compareProducts(summaries.map(s => s.aiSummary));

      res.json({
        success: true,
        comparison,
      });
    } catch (geminiError) {
      console.error("Gemini comparison failed:", geminiError);
      res.status(500).json({ error: "Failed to compare products" });
    }
  } catch (err) {
    console.error("Error in compareSummaries:", err);
    res.status(500).json({ error: "Failed to compare summaries" });
  }
};

const listSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: summaries });
  } catch (err) {
    console.error("Error in listSummaries:", err);
    res.status(500).json({ error: "Failed to fetch summaries" });
  }
};

const getSummary = async (req, res) => {
  try {
    const summary = await Summary.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!summary) {
      return res.status(404).json({ error: "Summary not found" });
    }

    res.json({ success: true, data: summary });
  } catch (err) {
    console.error("Error in getSummary:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};

const deleteSummary = async (req, res) => {
  try {
    const deleted = await Summary.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Summary not found" });
    }

    res.json({ success: true, message: "Summary deleted" });
  } catch (err) {
    console.error("Error in deleteSummary:", err);
    res.status(500).json({ error: "Failed to delete summary" });
  }
};

export {
  createSummary,
  compareSummaries,
  listSummaries,
  getSummary,
  deleteSummary,
};