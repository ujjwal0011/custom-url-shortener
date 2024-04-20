const bcrypt = require("bcrypt");
const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("Name, email, and password are required.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.redirect("/");
  } catch (error) {
    console.error("Error during user signup:", error);
    return res
      .status(500)
      .send("Error during user signup. Please try again later.");
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render("login", {
      error: "Invalid Username or Password",
    });
  }

  const token = setUser(user);
  res.cookie("uid", token);
  return res.redirect("/");
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
