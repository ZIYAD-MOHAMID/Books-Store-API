const jwt = require("jsonwebtoken");

//Verify Token
const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "invalid token" + err });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

//Verify Token & Authorize the user                         // user & admin
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "you are not allowed" }); //forbidden
    }
  });
};

//Verify Token & Admin                             // admin
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "you are not allowed,only admin allowed" });
    }
  });
};
module.exports = { verifyTokenAndAuthorization, verifyTokenAndAdmin };
