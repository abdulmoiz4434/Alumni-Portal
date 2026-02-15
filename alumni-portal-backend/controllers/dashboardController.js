const Event = require("../models/Event");
const Job = require("../models/Job");
const Message = require("../models/Message");
const messageService = require("../services/messageService");
const Alumni = require("../models/Alumni");
const Student = require("../models/Student");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

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

        const allActiveUserIds = [
            ...usersWithProfileUpdates,
            ...usersWhoPostedJobs,
            ...usersWhoCreatedEvents,
            ...usersWhoSentMessages
        ];
        
        const uniqueActiveUsers = new Set(
            allActiveUserIds.map(id => id.toString())
        );
        
        const activeUsersCount = uniqueActiveUsers.size;
        
        const engagementRate = totalUsers > 0 
            ? Math.round((activeUsersCount / totalUsers) * 100) 
            : 0;

        const stats = {
            upcomingEvents: upcomingEvents,
            upcomingEventsThisWeek: upcomingEventsThisWeek,
            jobOpenings: totalJobs,
            totalAlumni: totalUsers,
            newThisMonth: recentUsers,
            engagementRate: engagementRate,
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

        res.status(200).json({
            success: true,
            data: {
                upcomingEvents,
                recentJobs,
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