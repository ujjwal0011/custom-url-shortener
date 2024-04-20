const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secret = process.env.jwt_secret
function setUser(user) {
  const payLoad = {
    _id: user._id,
    email: user.email,
  };
  
  const expiresIn = '1hr';

  return jwt.sign(payLoad, secret, { expiresIn });
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}


module.exports = {
  setUser,
  getUser,
};
