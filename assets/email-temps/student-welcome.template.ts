export const studentWelcomeTemplate = (name: string): string => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to NextOne!</title>
          <style>
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  background-color: #f4f8fb;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  background: #fff;
                  max-width: 500px;
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
              .welcome-title {
                  color: #1a237e;
                  font-size: 28px;
                  font-weight: bold;
                  text-align: center;
                  margin-bottom: 12px;
              }
              .welcome-message {
                  color: #333;
                  font-size: 18px;
                  text-align: center;
                  margin-bottom: 24px;
              }
              .cta-button {
                  display: block;
                  width: 80%;
                  margin: 0 auto 24px auto;
                  background: #1976d2;
                  color: #fff;
                  text-decoration: none;
                  text-align: center;
                  padding: 14px 0;
                  border-radius: 8px;
                  font-size: 18px;
                  font-weight: 600;
                  transition: background 0.2s;
              }
              .cta-button:hover {
                  background: #1565c0;
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
              <div class="welcome-title">Welcome to NextOne, ${name}!</div>
              <div class="welcome-message">
                  We're excited to have you join our learning community.<br>
                  Your account is now active and you can start exploring courses, roadmaps, and more.
              </div>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="cta-button">
                  Go to Dashboard
              </a>
              <div class="footer">
                  If you have any questions, feel free to contact our support team.<br>
                  &copy; ${new Date().getFullYear()} NextOne. All rights reserved.
              </div>
          </div>
      </body>
      </html>
    `;
}