import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const sendEmail = async ({ to, subject, html }) => {
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  const messageParts = [
    `From: "Waste System" <${process.env.EMAIL_USER}>`,
    `To: ${to}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: subject`,
    "",
    html,
  ];

  const message = messageParts.join("\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });
};

async function sendWasteFoundEmail(userEmail, userName, wasteDetails) {
  const subject = "New Waste Pickup Request Available";

  const html = `
    <p>Hello ${userName},</p>

    <p>A new waste pickup request has been posted that may match your capabilities.</p>

    <h3>Waste Details</h3>
    <ul>
      <li><strong>Type:</strong> ${wasteDetails.type}</li>
      <li><strong>Description:</strong> ${wasteDetails.description}</li>
      <li><strong>Status:</strong> ${wasteDetails.status}</li>
    </ul>

    <h3>Location Details</h3>
    <ul>
      <li><strong>Town:</strong> ${wasteDetails.town}</li>
      <li><strong>Area:</strong> ${wasteDetails.area}</li>
      <li><strong>Landmark:</strong> ${wasteDetails.landmark || "N/A"}</li>
      <li><strong>Map:</strong> <a href="${wasteDetails.mapLink}">View Location</a></li>
    </ul>

    <h3>Contact Information</h3>
    <ul>
      <li><strong>Name:</strong> ${wasteDetails.name}</li>
      <li><strong>Phone:</strong> ${wasteDetails.phone}</li>
      <li><strong>Email:</strong> ${wasteDetails.email}</li>
    </ul>

    ${
      wasteDetails.image
        ? `<p><strong>Image:</strong><br/><img src="${wasteDetails.image}" alt="Waste Image" width="300"/></p>`
        : ""
    }

    <p>Please log in to your dashboard to accept or reject this request.</p>

    <p>Regards,<br/>Waste Management Platform</p>
  `;

  await sendEmail({
    to: userEmail,
    subject,
    html,
  });
}

export default {
  sendWasteFoundEmail,
};