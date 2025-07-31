# 🌿 Plant Analysis Tool

Plant Analysis Tool is a full stack web application that lets users upload plant images, automatically generate AI-powered analysis reports, and download them as files stored securely in the server’s report folder.
Built with HTML, CSS, JavaScript, Node.js, Express.js, MongoDB, and integrates the Gemini API to provide intelligent insights.

# ✨ Features

Upload a plant image through a clean and user-friendly web interface
Generate detailed plant analysis reports using the Gemini AI API
Download generated reports as PDF/text files, stored in the /reports folder
Persist report metadata and history in MongoDB
Test and document REST APIs using Postman
Responsive frontend built with HTML, CSS, and JavaScript
Robust backend with Node.js and Express.js

# ⚙️ Tech Stack
Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: MongoDB
AI Integration: Gemini API
Tools: Postman (API testing), File system (report storage)

# 🚀 Getting Started

## Clone the repository
git clone https://github.com/mahi6299/plant-analysis-tool.git

## Go to the project directory
cd plant-analysis-tool

## Install server dependencies
npm install

## Create a .env file and add your MongoDB URI and Gemini API Key
touch .env

## Start the server
npm start

# 🛠 Usage

Open the web application in your browser.
Upload an image of a plant.
The system generates a detailed AI-powered analysis report.
Download the report (PDF/text) which is also saved in the reports folder.
View saved reports or history via the frontend.
