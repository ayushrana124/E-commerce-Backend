import User from "../../models/userModel.js";
import generateToken from "../../utils/generateToken.js";

const signUpController = async (req, res) => {
  try {
    const { name, email, password, phone, gender, dob } = req.body;

    if(!name || !email || !password){
       return res.status(400).json({Message : "Name, Email, Password are required"});
    }

    console.log("User Entered DOB is :" ,dob);

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: " Email already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      gender,
      dob,
    });

    generateToken(res, newUser._id);

   return res.status(201).json({
      success: true,
      message: "User created successfully.",
      User: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        dob: newUser.dob.toISOString().split("T")[0],
        gender: newUser.gender,
        phone: newUser.phone,
        createdAt: newUser.createdAt,
      },
    })
  } catch (err) {
    console.log("Error in creating user :", error.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export default signUpController;
