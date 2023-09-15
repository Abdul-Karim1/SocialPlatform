const Notification = require("../Models/Notification");

const createNotification = async (req, res) => {
  try {
    const { notification, community, user } = req.body;

    const newNotification = await Notification.create({
      notification,
      community,
      user,
    });

    return res.status(201).json(newNotification);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const readNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("community")
      .populate("user");

    return res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateNotification = async (req, res) => {
  const notificationId = req.params.id;
  const { notification, community, user } = req.body;

  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { notification, community, user },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found!!!" });
    }

    return res.status(200).json(updatedNotification);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteNotification = async (req, res) => {
  const notificationId = req.params.id;

  try {
    const deletedNotification = await Notification.findByIdAndDelete(
      notificationId
    );

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found!!!" });
    }

    return res
      .status(200)
      .json({ message: "Notification deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createNotification,
  readNotifications,
  updateNotification,
  deleteNotification,
};
