const Event = require("../models/Event");
const Job = require("../models/Job");
const Message = require("../models/Message");
const Alumni = require("../models/Alumni");
const Student = require("../models/Student");
const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/response");

const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const adminUsers = await User.find({ role: 'admin' }).distinct('_id');

    const [
      upcomingEvents,
      upcomingEventsThisWeek,
      totalJobs,
      recentJobs,
      totalAlumni,
      totalStudents,
      recentUsers,
      usersWithProfileUpdates,
      usersWhoPostedJobs,
      usersWhoCreatedEvents,
      usersWhoSentMessages,
    ] = await Promise.all([
      Event.countDocuments({ date: { $gte: now } }),
      Event.countDocuments({
        createdAt: { $gte: oneWeekAgo },
        date: { $gte: now }
      }),
      Job.countDocuments(),
      Job.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      Alumni.countDocuments(),
      Student.countDocuments(),
      User.countDocuments({
        createdAt: { $gte: oneMonthAgo },
        role: { $ne: 'admin' }
      }),
      User.find({
        updatedAt: { $gte: oneMonthAgo },
        _id: { $nin: adminUsers }
      }).distinct('_id'),
      Job.find({
        createdAt: { $gte: oneMonthAgo },
        postedBy: { $nin: adminUsers }
      }).distinct('postedBy'),
      Event.find({
        createdAt: { $gte: oneMonthAgo },
        createdBy: { $nin: adminUsers }
      }).distinct('createdBy'),
      Message.find({
        createdAt: { $gte: oneMonthAgo },
        senderId: { $nin: adminUsers }
      }).distinct('senderId'),
    ]);

    const totalUsers = totalAlumni + totalStudents;

    const uniqueActiveUsers = new Set([
      ...usersWithProfileUpdates,
      ...usersWhoPostedJobs,
      ...usersWhoCreatedEvents,
      ...usersWhoSentMessages
    ].map(id => id.toString()));

    const engagementRate = totalUsers > 0
      ? Math.round((uniqueActiveUsers.size / totalUsers) * 100)
      : 0;

    const stats = {
      upcomingEvents,
      upcomingEventsThisWeek,
      jobOpenings: totalJobs,
      totalAlumni: totalUsers,
      newThisMonth: recentUsers,
      engagementRate,
      recentJobsCount: recentJobs,
    };

    return successResponse(res, stats, 200, "Dashboard stats fetched successfully");
  } catch (error) {
    console.error("getDashboardStats Error:", error);
    return errorResponse(res, "Failed to fetch dashboard statistics", 500);
  }
};

const getDashboardData = async (req, res) => {
  try {
    const upcomingEvents = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(3)
      .select("title date time venue capacity category");

    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("title company location category salary createdAt");

    return successResponse(res, { upcomingEvents, recentJobs }, 200, "Dashboard data fetched successfully");
  } catch (error) {
    console.error("getDashboardData Error:", error);
    return errorResponse(res, "Failed to fetch dashboard data", 500);
  }
};

module.exports = {
  getDashboardStats,
  getDashboardData,
};