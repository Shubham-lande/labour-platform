# 🚀 Deployment Guide - Labour Management & Workforce Booking Platform

This guide explains how to deploy your full-stack MERN application for **FREE** using **MongoDB Atlas**, **Render** (for Backend), and **Vercel** (for Frontend).

---

## 📌 Prerequisites
1. A **GitHub** account (push your code to a GitHub repository).
2. A free **MongoDB Atlas** account.
3. A free **Render** account.
4. A free **Vercel** account.

---

## Step 1: Set up Cloud Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a database user (username & password).
4. Under **Network Access**, click **Add IP Address** -> Select **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Connect** -> **Drivers** -> Copy your connection string:
   `mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/labour_platform?retryWrites=true&w=majority`

---

## Step 2: Deploy Backend API (Render.com)
1. Sign in to [Render](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Name**: `labour-platform-backend`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Scroll to **Environment Variables** and add:
   - `MONGODB_URI`: `<Your MongoDB Atlas connection string from Step 1>`
   - `JWT_SECRET`: `super_secret_jwt_key_2026_labour_platform_app`
   - `NODE_ENV`: `production`
6. Click **Create Web Service**.
7. Copy your backend URL once deployed (e.g. `https://labour-platform-backend.onrender.com`).

---

## Step 3: Deploy Frontend (Vercel)
1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Set the following settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://labour-platform-backend.onrender.com/api` (Replace with your backend Render URL)
6. Click **Deploy**.

---

## 🎉 Done!
Your application is now live on the internet! 
- **Frontend App**: `https://your-app.vercel.app`
- **Backend API**: `https://labour-platform-backend.onrender.com/api`
