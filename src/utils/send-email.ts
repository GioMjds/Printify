import nodemailer from "nodemailer";

export async function sendOtpEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Printify OTP Code</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&display=swap');
            body {
                font-family: 'Lexend', sans-serif;
                background: linear-gradient(135deg, #0E2148 0%, #7965C1 100%);
                color: #0E2148;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 520px;
                margin: 40px auto;
                background: #fff;
                border-radius: 24px;
                box-shadow: 0 8px 32px rgba(14,33,72,0.10);
                overflow: hidden;
                border: 1.5px solid #7965C1;
            }
            .header {
                background: linear-gradient(135deg, #483AA0 0%, #7965C1 100%);
                padding: 36px 32px 24px 32px;
                text-align: center;
            }
            .logo {
                width: 60px;
                height: 60px;
                margin: 0 auto 18px auto;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #fff;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(72,58,160,0.10);
            }
            .logo img {
                width: 40px;
                height: 40px;
            }
            .header-title {
                font-size: 2rem;
                font-weight: 700;
                color: #fff;
                margin-bottom: 6px;
                letter-spacing: 1px;
            }
            .header-desc {
                color: #E3D095;
                font-size: 1rem;
                font-weight: 400;
            }
            .content {
                padding: 40px 32px 32px 32px;
                text-align: center;
                background: #fff;
            }
            .greeting {
                font-size: 1.15rem;
                color: #483AA0;
                font-weight: 600;
                margin-bottom: 18px;
            }
            .message {
                font-size: 1rem;
                color: #483AA0;
                margin-bottom: 32px;
                line-height: 1.7;
            }
            .otp-box {
                background: linear-gradient(135deg, #E3D095 0%, #7965C1 100%);
                border-radius: 16px;
                padding: 28px 0;
                margin: 28px 0 18px 0;
                box-shadow: 0 2px 12px rgba(72,58,160,0.08);
            }
            .otp-label {
                font-size: 0.95rem;
                color: #483AA0;
                font-weight: 500;
                margin-bottom: 10px;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            .otp-code {
                font-size: 2.2rem;
                font-weight: 700;
                color: #0E2148;
                text-align: center;
                letter-spacing: 12px;
                font-family: 'Monaco', 'Consolas', monospace;
                background: #fff;
                border-radius: 8px;
                display: inline-block;
                padding: 8px 24px;
                margin-top: 8px;
                box-shadow: 0 1px 4px rgba(14,33,72,0.07);
            }
            .security-note {
                background: #f8f7fa;
                border-left: 4px solid #7965C1;
                padding: 18px 18px 18px 24px;
                margin: 24px 0 0 0;
                border-radius: 0 10px 10px 0;
                font-size: 0.98rem;
                color: #483AA0;
                text-align: left;
            }
            .footer {
                background: linear-gradient(135deg, #E3D095 0%, #7965C1 100%);
                padding: 24px 32px;
                text-align: center;
            }
            .footer-content {
                color: #0E2148;
                font-size: 0.98rem;
                font-weight: 500;
            }
            .footer-message {
                margin-top: 12px;
                font-size: 0.92rem;
                color: #483AA0;
                opacity: 0.85;
            }
            @media (max-width: 600px) {
                .container { margin: 10px; border-radius: 16px; }
                .content, .footer, .header { padding-left: 12px; padding-right: 12px; }
                .otp-code { font-size: 1.4rem; letter-spacing: 6px; padding: 6px 12px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="header-title">Printify</div>
                <div class="header-desc">Your Print on Demand Partner</div>
            </div>
            <div class="content">
                <div class="greeting">Hello and welcome to Printify!</div>
                <div class="message">
                    We're excited to have you join our creative community. To complete your account verification and start designing, please use the code below.
                </div>
                <div class="otp-box">
                    <div class="otp-label">Your Verification Code</div>
                    <div class="otp-code">${otp}</div>
                </div>
                <div class="security-note">
                    <strong>Security Note:</strong> This code will expire in 10 minutes. Never share this code with anyone. Printify will never ask for your verification code via phone or email.
                </div>
            </div>
            <div class="footer">
                <div class="footer-content">
                    Welcome to Printify!<br>
                    Let your creativity shine and bring your ideas to life.
                </div>
                <div class="footer-message">
                    © ${new Date().getFullYear()} Printify. Your Print on Demand Partner.
                </div>
            </div>
        </div>
    </body>
    </html>`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🖨️ Your Printify Verification Code - Welcome to Print on Demand!",
    html: htmlTemplate,
    text: `
        Welcome to Printify!

        Your verification code is: ${otp}

        This code will expire in 10 minutes. Please use it to complete your account verification.

        Never share this code with anyone. Printify will never ask for your verification code via phone or email.

        Let your creativity shine and bring your ideas to life!

        © ${new Date().getFullYear()} | Printify`,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPassswordResetEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Printify Password Reset</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&display=swap');
            body {
                font-family: 'Lexend', sans-serif;
                background: linear-gradient(135deg, #0E2148 0%, #7965C1 100%);
                color: #0E2148;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 520px;
                margin: 40px auto;
                background: #fff;
                border-radius: 24px;
                box-shadow: 0 8px 32px rgba(14,33,72,0.10);
                overflow: hidden;
                border: 1.5px solid #7965C1;
            }
            .header {
                background: linear-gradient(135deg, #483AA0 0%, #7965C1 100%);
                padding: 36px 32px 24px 32px;
                text-align: center;
            }
            .header-title {
                font-size: 2rem;
                font-weight: 700;
                color: #fff;
                margin-bottom: 6px;
                letter-spacing: 1px;
            }
            .header-desc {
                color: #E3D095;
                font-size: 1rem;
                font-weight: 400;
            }
            .content {
                padding: 40px 32px 32px 32px;
                text-align: center;
                background: #fff;
            }
            .greeting {
                font-size: 1.15rem;
                color: #483AA0;
                font-weight: 600;
                margin-bottom: 18px;
            }
            .message {
                font-size: 1rem;
                color: #483AA0;
                margin-bottom: 32px;
                line-height: 1.7;
            }
            .otp-box {
                background: linear-gradient(135deg, #E3D095 0%, #7965C1 100%);
                border-radius: 16px;
                padding: 28px 0;
                margin: 28px 0 18px 0;
                box-shadow: 0 2px 12px rgba(72,58,160,0.08);
            }
            .otp-label {
                font-size: 0.95rem;
                color: #483AA0;
                font-weight: 500;
                margin-bottom: 10px;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            .otp-code {
                font-size: 2.2rem;
                font-weight: 700;
                color: #0E2148;
                text-align: center;
                letter-spacing: 12px;
                font-family: 'Monaco', 'Consolas', monospace;
                background: #fff;
                border-radius: 8px;
                display: inline-block;
                padding: 8px 24px;
                margin-top: 8px;
                box-shadow: 0 1px 4px rgba(14,33,72,0.07);
            }
            .security-note {
                background: #f8f7fa;
                border-left: 4px solid #7965C1;
                padding: 18px 18px 18px 24px;
                margin: 24px 0 0 0;
                border-radius: 0 10px 10px 0;
                font-size: 0.98rem;
                color: #483AA0;
                text-align: left;
            }
            .footer {
                background: linear-gradient(135deg, #E3D095 0%, #7965C1 100%);
                padding: 24px 32px;
                text-align: center;
            }
            .footer-content {
                color: #0E2148;
                font-size: 0.98rem;
                font-weight: 500;
            }
            .footer-message {
                margin-top: 12px;
                font-size: 0.92rem;
                color: #483AA0;
                opacity: 0.85;
            }
            @media (max-width: 600px) {
                .container { margin: 10px; border-radius: 16px; }
                .content, .footer, .header { padding-left: 12px; padding-right: 12px; }
                .otp-code { font-size: 1.4rem; letter-spacing: 6px; padding: 6px 12px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="header-title">Printify</div>
                <div class="header-desc">Password Reset Request</div>
            </div>
            <div class="content">
                <div class="greeting">Hello,</div>
                <div class="message">
                    We received a request to reset your password for your Printify account.<br>
                    If you did not make this request, you can safely ignore this email.<br><br>
                    To reset your password, please use the code below:
                </div>
                <div class="otp-box">
                    <div class="otp-label">Your Password Reset Code</div>
                    <div class="otp-code">${otp}</div>
                </div>
                <div class="security-note">
                    <strong>Security Note:</strong> This code will expire in 10 minutes. If you did not request a password reset, please ignore this email or contact Printify support.
                </div>
            </div>
            <div class="footer">
                <div class="footer-content">
                    Thank you for using Printify!<br>
                    Your Print on Demand Partner.
                </div>
                <div class="footer-message">
                    © ${new Date().getFullYear()} Printify. All rights reserved.
                </div>
            </div>
        </div>
    </body>
    </html>`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🔒 Password Reset Request - Printify",
    html: htmlTemplate,
    text: `
            Hello, We received a request to reset your password for your Printify account. If you did not make this request, please ignore this email.

            Your password reset code is: ${otp}

            Thank you,
            Printify Support
        `,
  };

  await transporter.sendMail(mailOptions);
}

export async function contactUsEmail(name: string, email: string, subject: string, message: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: { rejectUnauthorized: false },
    });

    const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&display=swap');
                body {
                    font-family: 'Lexend', sans-serif;
                    background: linear-gradient(135deg, #0E2148 0%, #7965C1 100%);
                    color: #0E2148;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background: #fff;
                    border-radius: 24px;
                    box-shadow: 0 8px 32px rgba(14,33,72,0.10);
                    overflow: hidden;
                    border: 1.5px solid #7965C1;
                }
                .header {
                    background: linear-gradient(135deg, #483AA0 0%, #7965C1 100%);
                    padding: 36px 32px 24px 32px;
                    text-align: center;
                }
                .header-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 6px;
                    letter-spacing: 1px;
                }
                .header-desc {
                    color: #E3D095;
                    font-size: 1rem;
                    font-weight: 400;
                }
                .content {
                    padding: 40px 32px 32px 32px;
                    text-align: left;
                    background: #fff;
                }
                .field {
                    margin-bottom: 20px;
                }
                .field-label {
                    font-size: 0.95rem;
                    color: #483AA0;
                    font-weight: 600;
                    margin-bottom: 5px;
                    display: block;
                }
                .field-value {
                    font-size: 1rem;
                    color: #0E2148;
                    padding: 12px;
                    background: #f8f7fa;
                    border-radius: 8px;
                    border-left: 4px solid #7965C1;
                }
                .footer {
                    background: linear-gradient(135deg, #E3D095 0%, #7965C1 100%);
                    padding: 24px 32px;
                    text-align: center;
                }
                .footer-message {
                    font-size: 0.92rem;
                    color: #483AA0;
                    opacity: 0.85;
                }
                @media (max-width: 600px) {
                    .container { margin: 10px; border-radius: 16px; }
                    .content, .footer, .header { padding-left: 12px; padding-right: 12px; }
                }
            </style>
        <body>
        </head>
            <div class="container">
                <div class="header">
                    <div class="header-title">Printify</div>
                    <div class="header-desc">New Contact Form Submission</div>
                </div>
                <div class="content">
                    <div class="field">
                        <span class="field-label">From:</span>
                        <div class="field-value">${name}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">Email:</span>
                        <div class="field-value">${email}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">Subject:</span>
                        <div class="field-value">${subject}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">Message:</span>
                        <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
                    </div>
                </div>
                <div class="footer">
                    <div class="footer-message">
                        © ${new Date().getFullYear()} Printify. Your Print on Demand Partner.
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `📩 Contact Us Form Submission from ${name}`,
        html: htmlTemplate,
        text: `
            You have received a new contact form submission from ${name} (${email}).

            Message:
            ${message}
        `,
    };

    await transporter.sendMail(mailOptions);
}