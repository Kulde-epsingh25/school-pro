import { Resend } from 'resend';

// Use a placeholder if not set, or we can just instantiate conditionally
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export const sendVerificationEmail = async (email: string, magicLink: string, schoolName: string) => {
  console.log("=========================================================");
  console.log(`[MAGIC LINK - DEV ACCESS] To: ${email}`);
  console.log(`[MAGIC LINK] Link: ${magicLink}`);
  console.log("=========================================================");

  if (!process.env.RESEND_API_KEY) {
    return { success: true, mock: true };

  }

  try {
    const data = await resend.emails.send({
      from: 'School Pro <onboarding@resend.dev>', // Use resend test domain if no verified domain
      to: email,
      subject: `Welcome to School Pro - Verify your ${schoolName} account`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Welcome to School Pro!</h2>
          <p style="color: #555; font-size: 16px;">
            Thank you for registering <strong>${schoolName}</strong> on School Pro. We are excited to have you onboard.
          </p>
          <p style="color: #555; font-size: 16px;">
            To complete your setup and activate your admin account, please click the verification button below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLink}" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
              Verify Account & Setup Password
            </a>
          </div>
          <p style="color: #555; font-size: 14px; text-align: center;">
            Or copy and paste this link into your browser:<br/>
            <a href="${magicLink}" style="color: #2563eb; word-break: break-all;">${magicLink}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">
            This link will expire in 24 hours. If you did not request this, please ignore this email.
          </p>
        </div>
      `,
    });

    console.log(`[RESEND EMAIL] Sent successfully to ${email}`);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, error };
  }
};

export const sendAttendanceNotificationEmail = async (
  parentEmail: string,
  studentName: string,
  status: 'ABSENT' | 'LATE',
  dateString: string,
  schoolName: string
) => {
  if (!process.env.RESEND_API_KEY) {
    console.log("=========================================================");
    console.log(`[MOCK EMAIL - No RESEND_API_KEY] To: ${parentEmail}`);
    console.log(`[MOCK EMAIL] Subject: Attendance Alert: ${studentName} is ${status} today`);
    console.log(`[MOCK EMAIL] Body: This is to inform you that ${studentName} was marked ${status} on ${dateString} at ${schoolName}.`);
    console.log("=========================================================");
    return { success: true, mock: true };
  }

  const isAbsent = status === 'ABSENT';

  try {
    const data = await resend.emails.send({
      from: 'School Pro <attendance@resend.dev>', // Use resend test domain if no verified domain
      to: parentEmail,
      subject: `Attendance Alert: ${studentName} is ${isAbsent ? 'Absent' : 'Late'} Today`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: ${isAbsent ? '#dc2626' : '#d97706'}; text-align: center;">Attendance Alert</h2>
          <p style="color: #555; font-size: 16px;">Dear Parent,</p>
          <p style="color: #555; font-size: 16px;">
            This is an automated notification from <strong>${schoolName}</strong> to inform you that your child, <strong>${studentName}</strong>, 
            was marked <strong>${isAbsent ? 'ABSENT' : 'LATE'}</strong> today (${dateString}).
          </p>
          <p style="color: #555; font-size: 16px;">
            If you have already notified the school or have a valid excuse, please disregard this message or reply to this email to provide a reason.
          </p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated message. Please contact the school office if you have any questions.
          </p>
        </div>
      `,
    });

    console.log(`[RESEND EMAIL] Attendance alert sent successfully to ${parentEmail}`);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send attendance email:", error);
    return { success: false, error };
  }
};

