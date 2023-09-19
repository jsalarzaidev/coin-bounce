const Joi = require("joi");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
// authController
const authController = {
  async register(req, res, next) {
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
  async login(req, res, next) {
    // 1. validate user input
    // 2. if validation error, return error;
    // 3. match username and password
    // 4. return response

    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = userLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { username, password } = req.body;

    // const username = req.body.username
    // const password = req.body.password
    let user;
    try {
      // match username
      user = await User.findOne({
        username,
      });

      // if the user not found
      if (!user) {
        const error = {
          status: 401,
          message: "Invalid username or password",
        };
        return next(error);
      }

      // match password
      // req.body.password -> hash -> match

      const match = await bcrypt.compare(password, user.password);

      // if not matched, throw error
      if (!match) {
        const error = {
          status: 401,
          message: "Invalid Password",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    // successful login
    return res.status(200).json({
      user,
    });
  },
};

module.exports = authController;
