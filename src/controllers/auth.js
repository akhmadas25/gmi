const { user } = require("../../models");
// import joi validation
const Joi = require("joi");
// import bcrypt
const bcrypt = require("bcrypt");
//import jsonwebtoken
const jwt = require("jsonwebtoken");
// import sender mail middleware
const sendEmail = require("../middlewares/sendEmail");

exports.register = async (req, res) => {
  // our validation schema here
  const schema = Joi.object({
    fullname: Joi.string().min(5).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
    phone: Joi.number().min(12).required(),
    address: Joi.string(),
    picture: Joi.string(),
  });

  // do validation and get error object from schema.validate
  const { error } = schema.validate(req.body);

  // if error exist send validation error message
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

  try {
    // we generate salt (random value) with 10 rounds
    const salt = await bcrypt.genSalt(10);
    // we hash password from request with salt
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const getUser = await user.findAll();
    const exist = getUser.find((item) => req.body.email === item.email);
    if (exist) {
      res.send({
        status: "failed",
        message: "user already exist",
      });
    } else {
      const userProfile = "profile.jpg";
      const newUser = await user.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hashedPassword,
        address: req.body.address,
        phone: req.body.phone,
        picture: userProfile,
      });

      const token = jwt.sign(
        { id: newUser.id, status: newUser.status },
        process.env.JWT_KEY,
        {
          expiresIn: "24h",
        }
      );
      const link = `${process.env.BASE_URL}/confirm/${newUser.id}/${token}`;
      await sendEmail(newUser.email, "confirm account", link);

      res.status(200).send({
        status: "success...",
        message: `an email confirmation has sent to ${newUser.email}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  // our validation schema here
  const schema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
  });

  // do validation and get error object from schema.validate
  const { error } = schema.validate(req.body);

  // if error exist send validation error message
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
        confirmed: true,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!userExist) {
      return res.status(400).send({
        status: 400,
        message: "user not confirmed",
      });
    }

    // compare password between entered from client and from database
    const isValid = await bcrypt.compare(req.body.password, userExist.password);

    // check if not valid then return response with status 400 (bad request)
    if (!isValid) {
      return res.status(400).send({
        status: 400,
        message: "credential is invalid",
      });
    }

    // generate token
    const token = jwt.sign(
      { id: userExist.id, status: userExist.status },
      process.env.JWT_KEY
    );

    res.status(200).send({
      status: 200,
      data: {
        name: userExist.fullname,
        email: userExist.email,
        status: userExist.status,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      message: "Server Error",
    });
  }
};

exports.confirmAccount = async (req, res) => {
  try {
    const { token, id } = req.params;
    const data = await user.findOne({
      where: {
        id,
      },
    });

    await user.update(
      {
        ...data,
        confirmed: true,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).send({
      name: data.name,
      email: data.email,
      status: data.status,
      token: token,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
    console.log(error);
  }
};

exports.sendResetPassword = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().min(6).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const data = await user.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!data) {
      res.status(400).send({
        status: "error",
        message: "email not registered",
      });
    } else {
      // generate token
      const token = jwt.sign(
        { id: data.id, status: data.status },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );

      const link = `${process.env.BASE_URL}/reset-password/${data.id}/${token}`;
      await sendEmail(data.email, "reset-password", link);

      res.send({
        status: "success",
        message: "check your email to reset password",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const schema = Joi.object({ password: Joi.string().min(6).required() });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const getUser = await user.findOne({
      where: {
        id,
      },
    });
    if (!getUser) {
      res.status(400).send({
        message: "invalid or token expired",
      });
    }

    // we generate salt (random value) with 10 rounds
    const salt = await bcrypt.genSalt(10);
    // we hash password from request with salt
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const data = await user.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          id,
        },
      }
    );

    res.send({
      status: "success",
      message: "successfully reset password",
    });
  } catch (error) {
    console.log(error);
  }
};
