const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");


const router = express.Router();

// @router GET /api/admin/orders
// @desc Get All order (admin only)
// @access Private/Admin

router.get("/", protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "name email");
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route PUT /api/admin/orders/:id
// @desc Update order status
// @access Private/admin

router.put("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name");
        console.log(order);

        if (order) {
            const newStatus = req.body.status || order.status;
            const delivered = newStatus === "Delivered";

            order.status = newStatus;
            order.isDelivered = delivered;
            order.DeliveredAt = delivered ? (order.DeliveredAt || Date.now()) : undefined;

            // Cash on Delivery: paid only when delivered.
            // If admin changes status back (Processing, Shipped, Cancelled) it becomes unpaid again.
            if (order.paymentMethod === "COD") {
                order.isPaid = delivered;
                order.paidAt = delivered ? (order.paidAt || Date.now()) : undefined;
                order.paymentStatus = delivered ? "paid" : "pending";
            }

            const updateOrder = await order.save();
            res.json(updateOrder);
        }
        else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })

    }
});

// @route DELETE /api/admin/order/:id
// @desc Delete an Order
// @access Private/Admin

router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ message: "Order removed Successfully" });
        } else {
            res.status(404).json({ message: "Order not found" })
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });

    }
})
module.exports = router