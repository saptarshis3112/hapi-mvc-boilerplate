const { responseHelper, userHelper, mailHelper } = require("../helpers")

const {
  User,
  UserVerification,
} = require("../models");

const userLogin = async (req, h) => {
  try {

    const { email, password } = req.payload;

    const userExists = await User.findOne({
      where: {
        email,
      },
      attributes: ['id', 'is_active', 'password'],
      raw: true,
    });

    if (!userExists) {
      return responseHelper.error(h, "USER404");
    }

    if (!userExists.is_active) {
      return responseHelper.error(h, "USERVERIFIED403");
    }

    // Check password.
    const comparePassword = userHelper.checkPassword(password, userExists.password);
    if (!comparePassword) {
      return responseHelper.error(h, "PASSWORDMISMATCH403");
    }

    const token = await userHelper.generateToken({ id: userExists.id });
    return responseHelper.success(h, "LOGINSUCCESS200", { token });

  } catch (ex) {
    return responseHelper.error(h, "SERVER500", ex);
  }
}

const userRegister = async (req, h) => {
  try {

    const {
      first_name,
      last_name,
      email,
      password,
    } = req.payload;

    // Does the user exists?
    const userExists = await User.findOne({
      where: {
        email,
      },
      attributes: ['id'],
      raw: true,
    });

    if (userExists) {
      return responseHelper.error(h, "USEREXISTS400");
    }

    // creating a new user.
    const newHash = userHelper.hashPassword(password);
    const userCreate = await User.create({
      first_name,
      last_name,
      email,
      password: newHash,
    });

    const otp = userHelper.generateOtp();
    await UserVerification.create({
      otp,
      user_id: userCreate.id,
    });

    mailHelper({
      to: email,
      subject: "Verification email",
      text: `Your otp is ${otp}`
    });

    return responseHelper.success(h, "USERREGISTER200");

  } catch (ex) {
    return responseHelper.error(h, "SERVER500", ex);
  }
}

const verifyUser = async (req, h) => {
  try {

    const { email, otp } = req.payload;

    const verificationExists = await UserVerification.findOne({
      where: {
        otp,
      },
      attributes: ['id', 'is_revoked'],
      raw: true,
      mapToModel: true,
      nest: true,
      include: [
        {
          model: User,
          attributes: ['id'],
          where: {
            email,
          }
        }
      ],
    });

    // Verification does not exists.
    if (!verificationExists) {
      return responseHelper.error(h, "VERIFICATIONEXISTS404");
    }

    // is verification revoked?
    if (verificationExists.is_revoked) {
      return responseHelper.error(h, "VERIFICATIONREVOKED403");
    }

    // Revoke previous otp's of that user.
    await UserVerification.update({ is_revoked: true }, {
      where: {
        user_id: verificationExists.user.id,
      }
    });

    // Activate that user.
    await User.update({ is_active: true }, {
      where: {
        email,
      }
    });

    return responseHelper.success(h, "USERVERIFIED200");

  } catch (ex) {
    return responseHelper.error(h, "SERVER500", ex);
  }
}

const resendCode = async (req, h) => {
  try {

    const { email } = req.payload;

    // Check if user exists.
    const userExists = await User.findOne({
      where: {
        email,
      },
      raw: true,
      attributes: ['id', 'is_active'],
    });

    if (!userExists) {
      return responseHelper.error(h, "USER404");
    }

    if (userExists.is_active) {
      return responseHelper.error(h, "USERALREADYVERIFIED403");
    }

    // Revoke all the otp's for this user
    await UserVerification.update({
      is_revoked: true,
    }, {
      where: {
        user_id: userExists.id,
      }
    });

    // create a new one.
    const otp = userHelper.generateOtp();
    await UserVerification.create({
      otp,
      user_id: userExists.id,
    });

    mailHelper({
      to: email,
      subject: "Verification email",
      text: `Your otp is ${otp}`
    });

    return responseHelper.success(h, "USERRESEND200");

  } catch (ex) {
    return responseHelper.error(h, "SERVER500", ex);
  }
}

module.exports = {
  userLogin,
  userRegister,
  verifyUser,
  resendCode,
};
