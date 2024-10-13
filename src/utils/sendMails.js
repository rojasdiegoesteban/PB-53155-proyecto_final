import nodemailer from "nodemailer";
import envs from "../config/env.config.js";

export const sendMail = async (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "sosaesteban49@gmail.com",
      pass: envs.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: "sosaesteban49@gmail.com",
    to: email,
    subject,
    text: message,
  });
};
