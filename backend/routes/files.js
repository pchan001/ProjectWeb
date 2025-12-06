// backend/routes/files.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { s3, BUCKET_NAME } = require("../s3Client");

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/files/upload - upload file to S3
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const key = req.file.originalname; // you can prefix with user or date if needed

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    await s3.upload(params).promise();

    res.status(201).json({ message: "File uploaded", key });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// GET /api/files - list files with presigned view URLs
router.get("/", async (req, res) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
    };

    const data = await s3.listObjectsV2(params).promise();

    const items =
      data.Contents?.map((obj) => {
        const url = s3.getSignedUrl("getObject", {
          Bucket: BUCKET_NAME,
          Key: obj.Key,
          Expires: 60 * 10, // 10 minutes
        });

        return {
          key: obj.Key,
          lastModified: obj.LastModified,
          size: obj.Size,
          url,
        };
      }) || [];

    res.json(items);
  } catch (err) {
    console.error("List files error:", err);
    res.status(500).json({ error: "Could not list files" });
  }
});

// DELETE /api/files/:key - delete a file
router.delete("/:key", async (req, res) => {
  try {
    const key = decodeURIComponent(req.params.key);

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(params).promise();

    res.json({ message: "File deleted" });
  } catch (err) {
    console.error("Delete file error:", err);
    res.status(500).json({ error: "Could not delete file" });
  }
});

module.exports = router;
