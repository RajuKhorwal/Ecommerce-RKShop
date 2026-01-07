// backend/middleware/fetchUser.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/Users");

const fetchUser = async (req, res, next) => {
  //Get the user from the jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(data.user.id);

    if (!user) {
      return res
        .status(401)
        .send({ error: "User no longer exists. Please login again." });
    }
    req.user = user; //req.user = data.user
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchUser;
