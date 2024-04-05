const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { AUTH_EMAIL, AUTH_PASS } = process.env;
const crypto = require('crypto');


/* 
maxAge = 1*24*60*60


const createToken = (id, email) => {
  return jwt.sign({id, email}, tokenKey,{expiresIn: maxAge*1000});
}; */

const transporter = nodemailer.createTransport({
  host: "smtp-mail-outlook.com",
  auth:{
    user: AUTH_EMAIL,
    pass: AUTH_PASS
  }
})

exports.signup = async (req, res) => {
 try {
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
   } else {
     const user = new User({
       name,
       email,
       password,
     });

     bcrypt.genSalt(10, (err, salt) => {
       bcrypt.hash(user.password, salt, (salt, hash) => {
         if (err) throw err;
         user.password = hash;

         const token = crypto.randomBytes(20).toString("hex");
         user.verification = token;

         user.save()

         //send verification email
         transporter.sendMail({
          to:user.email,
          subject:'Email verification',
          html:<p>click<a href='http://localhost:6000/verify/${token}'>here</a> to verify your email </p>
         })

         res.status(200).send('Verification email sent')

       });
     });
   }
 } catch (err) {
  res.status(500).send('Error registering user')
 }
};


// route for email verification 
exports.verify = async (req, res) => {
  try {
    const token = req.params.token;

    //Find user by token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).send("Invalid token");
    }

    //update user status
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).send("Email verified successfully");
  } catch (error) {
    res.status(500).send("Error verifying email");
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