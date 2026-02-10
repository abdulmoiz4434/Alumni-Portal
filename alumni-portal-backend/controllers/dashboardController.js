const Event = require("../models/Event");
const Job = require("../models/Job");
const Mentorship = require("../models/Mentorship");
const messageService = require("../services/messageService");
const User = require("../models/User");
const Alumni = require("../models/Alumni");
const Student = require("../models/Student");

// Get aggregated dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;

        // Fetch all data in parallel for better performance
        const [
            totalEvents,
            upcomingEvents,
            totalJobs,
            recentJobs,
            allMentorships,
            userConversations,
            totalAlumni,
            totalStudents,
            recentAlumni,
        ] = await Promise.all([
            Event.countDocuments(),
            Event.countDocuments({ date: { $gte: new Date() } }),
            Job.countDocuments(),
            Job.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
            Mentorship.find(),
            messageService.getConversationsForUser(userId),
            Alumni.countDocuments(),
            Student.countDocuments(),
            Alumni.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
        ]);

        // Calculate mentorship requests based on user role
        let mentorshipRequests = 0;
        if (userRole === "alumni") {
            // For alumni, count mentorships where they are the mentor and status is pending
            mentorshipRequests = allMentorships.filter(
                (m) => m.mentor?.toString() === userId.toString() && m.status === "pending"
            ).length;
        } else if (userRole === "student") {
            // For students, count their active mentorships
            mentorshipRequests = allMentorships.filter(
                (m) => m.student?.toString() === userId.toString() && m.status === "active"
            ).length;
        }

        // Calculate unread messages (simplified - count all conversations for now)
        const unreadMessages = userConversations.length;

        // Calculate total users
        const totalUsers = totalAlumni + totalStudents;

        // Calculate engagement rate (simplified formula)
        const activeUsers = recentAlumni;
        const engagementRate = totalAlumni > 0 ? Math.round((activeUsers / totalAlumni) * 100) : 0;

        // Prepare response
        const stats = {
            upcomingEvents: upcomingEvents,
            jobOpenings: totalJobs,
            mentorshipRequests: mentorshipRequests,
            unreadMessages: unreadMessages,
            totalAlumni: totalUsers,
            newThisMonth: recentAlumni,
            engagementRate: engagementRate,
            countries: 42, // This would require geo data - using placeholder
            recentJobsCount: recentJobs,
        };

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error("getDashboardStats Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
            error: error.message,
        });
    }
};

// Get dashboard data (events, jobs, mentorships)
const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;

        // Fetch upcoming events (next 3)
        const upcomingEvents = await Event.find({ date: { $gte: new Date() } })
            .sort({ date: 1 })
            .limit(3)
            .select("title date time location attendees type");

        // Fetch recent jobs (last 3)
        const recentJobs = await Job.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .select("title company location jobType salary postedDate");

        // Fetch active mentorships for the user
        let activeMentorships = [];
        if (userRole === "student") {
            activeMentorships = await Mentorship.find({
                student: userId,
                status: "active",
            })
                .populate("mentor", "fullName email role")
                .limit(2);
        } else if (userRole === "alumni") {
            activeMentorships = await Mentorship.find({
                mentor: userId,
                status: "active",
            })
                .populate("student", "fullName email role")
                .limit(2);
        }

        res.status(200).json({
            success: true,
            data: {
                upcomingEvents,
                recentJobs,
                activeMentorships,
            },
        });
    } catch (error) {
        console.error("getDashboardData Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
            error: error.message,
        });
    }
};

module.exports = {
    getDashboardStats,
    getDashboardData,
};
