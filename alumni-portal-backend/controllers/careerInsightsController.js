const Alumni = require("../models/Alumni");
const { successResponse, errorResponse } = require("../utils/response");

exports.getCareerInsights = async (req, res) => {
  try {
    const stats = await Alumni.aggregate([
      {
        $match: {
          jobTitle: { $exists: true, $ne: "" },
          company: { $exists: true, $ne: "" }
        }
      },
      {
        $facet: {
          "jobTitles": [
            { $group: { _id: "$jobTitle", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          "companies": [
            { $group: { _id: "$company", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          "totalContributors": [
            { $count: "count" }
          ]
        }
      }
    ]);

    const careerData = stats[0];

    return successResponse(res, {
      jobTitles: careerData.jobTitles || [],
      companies: careerData.companies || [],
      totalContributors: careerData.totalContributors[0]?.count || 0
    }, 200, "Career insights fetched successfully");
  } catch (error) {
    console.error("Career Insights Error:", error);
    return errorResponse(res, "Server Error: Could not fetch career insights", 500);
  }
};