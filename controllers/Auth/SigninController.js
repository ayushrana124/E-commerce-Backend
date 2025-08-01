import User from "../../models/userModel.js";
import generateToken from "../../utils/generateToken.js";

const signInController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password){
      return res.status(401).json({message : "Email and password required"});
    }

    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    generateToken(res, user._id);

    res
      .status(200)
      .json({
        message: "Successfully login",
        User: {
          _id: user._id,
          name: user.name,
          email: user.email,
          gender: user.gender,
          phone: user.phone,
          userId: user.userId,
        },
      });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export default signInController;
