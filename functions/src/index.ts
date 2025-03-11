import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

interface Appointment {
  userEmail: string;
  date: string;
}

export const sendAppointmentEmail =
  functions.firestore.document("appointments/{appointmentId}")
    .onCreate(
      (snap: functions.firestore.DocumentSnapshot) => {
        const appointment = snap.data() as Appointment;
        if (
          !appointment ||
          !appointment.userEmail ||
          !appointment.date
        ) {
          console.error(
            "Missing userEmail or date in appointment data."
          );
          return null;
        }
        const mailOptions = {
          from:
            "\"Your App\" <" + gmailEmail + ">",
          to: appointment.userEmail,
          subject: "Appointment Confirmation",
          text:
            "Hello, your appointment is confirmed for " +
            appointment.date +
            ".",
          html:
            "<p>Hello, your appointment is confirmed for<br>" +
            "<strong>" +
            appointment.date +
            "</strong>.</p>",
        };
        return transporter
          .sendMail(mailOptions)
          .then(() => {
            console.log("Email sent successfully!");
          })
          .catch((error: Error) => {
            console.error("Error sending email:", error);
          });
      }
    );
