const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

function auth(req, res, next) {
  const token = req.headers.token;

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
