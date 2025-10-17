import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import {
  insertCollegeDocumentSchema,
  insertInternshipDocumentSchema,
  insertInternshipFileSchema,
  insertCertificationDocumentSchema,
  insertDocumentLinkSchema,
} from "@shared/schema";

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Missing Cloudinary credentials: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must be set");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedMimes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: images, PDF, Word, Excel`));
    }
  }
});

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

interface FileRequest extends Request {
  file?: MulterFile;
}

async function uploadToCloudinary(file: MulterFile, folder: string = "uploads"): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result!.secure_url, publicId: result!.public_id });
      }
    );
    uploadStream.end(file.buffer);
  });
}

async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // College Documents Routes
  app.post("/api/college-documents", upload.single("file"), async (req: FileRequest, res) => {
    try {
      const { category } = req.body;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { url, publicId } = await uploadToCloudinary(file, "college-documents");
      const doc = await storage.createCollegeDocument({
        category,
        fileName: file.originalname,
        fileUrl: url,
        publicId,
        mimeType: file.mimetype,
      });

      res.json(doc);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/college-documents", async (req, res) => {
    try {
      const { category } = req.query;
      const docs = category
        ? await storage.getCollegeDocumentsByCategory(category as string)
        : await storage.getCollegeDocuments();
      res.json(docs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/college-documents/:id", async (req, res) => {
    try {
      const docs = await storage.getCollegeDocuments();
      const doc = docs.find(d => d.id === req.params.id);
      if (doc) {
        await deleteFromCloudinary(doc.publicId);
      }
      await storage.deleteCollegeDocument(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Internship Documents Routes
  app.post("/api/internship-documents", async (req, res) => {
    try {
      const data = insertInternshipDocumentSchema.parse(req.body);
      const doc = await storage.createInternshipDocument(data);
      res.json(doc);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/internship-documents", async (req, res) => {
    try {
      const docs = await storage.getInternshipDocuments();
      res.json(docs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/internship-documents/:id", async (req, res) => {
    try {
      const doc = await storage.getInternshipDocument(req.params.id);
      if (!doc) {
        return res.status(404).json({ message: "Not found" });
      }
      res.json(doc);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/internship-documents/:id", async (req, res) => {
    try {
      const files = await storage.getInternshipFiles(req.params.id);
      for (const file of files) {
        await deleteFromCloudinary(file.publicId);
      }
      await storage.deleteInternshipDocument(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Internship Files Routes
  app.post("/api/internship-files", upload.single("file"), async (req: FileRequest, res) => {
    try {
      const { internshipId, fileType } = req.body;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { url, publicId } = await uploadToCloudinary(file, "internship-files");
      const internshipFile = await storage.createInternshipFile({
        internshipId,
        fileType,
        fileName: file.originalname,
        fileUrl: url,
        publicId,
        mimeType: file.mimetype,
      });

      res.json(internshipFile);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/internship-files/:internshipId", async (req, res) => {
    try {
      const files = await storage.getInternshipFiles(req.params.internshipId);
      res.json(files);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/internship-files/:id", async (req, res) => {
    try {
      const file = await storage.getInternshipFileById(req.params.id);
      if (file) {
        await deleteFromCloudinary(file.publicId);
      }
      await storage.deleteInternshipFile(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Certification Documents Routes
  app.post("/api/certification-documents", upload.single("file"), async (req: FileRequest, res) => {
    try {
      const { name } = req.body;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { url, publicId } = await uploadToCloudinary(file, "certification-documents");
      const doc = await storage.createCertificationDocument({
        name,
        fileName: file.originalname,
        fileUrl: url,
        publicId,
        mimeType: file.mimetype,
      });

      res.json(doc);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/certification-documents", async (req, res) => {
    try {
      const docs = await storage.getCertificationDocuments();
      res.json(docs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/certification-documents/:id", async (req, res) => {
    try {
      const docs = await storage.getCertificationDocuments();
      const doc = docs.find(d => d.id === req.params.id);
      if (doc) {
        await deleteFromCloudinary(doc.publicId);
      }
      await storage.deleteCertificationDocument(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Document Links Routes
  app.post("/api/document-links", async (req, res) => {
    try {
      const data = insertDocumentLinkSchema.parse(req.body);
      const link = await storage.createDocumentLink(data);
      res.json(link);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/document-links", async (req, res) => {
    try {
      const links = await storage.getDocumentLinks();
      res.json(links);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/document-links/:id", async (req, res) => {
    try {
      await storage.deleteDocumentLink(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
