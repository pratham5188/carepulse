import nodemailer from "nodemailer";

export interface AppointmentEmailData {
  toEmail: string;
  patientName: string;
  date: string;
  time: string;
  hospitalName: string;
  reason: string;
  doctorName?: string;
  appointmentId: number;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOTPEmail(toEmail: string, otp: string, userName?: string): Promise<boolean> {
  const fromEmail = process.env.GMAIL_USER;
  if (!fromEmail || !process.env.GMAIL_APP_PASSWORD) {
    console.error("[Email] Gmail credentials not configured");
    return false;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <tr>
            <td style="background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);padding:32px 32px 28px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="width:40px;height:40px;background-color:rgba(255,255,255,0.2);border-radius:10px;text-align:center;vertical-align:middle;font-size:22px;">
                    &#x2764;
                  </td>
                  <td style="padding-left:12px;">
                    <span style="font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Care</span><span style="font-size:24px;font-weight:700;color:rgba(255,255,255,0.85);letter-spacing:-0.5px;">Pulse</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 32px 8px;text-align:center;">
              <div style="width:56px;height:56px;margin:0 auto 16px;background-color:#fef2f2;border-radius:50%;line-height:56px;font-size:28px;">
                &#x1F512;
              </div>
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;">Password Reset</h1>
              <p style="margin:0;font-size:14px;color:#71717a;line-height:1.5;">
                ${userName ? `Hi ${userName},` : "Hi,"} we received a request to reset your password.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px;">
              <div style="background-color:#f9fafb;border:2px dashed #e4e4e7;border-radius:12px;padding:24px;text-align:center;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:1.5px;">Your OTP Code</p>
                <p style="margin:0;font-size:36px;font-weight:800;color:#ef4444;letter-spacing:8px;font-family:'Courier New',monospace;">${otp}</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffbeb;border-radius:8px;border:1px solid #fef3c7;">
                <tr>
                  <td style="padding:12px 16px;">
                    <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5;">
                      &#x23F0; This code expires in <strong>10 minutes</strong>.<br>
                      &#x26A0;&#xFE0F; Do not share this code with anyone.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 32px;">
              <p style="margin:0;font-size:13px;color:#a1a1aa;line-height:1.6;text-align:center;">
                If you didn't request a password reset, please ignore this email. Your account remains secure.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#fafafa;padding:20px 32px;border-top:1px solid #f4f4f5;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;">
                &copy; ${new Date().getFullYear()} CarePulse Healthcare Platform<br>
                This is an automated message. Please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"CarePulse" <${fromEmail}>`,
      to: toEmail,
      subject: `${otp} — CarePulse Password Reset Code`,
      text: `Your CarePulse password reset OTP is: ${otp}\n\nThis code expires in 10 minutes.\nDo not share this code with anyone.\n\nIf you didn't request this, please ignore this email.`,
      html,
    });
    console.log(`[Email] OTP sent to ${toEmail}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send OTP:", error);
    return false;
  }
}

export async function sendAppointmentConfirmationEmail(data: AppointmentEmailData): Promise<boolean> {
  const fromEmail = process.env.GMAIL_USER;
  if (!fromEmail || !process.env.GMAIL_APP_PASSWORD) {
    console.error("[Email] Gmail credentials not configured — skipping appointment email");
    return false;
  }

  const formattedDate = new Date(data.date).toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);padding:32px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="width:42px;height:42px;background-color:rgba(255,255,255,0.2);border-radius:10px;text-align:center;vertical-align:middle;font-size:24px;">
                    &#x2764;
                  </td>
                  <td style="padding-left:12px;">
                    <span style="font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Care</span><span style="font-size:26px;font-weight:700;color:rgba(255,255,255,0.80);letter-spacing:-0.5px;">Pulse</span>
                  </td>
                </tr>
              </table>
              <p style="margin:12px 0 0;color:rgba(255,255,255,0.85);font-size:14px;letter-spacing:0.5px;">Healthcare Analytics Platform</p>
            </td>
          </tr>

          <!-- Success icon + title -->
          <tr>
            <td style="padding:36px 32px 8px;text-align:center;">
              <div style="width:64px;height:64px;margin:0 auto 16px;background-color:#dcfce7;border-radius:50%;display:flex;align-items:center;justify-content:center;line-height:64px;font-size:32px;">
                &#x2705;
              </div>
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#18181b;">Appointment Confirmed!</h1>
              <p style="margin:0;font-size:15px;color:#71717a;line-height:1.6;">
                Hi <strong style="color:#18181b;">${data.patientName}</strong>, your appointment has been successfully booked.
              </p>
            </td>
          </tr>

          <!-- Appointment Details Card -->
          <tr>
            <td style="padding:24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8faff;border:1.5px solid #dbeafe;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="background-color:#eff6ff;padding:14px 20px;border-bottom:1px solid #dbeafe;">
                    <p style="margin:0;font-size:12px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:1.2px;">&#x1F4CB; Appointment Details</p>
                  </td>
                </tr>

                <!-- Date -->
                <tr>
                  <td style="padding:16px 20px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-top:2px;font-size:20px;">&#x1F4C5;</td>
                        <td style="padding-left:12px;">
                          <p style="margin:0;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">Date</p>
                          <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#18181b;">${formattedDate}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Time -->
                <tr>
                  <td style="padding:16px 20px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-top:2px;font-size:20px;">&#x23F0;</td>
                        <td style="padding-left:12px;">
                          <p style="margin:0;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">Time</p>
                          <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#18181b;">${data.time}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Hospital -->
                <tr>
                  <td style="padding:16px 20px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-top:2px;font-size:20px;">&#x1F3E5;</td>
                        <td style="padding-left:12px;">
                          <p style="margin:0;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">Hospital</p>
                          <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#18181b;">${data.hospitalName}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                ${data.doctorName ? `
                <!-- Doctor -->
                <tr>
                  <td style="padding:16px 20px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-top:2px;font-size:20px;">&#x1F468;&#x200D;&#x2695;&#xFE0F;</td>
                        <td style="padding-left:12px;">
                          <p style="margin:0;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">Doctor</p>
                          <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#18181b;">${data.doctorName}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>` : ""}

                <!-- Reason -->
                <tr>
                  <td style="padding:16px 20px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-top:2px;font-size:20px;">&#x1F4DD;</td>
                        <td style="padding-left:12px;">
                          <p style="margin:0;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">Reason for Visit</p>
                          <p style="margin:4px 0 0;font-size:14px;color:#374151;line-height:1.5;">${data.reason}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Appointment ID badge -->
          <tr>
            <td style="padding:0 32px 24px;text-align:center;">
              <span style="display:inline-block;background-color:#f0f9ff;border:1px solid #bae6fd;border-radius:20px;padding:6px 16px;font-size:12px;color:#0369a1;font-weight:600;">
                Appointment ID: #${data.appointmentId}
              </span>
            </td>
          </tr>

          <!-- Reminder box -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffbeb;border-radius:10px;border:1px solid #fef3c7;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;font-size:13px;color:#92400e;line-height:1.7;">
                      <strong>&#x1F4A1; Reminders:</strong><br>
                      &#x2022; Please arrive 10–15 minutes before your scheduled time.<br>
                      &#x2022; Bring a valid ID and any previous medical reports.<br>
                      &#x2022; To cancel or reschedule, log in to CarePulse → Appointments.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa;padding:20px 32px;border-top:1px solid #f4f4f5;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.7;">
                &copy; ${new Date().getFullYear()} CarePulse Healthcare Platform<br>
                This is an automated confirmation. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"CarePulse" <${fromEmail}>`,
      to: data.toEmail,
      subject: `✅ Appointment Confirmed — ${formattedDate} at ${data.time} | CarePulse`,
      text: `Hi ${data.patientName},\n\nYour appointment has been confirmed!\n\nDate: ${formattedDate}\nTime: ${data.time}\nHospital: ${data.hospitalName}${data.doctorName ? `\nDoctor: ${data.doctorName}` : ""}\nReason: ${data.reason}\nAppointment ID: #${data.appointmentId}\n\nPlease arrive 10–15 minutes early and bring a valid ID and previous medical reports.\n\nTo cancel or reschedule, log in to CarePulse → Appointments.\n\n— CarePulse Healthcare Platform`,
      html,
    });
    console.log(`[Email] Appointment confirmation sent to ${data.toEmail}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send appointment confirmation:", error);
    return false;
  }
}
