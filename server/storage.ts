import {
  type CollegeDocument,
  type InsertCollegeDocument,
  type InternshipDocument,
  type InsertInternshipDocument,
  type InternshipFile,
  type InsertInternshipFile,
  type CertificationDocument,
  type InsertCertificationDocument,
  type DocumentLink,
  type InsertDocumentLink,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // College Documents
  createCollegeDocument(doc: InsertCollegeDocument): Promise<CollegeDocument>;
  getCollegeDocuments(): Promise<CollegeDocument[]>;
  getCollegeDocumentsByCategory(category: string): Promise<CollegeDocument[]>;
  deleteCollegeDocument(id: string): Promise<void>;
  
  // Internship Documents
  createInternshipDocument(doc: InsertInternshipDocument): Promise<InternshipDocument>;
  getInternshipDocuments(): Promise<InternshipDocument[]>;
  getInternshipDocument(id: string): Promise<InternshipDocument | undefined>;
  deleteInternshipDocument(id: string): Promise<void>;
  
  // Internship Files
  createInternshipFile(file: InsertInternshipFile): Promise<InternshipFile>;
  getInternshipFiles(internshipId: string): Promise<InternshipFile[]>;
  deleteInternshipFile(id: string): Promise<void>;
  
  // Certification Documents
  createCertificationDocument(doc: InsertCertificationDocument): Promise<CertificationDocument>;
  getCertificationDocuments(): Promise<CertificationDocument[]>;
  deleteCertificationDocument(id: string): Promise<void>;
  
  // Document Links
  createDocumentLink(link: InsertDocumentLink): Promise<DocumentLink>;
  getDocumentLinks(): Promise<DocumentLink[]>;
  deleteDocumentLink(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private collegeDocuments: Map<string, CollegeDocument>;
  private internshipDocuments: Map<string, InternshipDocument>;
  private internshipFiles: Map<string, InternshipFile>;
  private certificationDocuments: Map<string, CertificationDocument>;
  private documentLinks: Map<string, DocumentLink>;

  constructor() {
    this.collegeDocuments = new Map();
    this.internshipDocuments = new Map();
    this.internshipFiles = new Map();
    this.certificationDocuments = new Map();
    this.documentLinks = new Map();
  }

  async createCollegeDocument(insertDoc: InsertCollegeDocument): Promise<CollegeDocument> {
    const id = randomUUID();
    const doc: CollegeDocument = { ...insertDoc, id, createdAt: new Date() };
    this.collegeDocuments.set(id, doc);
    return doc;
  }

  async getCollegeDocuments(): Promise<CollegeDocument[]> {
    return Array.from(this.collegeDocuments.values());
  }

  async getCollegeDocumentsByCategory(category: string): Promise<CollegeDocument[]> {
    return Array.from(this.collegeDocuments.values()).filter(doc => doc.category === category);
  }

  async deleteCollegeDocument(id: string): Promise<void> {
    this.collegeDocuments.delete(id);
  }

  // Internship Documents
  async createInternshipDocument(insertDoc: InsertInternshipDocument): Promise<InternshipDocument> {
    const id = randomUUID();
    const doc: InternshipDocument = { ...insertDoc, id, createdAt: new Date() };
    this.internshipDocuments.set(id, doc);
    return doc;
  }

  async getInternshipDocuments(): Promise<InternshipDocument[]> {
    return Array.from(this.internshipDocuments.values());
  }

  async getInternshipDocument(id: string): Promise<InternshipDocument | undefined> {
    return this.internshipDocuments.get(id);
  }

  async deleteInternshipDocument(id: string): Promise<void> {
    // Delete all associated files
    const files = await this.getInternshipFiles(id);
    for (const file of files) {
      this.internshipFiles.delete(file.id);
    }
    this.internshipDocuments.delete(id);
  }

  async createInternshipFile(insertFile: InsertInternshipFile): Promise<InternshipFile> {
    const id = randomUUID();
    const file: InternshipFile = { ...insertFile, id, createdAt: new Date() };
    this.internshipFiles.set(id, file);
    return file;
  }

  async getInternshipFiles(internshipId: string): Promise<InternshipFile[]> {
    return Array.from(this.internshipFiles.values()).filter(file => file.internshipId === internshipId);
  }

  async deleteInternshipFile(id: string): Promise<void> {
    this.internshipFiles.delete(id);
  }

  async createCertificationDocument(insertDoc: InsertCertificationDocument): Promise<CertificationDocument> {
    const id = randomUUID();
    const doc: CertificationDocument = { ...insertDoc, id, createdAt: new Date() };
    this.certificationDocuments.set(id, doc);
    return doc;
  }

  async getCertificationDocuments(): Promise<CertificationDocument[]> {
    return Array.from(this.certificationDocuments.values());
  }

  async deleteCertificationDocument(id: string): Promise<void> {
    this.certificationDocuments.delete(id);
  }

  // Document Links
  async createDocumentLink(insertLink: InsertDocumentLink): Promise<DocumentLink> {
    const id = randomUUID();
    const link: DocumentLink = { 
      ...insertLink, 
      id, 
      description: insertLink.description ?? null,
      createdAt: new Date() 
    };
    this.documentLinks.set(id, link);
    return link;
  }

  async getDocumentLinks(): Promise<DocumentLink[]> {
    return Array.from(this.documentLinks.values());
  }

  async deleteDocumentLink(id: string): Promise<void> {
    this.documentLinks.delete(id);
  }
}

export const storage = new MemStorage();
