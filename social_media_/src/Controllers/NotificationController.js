const Notification = require("../Models/Notification");

const createNotification = async (req, res) => {
  try {
    const { notification, community, user } = req.body;

    // Create the notification first
    const newNotification = await Notification.create({
      notification,
      community,
      user,
    });

    // Populate the community field using the populate method
    // await newNotification.populate("community").execPopulate();

    console.log(
      "--------------------------------------------------------------------------------------------------------",
      newNotification
    );

    return res.status(201).json(newNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
    return res.status(500).json({ message: "Server Error!!!" });
  }
};

const readNotifications = async (req, res) => {
  const communityId = req.params.id;
  try {
    // Find notifications that belong to the specified communityId
    const notifications = await Notification.find({ community: communityId })
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

    // Populate the community field for the updated notification
    await updatedNotification.populate("community").execPopulate();

    return res.status(200).json(updatedNotification);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteNotification = async (req, res) => {
  const notificationId = req.params.id;
  console.log(
    "-------------------------bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    notificationId
  );

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
