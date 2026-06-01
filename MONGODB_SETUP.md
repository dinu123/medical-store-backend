# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" or "Sign Up"
3. Create account with your email
4. Verify your email

## Step 2: Create a Free Cluster

1. After login, click "Create" (or "New Project")
2. Name your project: "medical-store"
3. Click "Create Project"
4. Click "Create a Deployment"
5. Choose "Free" tier (M0)
6. Select "AWS" as cloud provider
7. Select region closest to you (e.g., "us-east-1")
8. Click "Create"
9. Wait for cluster to be created (2-5 minutes)

## Step 3: Create Database User

1. In left sidebar, click "Security" → "Database Access"
2. Click "Add New Database User"
3. Enter username: `medicalstore`
4. Enter password: (save this password)
5. Under "Built-in Role", select "Read and write to any database"
6. Click "Add User"

## Step 4: Configure Network Access

1. In left sidebar, click "Security" → "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## Step 5: Get Connection String

1. Go to "Databases" (main dashboard)
2. Click "Connect" button for your cluster
3. Choose "Drivers" tab
4. Select "Node.js" version 4.x+
5. Copy the connection string (looks like):
   ```
   mongodb+srv://medicalstore:PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `PASSWORD` with the password you created in Step 3

## Step 6: Update Backend .env

Replace the MONGODB_URI in `.env` file with your Atlas connection string.

That's it! Your MongoDB is ready to use.
