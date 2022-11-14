import User from "../models/User.js";
import { createTransport } from "nodemailer";
import bcrypt from "bcrypt";
import twilio from "twilio";
import log4js  from "log4js";

log4js.configure({
    appenders: {
      miLoggerConsole: { type: "console" },
      miLoggerFile: { type: "file", filename: "error.log" },
    },
    categories: {
      default: { appenders: ["miLoggerConsole"], level: "info" },
      error: { appenders: ["miLoggerFile"], level: "error" },
    },
});

const logger = log4js.getLogger();
const errorLogger = log4js.getLogger("error");

const USER_MAIL = "examplecoder24@gmail.com"; // PASS Coderhouse.123456
const PASS_MAIL = "zvybfprvfdbskakv";

const transporter = createTransport({
    service: "gmail",
    auth: {
      user: USER_MAIL,
      pass: PASS_MAIL,
    },
});

const createNewUser = async (username, password, email, direction, birthDate, phoneNumber, file) => {
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = new User({
    username,
    password: hashedPassword,
    email,
    direction,
    birthDate,
    phoneNumber,
    });

    if (file) {
        newUser.setImgUrl(file);
    }

    await newUser.save();
}

const newUserAdviceEmail = async (username, password, email, direction, birthDate, phoneNumber) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 8);

        const emailContent = {
          from: "Sitio Web",
          to: USER_MAIL,
          subject: "Nuevo registro",
          text: `Usuario: ${username}
                Contraseña: ${hashedPassword}
                Email: ${email}
                Dirección: ${direction}
                F. de nacimiento: ${birthDate}
                Teléfono: ${phoneNumber}`,
        };
        const info = await transporter.sendMail(emailContent);
        
        logger.info(info);

    } catch (err) {
        errorLogger.error(err);
    }
}

const sendEmail = async (username, email, productsOnCart) => {
    const user_email = email;
    const user_username = username;
    let productList = "";
    let p;

    for (p in productsOnCart) {
        productList += `• ${productsOnCart[p].quantity} - ${productsOnCart[p].title}`
    }

    try {
        const emailContent = {
          from: "Sitio Web",
          to: user_email,
          subject: `Nuevo pedido de ${user_username} / ${user_email}`,
          text: productList,
        };
        const info = transporter.sendMail(emailContent);
    } catch (err) {
        errorLogger.error(err);
    }
}

const sendMessage = async (number) => {
    try {
        const accountSid = "AC534ba76432f965c5909ac01251df04d9";
        const authToken = "0175e38ffd54d994f88e458f07be5b69";
    
        const client = twilio(accountSid, authToken);
    
        const message = await client.messages.create({
          body: "Su pedido ha sido recibido y se encuentra en proceso de envío",
          from: "+14699604183",
          to: `+${number}`,
        });
    } catch (err) {
        errorLogger.error(err);
    }
}

export { createNewUser, newUserAdviceEmail, sendEmail, sendMessage };