require("dotenv").config();
const http = require("http");
const express = require("express");
const multer = require("multer");
const pdfkit = require("pdfkit");
const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { rejects } = require("assert");
const app = express();
const port = process.env.PORT || 5000;

// configure nmulter
const upload = multer({ dest: "upload/" });
app.use(express.json({ limit: "10mb" }));

// initialize Google generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.use(express.static("public"));

// routes
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image" });
    }
    const imagePath = req.file.path;
    const imageData = await fsPromises.readFile(imagePath, {
      encoding: "base64",
    });

    // use the gemini api analyze the image
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    const results = await model.generateContent([
      "Analyze this plant image and provide detailed analysis of its species, health, and care recommendations , its characteristics , care instructions , and any interseting facts. Please provide the response in plain text without using any markdown formatting",
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: imageData,
        },
      },
    ]);
    const plantInfo = results.response.text();

    // remove the uploaded image
    await fsPromises.unlink(imagePath);

    //send the response
    res.json({
      results: plantInfo,
      image: `data:${req.file.mimeType};base64,${imageData}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// download pdf
app.post("/download", express.json(), async (req, res) => {
  const { results, image } = req.body;
  try {
    // Ensure the reports directory exists
    const reportsDir = path.join(__dirname, "reports");
    await fsPromises.mkdir(reportsDir, { recursive: true });

    // generate pdf
    const filname = `plant_analysis_report_${Date.now()}.pdf`;
    const filePath = path.join(reportsDir, filname);
    const writeStream = fs.createWriteStream(filePath);
    const doc = new pdfkit();
    doc.pipe(writeStream);

    // Add content to the pdf
    doc.fontSize(24).text("Plant Analysis Report", {
      align: "center",
    });
    doc.moveDown();
    doc.fontSize(24).text(`Date: ${new Date().toLocaleDateString()}`);

    // insert image to the pdf
    if (image) {
      // const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      // const buffer = Buffer.from(base64Data, "base64");
      doc.moveDown();
      doc.image(image, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });
    }
    doc.moveDown();
    doc.fontSize(14).text(results, { align: "left" });
    doc.end();
    // wait for the pdf to be created
    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
    res.download(filePath, (err) => {
      fsPromises.unlink(filePath).catch(() => {});
      if (err) {
        res.status(500).json({ error: "Error downloading the PDF report" });
      }
    });
  } catch (error) {
    console.error("Error generating PDF report", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the PDF report" });
  }
});
// start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
