export async function sendOTPSMS(phone: string, otp: string, userName?: string): Promise<boolean> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.error("[SMS] Fast2SMS API key not configured");
    return false;
  }

  const cleanPhone = phone.replace(/\D/g, "").replace(/^91/, "");
  if (cleanPhone.length !== 10) {
    console.error("[SMS] Invalid phone number:", phone);
    return false;
  }

  const message = `Your CarePulse verification code is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`;

  try {
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message,
        language: "english",
        flash: 0,
        numbers: cleanPhone,
      }),
    });

    const data = await res.json();

    if (data.return === true || data.status_code === 200) {
      console.log(`[SMS] OTP sent to ${cleanPhone}`);
      return true;
    } else {
      console.error("[SMS] Fast2SMS error:", data.message || JSON.stringify(data));
      return false;
    }
  } catch (error) {
    console.error("[SMS] Failed to send OTP:", error);
    return false;
  }
}
