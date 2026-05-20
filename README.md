# 🏦 Ledger & Banking API

Hello this is Ledger & Banking API. 

This project is a robust, double-entry bookkeeping backend built with Node.js, Express, and MongoDB. It's designed to handle user authentication, account management, and financial transactions safely and securely. Think of it as the engine for a mini digital bank or wallet system!

## 🚀 What Does It Do?

At its core, this API allows you to:
- **Manage Users:** Securely register, login, and logout users using JWT tokens.
- **Create Financial Accounts:** Every user can open multiple ledger accounts to hold funds.
- **Process Transactions:** Users can send money to each other. Under the hood, this uses an ACID-compliant double-entry ledger system (creating matching DEBIT and CREDIT records) so that money is never lost or created out of thin air by mistake.
- **Mint System Money:** There is a special "System User" who acts as the central bank of the platform, allowing you to reward users or distribute funds infinitely.
- **Email Notifications:** Automatically sends out emails when users register or receive money.

---

## 🛠️ How the Endpoints Work

Here is a plain-English guide to the API endpoints and what they expect.

### 1. Authentication (Who are you?)

- **`POST /api/auth/register`**
  - **What it does:** Signs up a new user. It checks if the email is taken, safely hashes the password, sends a welcome email, and gives you back a token to use the app.
  - **What to send:** `{ "email": "...", "name": "...", "password": "..." }`

- **`POST /api/auth/login`**
  - **What it does:** Logs you into your account. If your credentials are correct, it hands you a fresh JWT token to put in your Authorization header.
  - **What to send:** `{ "email": "...", "password": "..." }`

- **`POST /api/auth/logout`**
  - **What it does:** Securely logs you out. It takes your current token and adds it to a database "Blacklist" so that even if a hacker steals the token later, it will be useless.

### 2. Accounts (Where is your money?)
*(Note: You need to be logged in and pass your JWT token in the `Authorization: Bearer <token>` header for these!)*

- **`POST /api/accounts/`**
  - **What it does:** Creates a brand new, empty financial account linked to you. 

- **`GET /api/accounts/`**
  - **What it does:** Fetches a list of all the accounts you own.

- **`GET /api/accounts/balance/:id`**
  - **What it does:** Calculates how much money you have in a specific account. It does this the "right" way—by looking at the ledger history, adding up all the CREDITS, and subtracting all the DEBITS.

### 3. Transactions (Moving the money)
*(Note: These also require you to be logged in!)*

- **`POST /api/transactions/`**
  - **What it does:** Transfers money from one of your accounts to someone else's account. It checks if you have enough balance, prevents duplicate accidental clicks using an `idempotencyKey`, and then securely moves the money using a MongoDB transaction. It even emails the receiver!
  - **What to send:** 
    ```json
    {
      "fromAccount": "<your_account_id>",
      "toAccount": "<receiver_account_id>",
      "amount": 100,
      "idempotencyKey": "unique-random-string"
    }
    ```

- **`POST /api/transactions/system-transaction`**
  - **What it does:** This is a super-powered endpoint only available to the "System User" (a user manually marked with `systemUser: true` in the database). It allows the platform to deposit funds into any user's account without checking the system's balance. It's perfect for sign-up bonuses, refunds, or system rewards.
  - **What to send:**
    ```json
    {
      "toAccount": "<receiver_account_id>",
      "amount": 500,
      "idempotencyKey": "unique-random-string-2"
    }
    ```

## 🧠 The Tech Stack
- **Node.js & Express** - For handling the API routes.
- **MongoDB & Mongoose** - For database schemas and strict ACID transactions.
- **JWT (JSON Web Tokens)** - For stateless, secure authentication.
- **Nodemailer** - For sending automated emails.

Enjoy exploring and building upon this financial engine! 💸
