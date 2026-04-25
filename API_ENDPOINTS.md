# Backend API Endpoints Documentation

## Base URL
```
http://localhost:[PORT]/api/users
```

---

## 📝 Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /register`  
**Authentication:** ❌ Not Required  
**Description:** Create a new user account

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, must be valid email)",
  "password": "string (required, minimum 8 characters)",
  "isAdmin": "boolean (optional, default: false)"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  },
  "message": "user created successfully",
  "success": true
}
```

---

### 2. Login User
**Endpoint:** `POST /login`  
**Authentication:** ❌ Not Required  
**Description:** Login with email and password. If 2FA is enabled, returns OTP message

**Request Body:**
```json
{
  "email": "string (required, must be valid email)",
  "password": "string (required, minimum 8 characters)"
}
```

**Response (200) - Without 2FA:**
```json
{
  "statusCode": 200,
  "data": {
    "name": "string",
    "email": "string",
    "role": "user|admin"
  },
  "message": "login Successfully",
  "success": true
}
```

**Response (200) - With 2FA Enabled:**
```json
{
  "statusCode": 200,
  "data": {
    "email": "string",
    "is2FAEnable": true
  },
  "message": "OTP sent to your email",
  "success": true
}
```

---

### 3. Verify 2FA OTP (Login)
**Endpoint:** `POST /verify2faOtp`  
**Authentication:** ✅ Access Token Required (in header)  
**Description:** Verify 2FA OTP sent during login

**Request Body:**
```json
{
  "email": "string (required)",
  "otp": "string (required, 6 digits)"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "name": "string",
    "email": "string",
    "role": "user|admin",
    "accessToken": "string",
    "refreshToken": "string"
  },
  "message": "login Successfully",
  "success": true
}
```

---

### 4. Resend 2FA OTP
**Endpoint:** `POST /resend2faOtp`  
**Authentication:** ✅ Access Token Required (in header)  
**Description:** Resend 2FA OTP if not received

**Request Body:**
```json
{}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "email": "string"
  },
  "message": "2FA OTP resent successfully",
  "success": true
}
```

---

## 🔐 Email Verification Endpoints

### 5. Send Email Verification OTP
**Endpoint:** `POST /getVerifyEmailOTP`  
**Authentication:** ✅ Access Token Required (in header)  
**Description:** Send OTP to verify user email

**Request Body:**
```json
{}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "emailVerified": "boolean"
  },
  "message": "email sent successfully",
  "success": true
}
```

---

### 6. Verify Email OTP
**Endpoint:** `POST /verifyEmailOTP`  
**Authentication:** ✅ Access Token Required (in header)  
**Description:** Verify email with OTP

**Request Body:**
```json
{
  "otp": "string (required, 6 digits)"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "emailVerified": true
  },
  "message": "email verified successfully",
  "success": true
}
```

---

### 7. Resend Email Verification OTP
**Endpoint:** `POST /resendVerifyEmailOTP`  
**Authentication:** ✅ Access Token Required (in header)  
**Description:** Resend email verification OTP if not received

**Request Body:**
```json
{}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string"
  },
  "message": "email OTP resent successfully",
  "success": true
}
```

---

## 🔑 Password Management Endpoints

### 8. Change Password
**Endpoint:** `POST /changePassword`  
**Authentication:** ✅ Access Token Required (in header)  
**Description:** Change password for authenticated user

**Request Body:**
```json
{
  "oldPassword": "string (required)",
  "newPassword": "string (required, minimum 8 characters)",
  "conformNewPassword": "string (required)"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": "password changed successfully",
  "message": "password changed successfully",
  "success": true
}
```

---

### 9. Forgot Password
**Endpoint:** `POST /forgotPassword`  
**Authentication:** ❌ Not Required  
**Description:** Request password reset OTP via email

**Request Body:**
```json
{
  "email": "string (required, must be valid email)"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "email": "string"
  },
  "message": "OTP sent to your email for password reset",
  "success": true
}
```

---

### 10. Resend Forgot Password OTP
**Endpoint:** `POST /resendForgotPasswordOTP`  
**Authentication:** ❌ Not Required  
**Description:** Resend password reset OTP if not received

**Request Body:**
```json
{
  "email": "string (required)"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "email": "string"
  },
  "message": "OTP resent successfully",
  "success": true
}
```

---

### 11. Reset Password
**Endpoint:** `POST /resetPassword`  
**Authentication:** ❌ Not Required  
**Description:** Reset password using email, OTP, and new password

**Request Body:**
```json
{
  "email": "string (required)",
  "otp": "string (required, 6 digits)",
  "password": "string (required, minimum 8 characters)",
  "conformPassword": "string (required)"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": "password reset successfully",
  "message": "password reset successfully",
  "success": true
}
```

---

## 👤 Profile Management Endpoints

### 12. Get User Profile
**Endpoint:** `GET /profile`  
**Authentication:** ✅ Access Token Required (in header)  
**Description:** Get authenticated user's profile information

**Request Body:**
```json
{}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "user|admin",
    "emailVerified": "boolean",
    "is2FAEnable": "boolean"
  },
  "message": "user profile",
  "success": true
}
```

---

### 13. Update User Profile
**Endpoint:** `POST /profile`  
**Authentication:** ✅ Access Token Required (in header)  
**Description:** Update user name or request email change (with OTP)

**Request Body:**
```json
{
  "name": "string (optional)" 
}
```

OR

```json
{
  "email": "string (optional, new email)"
}
```

**Response (200) - Update Name:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "string",
    "name": "string (updated)",
    "email": "string"
  },
  "message": "user updated successfully",
  "success": true
}
```

