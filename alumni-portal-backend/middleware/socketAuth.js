const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function socketAuth(socket, next) {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.query?.token;

  if (!token) {
    return next(new Error("Not authorized: no token"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new Error("User not found"));
    }
    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Not authorized, token failed"));
  }
}

module.exports = socketAuth;