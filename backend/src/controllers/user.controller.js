import User from "../models/user.model.js";

const joinAsUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Please fill all required fields correctly",
      });
    }

    let user = await User.findOne({ email });
    
    // If user already exists, pseudo logs them in (Hackathon constraint)
    if (user) {
      return res.status(200).json({
        message: "User logged in successfully",
        data: user,
      });
    }

    user = new User({
      name,
      email
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error authenticating user",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { joinAsUser, getAllUsers };
