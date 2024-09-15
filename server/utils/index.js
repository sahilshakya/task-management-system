import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connection established");
  } catch (e) {
    console.log("DB Error" + e);
  }
};

export default dbConnection;

export const createJWT = (res, userId) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict", // prevents CSRF attacks
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
};
