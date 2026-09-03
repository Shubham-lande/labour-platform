# 🚀 Production Deployment Guide - Labour Management & Workforce Booking Platform

This guide provides instructions to deploy your complete full-stack application to production so that it behaves **identically** to your local Antigravity run version.

---

## 🌟 Option 1: Unified Full-Stack Vercel Deployment (RECOMMENDED)

In this configuration, your **Vite React Frontend** and your **Express Serverless API (`/api/*`)** run together on **one single domain** on Vercel.

### Advantages:
- **Zero CORS Issues:** Frontend and Backend share the exact same domain origin.
- **No Free-Tier Sleeping:** Unlike free Render web services (which take 60–90 seconds to wake up after 15 minutes of inactivity), Vercel serverless functions respond instantly.
- **Single URL:** Only one deployment to manage (`https://your-app.vercel.app`).

### Step-by-Step Instructions:

#### 1. Push Latest Code to GitHub
Ensure all your latest files are committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "Configure unified full-stack Vercel deployment with serverless API and persistent database"
git push origin main
```

#### 2. Import into Vercel
1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`labour-platform`).
4. Keep the **Root Directory** as default: `.` (Do **NOT** set to `client`).
5. Vercel automatically detects the configuration from `vercel.json`:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`

#### 3. Set Environment Variables in Vercel
Expand **Environment Variables** in Vercel and add:
- `MONGODB_URI`: Your MongoDB Atlas connection string (see Database setup below).
- `JWT_SECRET`: `super_secret_enterprise_jwt_key_2026_labour_platform_app`
- `NODE_ENV`: `production`

*(Note: `VITE_API_URL` is NOT needed for this option because the frontend automatically communicates with `/api` on the same domain).*

#### 4. Click Deploy
Click **Deploy**. Your unified full-stack application will be live in 1–2 minutes!

---

## 🌐 Option 2: Dual Deployment (Frontend on Vercel + Backend on Render)

If you prefer to host your Express backend on **Render** and your frontend on **Vercel**:

### 1. Deploy Backend on Render
1. Sign in to [Render](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure settings:
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   - `MONGODB_URI`: `<Your MongoDB Atlas connection string>`
   - `JWT_SECRET`: `super_secret_enterprise_jwt_key_2026_labour_platform_app`
   - `NODE_ENV`: `production`
6. Click **Create Web Service** and copy your backend URL (e.g. `https://labour-platform-backend.onrender.com`).

### 2. Deploy Frontend on Vercel
1. In Vercel, import your repository.
2. Set **Root Directory** to `client`.
3. Set **Framework Preset** to `Vite`.
4. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://labour-platform-backend.onrender.com/api` *(Make sure to include `/api` at the end)*
5. Click **Deploy**.

---

## 🗄️ Setting Up Persistent Cloud Database (MongoDB Atlas)

To guarantee that data created by one user (e.g. Customer) is permanently stored and visible to another user (e.g. Labour) from any device across the world:

1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Shared Cluster** (always free).
3. Under **Security** -> **Database Access**:
   - Click **Add New Database User**.
   - Set Authentication Method: **Password**.
   - Enter a username and strong password (remember these).
   - Set Database User Privileges: **Read and write to any database**.
4. Under **Security** -> **Network Access**:
   - Click **Add IP Address**.
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`).
   - Click **Confirm** *(This allows your Vercel serverless functions / Render backend to reach your database)*.
5. Under **Deployment** -> **Database**:
   - Click **Connect** on your cluster.
   - Select **Drivers** (Node.js).
   - Copy the connection string:
     ```text
     mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/labour_platform?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with the credentials you created in step 3.
   - Paste this full string as your `MONGODB_URI` in Vercel or Render.

---

## 👥 Production Accounts for Instant Verification

Once deployed, log in with any of these pre-configured production accounts:

| Role | Email / Identifier | Password | Access / Dashboard |
|---|---|---|---|
| **Customer / Contractor** | `customer@labourhub.com` | `Customer@1234` | Create Work, Assign Labour, Escrow Payment |
| **Labour / Worker** | `labour@labourhub.com` | `Labour@1234` | View Work Requests, Accept Jobs, Post Updates |
| **Enterprise Admin** | `admin@labourhub.com` | `Admin@1234` | Verify Profiles, System Analytics, Manage Users |
