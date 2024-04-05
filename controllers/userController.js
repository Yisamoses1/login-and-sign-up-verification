const User = require("../models/userModel");
const jwt = require('jsonwebtoken')
const { createToken, maxAge } = require('./helper')



exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!(name || email || password)) {
    return res.status(401).send("Input the required fields");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(403).send("User with the provided email already exist");
  }
  await new User({
    name,
    email,
    password
  });
  return res.status(201).json({ message: "User created." })
}



exports.login = async (req, res) => {
  const { email, passsword } = req.body;
  try {
    if (!(email || passsword)) {
      return res.json("Empty credentials supplied");
    }
    const user = await User.finfOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.passsword);
      if (!auth) {
        throw Error("Incorrect Details.")
      }
    }
    const token = createToken(user._id, email);
    user.token = token

    return res.status(200).json({ token })
  } catch (err) {
    res.status(500).json(err.message)
  }
}