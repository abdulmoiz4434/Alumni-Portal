router.get('/all', async (req, res) => {
    try {
        const alumni = await Alumni.find().select('fullName department graduationYear');
        res.json({ success: true, data: alumni });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});