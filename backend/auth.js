const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function auth(req, res, next) {
  const token = req.header.token;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, data) => {
      if (err) {
        res.status(401).send({
          message: "Unauthorize",
        });
      } else {
        res.user = data;
        next();
      }
    });
  } else {
    res.status(403).send({
      message: "Unauthorize",
    });
  }
}

module.exports = auth;
