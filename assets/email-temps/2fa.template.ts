export const twoFactorTemplate = (name: string, code: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your NextOne 2FA Code</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      background: #f4f8fb;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      background: #fff;
      max-width: 480px;
      margin: 40px auto;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      padding: 32px 24px;
    }
    .logo {
      text-align: center;
      margin-bottom: 24px;
    }
    .logo img {
      height: 48px;
    }
    .title {
      color: #1976d2;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 12px;
    }
    .message {
      color: #333;
      font-size: 16px;
      text-align: center;
      margin-bottom: 24px;
    }
    .code-box {
      background: #f4f8fb;
      border-radius: 8px;
      padding: 18px 0;
      text-align: center;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #1976d2;
      margin-bottom: 24px;
      border: 1.5px dashed #1976d2;
    }
    .footer {
      text-align: center;
      color: #90a4ae;
      font-size: 13px;
      margin-top: 32px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://i.ibb.co/4Y8Qw1N/nextone-logo.png" alt="NextOne Logo" />
    </div>
    <div class="title">Your 2FA Verification Code</div>
    <div class="message">
      Hi <b>${name}</b>,<br>
      Use the code below to complete your login to NextOne.<br>
      This code is valid for <b>10 minutes</b>.
    </div>
    <div class="code-box">${code}</div>
    <div class="message" style="font-size:14px;">
      If you did not request this code, you can safely ignore this email.<br>
      Need help? Contact our support team.
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} NextOne. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
