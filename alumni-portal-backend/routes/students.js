router.get('/all', async (req, res) => {
    try {
        const students = await Student.find().select('fullName department semester batch');
        res.json({ success: true, data: students });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});