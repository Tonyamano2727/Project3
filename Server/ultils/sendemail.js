const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendmail = asyncHandler(
  async ({
    to,
    customerName,
    serviceName,
    date,
    timeSlot,
    quantity,
    notes,
    totalPrice,
  }) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const formattedTotalPrice = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(totalPrice);

    const htmlContent = `
    <h2>Booking a successful service</h2>
    <p>Hello ${customerName},</p>
    <p>We have received a booking request: ${serviceName}.</p>
    <h3>Order Information</h3>
    <ul>
      <li><strong>Customer Name:</strong> ${customerName}</li>
      <li><strong>Service:</strong> ${serviceName}</li>
      <li><strong>Day:</strong> ${date}</li>
      <li><strong>Hour:</strong> ${timeSlot}</li>
      <li><strong>Amount:</strong> ${quantity}</li>
      <li><strong>Notes:</strong> ${notes}</li>
      <li><strong>Total Price of Service:</strong> ${formattedTotalPrice}</li>
    </ul>
    <p>Thank you for using our service!</p>
  `;

    let info = await transporter.sendMail({
      from: '"Cleanhouse" <no-reply@Cleanhouse.com>',
      to: to.join(","),
      subject: "Cleanhouse booking service",
      html: htmlContent,
    });

    return info;
  }
);

module.exports = sendmail;
