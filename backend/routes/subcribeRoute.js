const express = require("express");
const router = express.Router();
const Subcriber = require("../models/subscriber");

// @router POST /api/subcribe
// @desc handle newletter subcription
// @acces Public

router.post("/subcribe", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is requried" });
    }

    try {
        // Check if the email is already subcribed
        let subscriber = await Subcriber.findOne({ email });
        if (subscriber) {
            return res.status(400).json({ message: "email is already subscribed" });
        }

        //Create a new Subscriber
        subscriber = new Subcriber({ email });
        await subscriber.save();

        res.status(201).json({ message: "Successfully subscribed to the newletter!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });

    }
});

module.exports = router;