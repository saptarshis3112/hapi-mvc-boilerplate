const { authController } = require("../controllers");
const { auth } = require("../validations");

module.exports = {
  name: "auth",
  register: (server, options) => {

    const routes = [
      {
        method: "POST",
        path: "/auth/login",
        config: {
          auth: false,
          tags: ['api'],
          description: "User login route",
          handler: authController.userLogin,
          validate: {
            payload: auth.loginValidation,
          },
        }
      },
      {
        method: "POST",
        path: "/auth/register",
        config: {
          auth: false,
          tags: ['api'],
          description: "User register route",
          handler: authController.userRegister,
          validate: {
            payload: auth.registerValidation,
          }
        }
      },
      {
        method: "POST",
        path: "/auth/verify",
        config: {
          auth: false,
          tags: ['api'],
          description: "User verify route",
          handler: authController.verifyUser,
          validate: {
            payload: auth.verifyValidation,
          }
        }
      },
      {
        method: "POST",
        path: "/auth/resend",
        config: {
          auth: false,
          tags: ['api'],
          description: "User resend code route",
          handler: authController.resendCode,
          validate: {
            payload: auth.resendValidation,
          }
        }
      }
    ];

    server.route(routes);

  },
};
