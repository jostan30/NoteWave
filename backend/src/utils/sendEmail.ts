import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333;">Your OTP Code</h2>
        <p style="font-size: 16px; color: #555;">
          Use the following OTP to complete your verification. This code is valid for <strong>10 minutes</strong>.
        </p>
        <div style="margin: 20px 0; text-align: center;">
          <span style="
            display: inline-block;
            padding: 15px 25px;
            font-size: 24px;
            font-weight: bold;
            color: #ffffff;
            background-color: #4CAF50;
            border-radius: 5px;
            letter-spacing: 2px;
          ">
            ${otp}
          </span>
        </div>
        <p style="font-size: 14px; color: #888;">
          If you did not request this, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #aaa;">
          &copy; ${new Date().getFullYear()} My App. All rights reserved.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"NoteWave" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    });

    console.log(`OTP sent to ${to}`);
  } catch (error) {
    console.error("Error sending email", error);
    throw error;
  }
};
