const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Upload-Verzeichnis erstellen
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Konfiguration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Säubern des Dateinamens
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, "_");
    const timestamp = Date.now();
    cb(null, `${timestamp}_${cleanName}`);
  },
});

// Dateityp-Validierung
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Ungültiger Dateityp"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5, // Max 5 Dateien
  },
  fileFilter: fileFilter,
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Upload Route
app.post("/upload", upload.array("files", 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Keine Dateien ausgewählt",
      });
    }

    // Log der gespeicherten Dateien
    console.log("📁 Dateien gespeichert in:", uploadDir);
    req.files.forEach((file) => {
      console.log(" -", file.filename, "(", file.size, "bytes)");
    });

    const fileInfo = req.files.map((file) => ({
      originalName: file.originalname,
      savedName: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    }));

    res.json({
      success: true,
      message: `${req.files.length} Datei(en) erfolgreich hochgeladen`,
      files: fileInfo,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Server Fehler beim Hochladen",
    });
  }
});

// Error Handling
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Datei zu groß. Maximal 10MB.",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Zu viele Dateien. Maximal 5 Dateien.",
      });
    }
  }
  res.status(400).json({
    success: false,
    message: error.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
  console.log(`📁 Uploads werden gespeichert in: ${uploadDir}`);
});
