# 🖨️ Printify

> **Seamless document-to-print platform**
>
> Upload your `.pdf` or `.docx`, customize print settings, pay securely, and track your order in real time.

---

## 📦 Table of Contents

* [🚀 About](#-about)
* [✨ Features](#-features)
* [🛠️ Tech Stack](#tech-stack)
* [⚙️ Installation & Setup](#️-installation--setup)
* [▶️ Usage](#-usage)
* [📁 Repository Structure](#-repository-structure)
* [🤝 Contributing](#-contributing)

---

## 🚀 About

Printify is a professional web portal that transforms your PDF and DOCX documents into high-quality prints—fast, reliable, and user-friendly. Designed for local print shops, it offers a streamlined, end-to-end experience:

* **Upload** documents in seconds
* **Configure** print options (paper size, color, duplex)
* **Pay** securely online
* **Track** order status in real time

---

## ✨ Features

* 🔒 **Secure Uploads & Payments**: SSL encryption and Stripe integration for peace of mind
* ⚡ **Live Price Calculator**: Instant cost estimates based on options
* 🕒 **Real-Time Tracking**: WebSocket (Socket.IO) notifications for status changes
* 📄 **Document Preview**: In-browser preview before you submit
* 📧 **Order Confirmation & Receipts**: Email receipts with unique Order ID

---

## 🛠️ Tech Stack

| Layer         | Technology                               |
| ------------- | ---------------------------------------- |
| Front End     | Next.js 15 (App Router), Tailwind CSS v4 |
| Back End      | Next.js API Routes, TypeScript           |
| Database      | PostgreSQL, Prisma ORM                   |
| File Storage  | Cloudinary                               |
| Real-Time     | WebSockets                               |
| Email Service | Nodemailer                               |

---

## ⚙️ Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/GioMjds/Printify.git
   cd printify
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables** Create a `.env.local` file in the root and add:

   ```bash
    # PostgreSQL for the database
    DATABASE_URL="postgresql://<your-username>:<your-password>@<your-host>:5432/printify?schema=public"
    
    # Setup your own Cloudinary and fill the credentials needed
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
    NEXT_PUBLIC_CLOUDINARY_API_KEY=
    NEXT_PUBLIC_CLOUDINARY_API_SECRET=
    CLOUDINARY_URL=
    
    # Create your own Gmail Address for your own setup
    EMAIL_USER=your_own_gmail_address
    EMAIL_PASS=app_password
   ```

4. **Run Prisma migrations & generate client**

   ```bash
   Just copy the `schema.prisma` file in my repo

   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

---

## ▶️ Usage

1. Open `http://localhost:3000` in your browser
2. **Upload** your PDF or DOCX file
3. **Select** print settings (paper size, color, duplex, quantity)
4. **Review** price estimate and **proceed** to payment
5. **Track** your order status on the dashboard
6. **Receive** email notification when ready

---

## 📁 Repository Structure

```folder
/printify
├── app               # Next.js App Router pages & layouts
│   ├── api           # API routes (uploads, orders, notifications)
│   └── globals.css   # Global Tailwind CSS styles
├── prisma            # Prisma schema & migrations
│   └── schema.prisma
├── lib
│   └── prisma.ts     # Prisma client singleton
├── public            # Static assets
├── components        # Reusable React components
├── .env.local        # Environment variables (not committed)
└── README.md         # Project overview & setup
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

Please ensure your code follows the existing style and includes tests where applicable.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
