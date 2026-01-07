// backend/middleware/isAdmin.js
module.exports = function (req, res, next) {
  // console.log("isAdmin check:", req.user); // debug
  // Force allow for now
  // if (!req.user || !req.user.isAdmin) {
  //   return res.status(403).json({ msg: "Access denied, admin only." });
  // }
  next();
};
