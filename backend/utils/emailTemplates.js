export const getWelcomeEmailHtml = (firstName, otp) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Kingsplug Exchange</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #1a1a1a;
      margin: 0;
      padding: 0;
      color: #e0e0e0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #252525;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      border: 1px solid #333;
    }
    .header {
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      letter-spacing: 1px;
    }
    .content {
      padding: 40px 30px;
      text-align: left;
    }
    .greeting {
      font-size: 20px;
      color: #ffffff;
      margin-bottom: 20px;
    }
    .message {
      font-size: 16px;
      line-height: 1.6;
      color: #cccccc;
      margin-bottom: 30px;
    }
    .otp-container {
      text-align: center;
      margin: 30px 0;
    }
    .otp-code {
      font-family: 'Courier New', monospace;
      font-size: 36px;
      font-weight: bold;
      color: #9580ff; /* Brand color matching frontend button */
      letter-spacing: 5px;
      background-color: #1a1a1a;
      padding: 15px 30px;
      border-radius: 8px;
      border: 1px dashed #444;
      display: inline-block;
    }
    .expiry {
      text-align: center;
      font-size: 14px;
      color: #888888;
      margin-top: 10px;
    }
    .footer {
      background-color: #151515;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666666;
      border-top: 1px solid #333;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #9580ff;
      color: #000000;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Kingsplug Exchange</h1>
    </div>
    <div class="content">
      <div class="greeting">Hi ${firstName},</div>
      <p class="message">
        Welcome to Kingsplug Exchange! We are excited to have you on board.
        To complete your registration, please use the verification code below:
      </p>
      
      <div class="otp-container">
        <div class="otp-code">${otp}</div>
        <div class="expiry">This code will expire in 10 minutes.</div>
      </div>
      
      <p class="message">
        If you didn't request this email, you can safely ignore it.
      </p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Kingsplug Exchange. All rights reserved.<br>
      Automated message, please do not reply.
    </div>
  </div>
</body>
</html>
  `;
};

export const getOtpEmailHtml = (otp) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #1a1a1a;
      margin: 0;
      padding: 0;
      color: #e0e0e0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #252525;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      border: 1px solid #333;
    }
    .header {
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      letter-spacing: 1px;
    }
    .content {
      padding: 40px 30px;
      text-align: left;
    }
    .greeting {
      font-size: 20px;
      color: #ffffff;
      margin-bottom: 20px;
    }
    .message {
      font-size: 16px;
      line-height: 1.6;
      color: #cccccc;
      margin-bottom: 30px;
    }
    .otp-container {
      text-align: center;
      margin: 30px 0;
    }
    .otp-code {
      font-family: 'Courier New', monospace;
      font-size: 36px;
      font-weight: bold;
      color: #9580ff;
      letter-spacing: 5px;
      background-color: #1a1a1a;
      padding: 15px 30px;
      border-radius: 8px;
      border: 1px dashed #444;
      display: inline-block;
    }
    .expiry {
      text-align: center;
      font-size: 14px;
      color: #888888;
      margin-top: 10px;
    }
    .footer {
      background-color: #151515;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666666;
      border-top: 1px solid #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Kingsplug Exchange</h1>
    </div>
    <div class="content">
      <div class="greeting">Hello,</div>
      <p class="message">
        You requested a verification code for your Kingsplug Exchange account.
        Please use the code below to proceed:
      </p>
      
      <div class="otp-container">
        <div class="otp-code">${otp}</div>
        <div class="expiry">This code will expire in 10 minutes.</div>
      </div>
      
      <p class="message">
        If you didn't request this action, please secure your account immediately.
      </p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Kingsplug Exchange. All rights reserved.<br>
      Automated message, please do not reply.
    </div>
  </div>
</body>
</html>
  `;
};

export const getResetPasswordEmailHtml = (firstName, resetLink) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #1a1a1a;
      margin: 0;
      padding: 0;
      color: #e0e0e0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #252525;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      border: 1px solid #333;
    }
    .header {
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      letter-spacing: 1px;
    }
    .content {
      padding: 40px 30px;
      text-align: left;
    }
    .greeting {
      font-size: 20px;
      color: #ffffff;
      margin-bottom: 20px;
    }
    .message {
      font-size: 16px;
      line-height: 1.6;
      color: #cccccc;
      margin-bottom: 30px;
    }
    .btn-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      padding: 15px 30px;
      background-color: #9580ff;
      color: #000000;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      transition: background-color 0.3s;
    }
    .expiry {
      text-align: center;
      font-size: 14px;
      color: #888888;
      margin-top: 10px;
    }
    .footer {
      background-color: #151515;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666666;
      border-top: 1px solid #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Kingsplug Exchange</h1>
    </div>
    <div class="content">
      <div class="greeting">Hi ${firstName},</div>
      <p class="message">
        We received a request to reset your password for your Kingsplug Exchange account.
        Click the button below to set a new password:
      </p>
      
      <div class="btn-container">
        <a href="${resetLink}" class="button">Reset Password</a>
        <div class="expiry">This link will expire in 1 hour.</div>
      </div>
      
      <p class="message">
        If you didn't request a password reset, you can safely ignore this email.
        Your password will remain unchanged.
      </p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Kingsplug Exchange. All rights reserved.<br>
      Automated message, please do not reply.
    </div>
  </div>
</body>
</html>
  `;
};

