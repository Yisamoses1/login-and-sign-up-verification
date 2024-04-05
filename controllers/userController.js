const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')



maxAge = 1*24*60*60


const createToken = (id, email) => {
  return jwt.sign({id, email}, tokenKey,{expiresIn: maxAge*1000});
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();

  if (!(name && email && password)) {
    return res.status(401).send("Input the required fields");
  } else if (!/^[a-zA-Z]* $/.test(name)) {
    throw Error("Invalid name entered");
  } else if (!/^[\w-\.] + @([w-] +\.) +[\w-] {2,4} $/.test(email)) {
    throw Error("Invalid email entered");
  } else if (password.length < 8) {
    return res.send("Password is too short!");
 }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(403).send("User with the provided email already exist");
  }else{
  const user = new User({
    name,
    email,
    password
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (salt, hash) => {
      if (err) throw err;
      user.password = hash;

      user
        .save()
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) => {
            res.status(500).json(err.message)
        });
    });
  });
}
};


exports.login = async(req, res) => {
    const { email, passsword } = req.body;
  try {
      email = email.trim();
      password = passsword.trim();

      if (!(email && passsword)) {
        return res.json("Empty credentials supplied");
      }
      const user = await User.finfOne({ email });
      if (user) {
        const auth = await bcrypt.compare(password, user.passsword);
        if (auth) {
          const token = createToken(user._id, email);
          user.token = token
       
          return res.status(200).json({token})
        }
        throw Error("Incorrect password");
      }
      throw Error("incorrect email");

  } catch (err) {
    tes.status(500).json(err.message)
  }
}