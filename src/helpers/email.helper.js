const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "percival.conroy77@ethereal.email",
    pass: "RdR5AkDp4mh9QVPrhJ",
  },
});

const send = (info) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await transporter.sendMail(info);

      console.log("Message sent: %s", result.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      resolve(result);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const emailProcessor = ({ email, pin, type }) => {
  let info = "";
  switch (type) {
    case "request-new-password":
      info = {
        from: " 'Mahac MMC' <percival.conroy77@ethereal.email>", // sender address
        to: email, // list of receivers
        subject: "Password reset pin From MahacMMC", // Subject line
        text:
          "Your password reset pin for " +
          email +
          " is " +
          pin +
          " , This pin is going to expire in 1 day", // plain text body
        html: `<b>Hello world?</b>
    This is your pin for reset passsword for user ${email}, This will expire in 1 day
    <b>${pin}</b>`, // html body
      };
      send(info);
      break;

    case "password-update-success":
      info = {
        from: " 'Mahac MMC' <percival.conroy77@ethereal.email>", // sender address
        to: email, // list of receivers
        subject: "Password has been updated", // Subject line
        text: "Your password has been updated", // plain text body
        html: `<b>Hello</b>
                <p>Your password has been updated</p>`, // html body
      };
      send(info);
      break;
    default:
      break;
  }
};

module.exports = {
  emailProcessor,
};
