export const verifyEmailTemplate = (name: string, verificationLink: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        /* Reset styles for email clients */
        body, table, td, a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
        }

        /* Basic styles */
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            background-color: #f8f9fa;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 24px;
            background-color: #0d6efd;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .header h1 {
            margin: 0;
            color: #ffffff;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 32px 24px;
            background-color: #ffffff;
        }
        .content h2 {
            margin: 0 0 16px;
            color: #1a1a1a;
            font-size: 20px;
            font-weight: 500;
        }
        .content p {
            margin: 0 0 16px;
            color: #4a4a4a;
            font-size: 16px;
            line-height: 1.6;
        }
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 32px;
            background-color: #0d6efd;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 16px;
            transition: background-color 0.2s;
        }
        .button:hover {
            background-color: #0b5ed7;
        }
        .link-container {
            padding: 16px;
            background-color: #f8f9fa;
            border-radius: 6px;
            margin: 16px 0;
        }
        .link-text {
            word-break: break-all;
            font-family: monospace;
            font-size: 14px;
            color: #0d6efd;
        }
        .footer {
            text-align: center;
            padding: 24px;
            background-color: #f8f9fa;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            border-top: 1px solid #e9ecef;
        }
        .footer p {
            margin: 0 0 8px;
            color: #6c757d;
            font-size: 14px;
        }
        .footer p:last-child {
            margin-bottom: 0;
        }
        @media only screen and (max-width: 480px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            .header {
                border-radius: 0;
            }
            .content {
                padding: 24px 16px;
            }
            .button {
                display: block;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Email Verification</h1>
        </div>
        <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
            <p>Click the button below to verify your email address:</p>
            <div class="button-container">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <div class="link-container">
                <span class="link-text">${verificationLink}</span>
            </div>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} W-Mart. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;