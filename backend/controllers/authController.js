const Joi = require("joi");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// authController
const authController = {
  async register(req, res, next) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

    // 1. validate user input
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = userRegisterSchema.validate(req.body);

    // 2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    // 3. if email or username is already registered -> return an error
    const { username, name, email, password } = req.body;

    try {
      const emailInUse = await User.exists({ email });

      const usernameInUse = await User.exists({ username });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email is already in use, use another email!",
        };

        return next(error);
      }

      if (usernameInUse) {
        const error = {
          status: 409,
          message: "username not available, choose another username!",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    // 4. password hash if no error returned
    const hashedPassword = await bcrypt.hash(password, 10);
    // 5. store user data in db
    const userToRegister = new User({
      username,
      email,
      name,
      password: hashedPassword,
    });

    const user = await userToRegister.save();

    // 6. respond send
    return res.status(201).json({
      user,
    });
  },

  // login method
  async login() {},
};

module.exports = authController;