**Response (200) - Change Email:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string"
  },
  "message": "email sent successfully",
  "success": true
}
```

---

### 14. Verify Email Change OTP
**Endpoint:** `POST /changeEmail`  
**Authentication:** ✅ Access Token Required (in header)  
**Description:** Confirm email change with OTP

**Request Body:**
```json
{
  "email": "string (required, new email)",
  "otp": "string (required, 6 digits)"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": "string (new email)",
  "message": "email changed successfully",
  "success": true
}
```

---

## 🔒 Two-Factor Authentication Endpoints

### 15. Enable 2FA
**Endpoint:** `POST /2faEnable`  
**Authentication:** ✅ Access Token Required (in header)  
**Description:** Enable two-factor authentication for user account

**Request Body:**
```json
{}
```

**Response (200):**
```json
{
  "statusCode": 201,
  "data": "2faenable  true",
  "message": "2faEnable successfully",
  "success": true
}
```

---

### 16. Disable 2FA
**Endpoint:** `POST /2faDisable`  
**Authentication:** ✅ Access Token Required (in header)  
**Description:** Disable two-factor authentication for user account

**Request Body:**
```json
{}
```

**Response (200):**
```json
{
  "statusCode": 201,
  "data": "2faEnable  false",
  "message": "2faDisable successfully",
  "success": true
}
```

---

## 🚪 Logout Endpoints

### 17. Logout User
**Endpoint:** `POST /logout`  
**Authentication:** ✅ Access Token Required (in header)  
**Description:** Logout from current device/session

**Request Body:**
```json
{}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "string",
    "userId": "string",
    "refreshToken": "string"
  },
  "message": "logout successfully",
  "success": true
}
```

---

### 18. Logout From All Devices
**Endpoint:** `POST /logoutAllDevice`  
**Authentication:** ✅ Access Token Required (in header)  
**Description:** Logout from all devices/sessions

**Request Body:**
```json
{}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "logout successfully",
  "success": true
}
```

---

## ❌ Error Responses

All endpoints follow a consistent error response format:

```json
{
  "statusCode": 400|404|409|500,
  "data": [],
  "message": "error message",
  "success": false,
  "error": []
}
```

### Common Error Codes:
- **400 Bad Request** - Missing or invalid fields
- **404 Not Found** - User or resource not found
- **409 Conflict** - OTP expired or already exists
- **500 Internal Server Error** - Server error

---

## 🔐 Authentication Headers

For endpoints requiring authentication, include the access token in the header:

```
Authorization: Bearer <accessToken>
```

OR the token will be automatically read from cookies if available.

---

## 📋 Summary Table

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /register | ❌ | Register new user |
| POST | /login | ❌ | Login user |
| POST | /verify2faOtp | ✅ | Verify 2FA OTP |
| POST | /resend2faOtp | ✅ | Resend 2FA OTP |
| POST | /getVerifyEmailOTP | ✅ | Send email verification OTP |
| POST | /verifyEmailOTP | ✅ | Verify email OTP |
| POST | /resendVerifyEmailOTP | ✅ | Resend email verification OTP |
| POST | /changePassword | ✅ | Change password |
| POST | /forgotPassword | ❌ | Request password reset |
| POST | /resendForgotPasswordOTP | ❌ | Resend password reset OTP |
| POST | /resetPassword | ❌ | Reset password with OTP |
| GET | /profile | ✅ | Get user profile |
| POST | /profile | ✅ | Update user profile |
| POST | /changeEmail | ✅ | Verify and change email |
| POST | /2faEnable | ✅ | Enable 2FA |
| POST | /2faDisable | ✅ | Disable 2FA |
| POST | /logout | ✅ | Logout from current device |
| POST | /logoutAllDevice | ✅ | Logout from all devices |
