const signOutController = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export default signOutController;
