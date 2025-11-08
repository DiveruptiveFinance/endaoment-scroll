"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, Upload, X } from "lucide-react";
import { useAccount } from "wagmi";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";

export default function UploadDocumentPage() {
  const router = useRouter();
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    type: "grade" as "grade" | "paper" | "work" | "certificate" | "other",
    title: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!address) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">Connect Your Wallet</h2>
            <p className="text-[16px] text-[#1A1A1A]/70 mb-6">Please connect your wallet to upload documents</p>
            <PrimaryButton size="lg">Connect Wallet</PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.title) return;

    setIsUploading(true);

    // Mock: Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        router.push("/student/dashboard?tab=documents");
      }, 2000);
    }, 2000);
  };

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white rounded-[6px] p-12 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <CheckCircle2 className="w-16 h-16 text-[#5CE27F] mx-auto mb-4" strokeWidth={2} />
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">Document Uploaded Successfully!</h2>
            <p className="text-[16px] text-[#1A1A1A]/70 mb-6">
              Your document is being reviewed. You'll receive a score once it's approved.
            </p>
            <Link href="/student/dashboard?tab=documents">
              <PrimaryButton size="lg">View Documents</PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link
          href="/student/dashboard"
          className="inline-block mb-6 text-[#0052FF] hover:text-[#0040CC] transition-colors"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
          <h1 className="text-[32px] font-bold text-[#0A0F1C] mb-2">Upload Document</h1>
          <p className="text-[16px] text-[#1A1A1A]/70 mb-8">
            Upload your grades, papers, or work to increase your voting power score
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Type */}
            <div>
              <label className="block text-[16px] font-semibold text-[#0A0F1C] mb-3">Document Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-3 rounded-[6px] border border-[#F2F4F7] bg-white text-[16px] text-[#0A0F1C] focus:outline-none focus:border-[#0052FF] transition-colors"
                required
              >
                <option value="grade">Grade / Transcript</option>
                <option value="paper">Research Paper</option>
                <option value="work">Work / Project</option>
                <option value="certificate">Certificate</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[16px] font-semibold text-[#0A0F1C] mb-3">Document Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Academic Transcript - Fall 2024"
                className="w-full px-4 py-3 rounded-[6px] border border-[#F2F4F7] bg-white text-[16px] text-[#0A0F1C] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:border-[#0052FF] transition-colors"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[16px] font-semibold text-[#0A0F1C] mb-3">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add any additional details about this document..."
                rows={4}
                className="w-full px-4 py-3 rounded-[6px] border border-[#F2F4F7] bg-white text-[16px] text-[#0A0F1C] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:border-[#0052FF] transition-colors resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-[16px] font-semibold text-[#0A0F1C] mb-3">Document File *</label>
              <div className="border-2 border-dashed border-[#F2F4F7] rounded-[6px] p-8 text-center hover:border-[#0052FF] transition-colors">
                {file ? (
                  <div className="flex items-center justify-center gap-4">
                    <FileText className="w-8 h-8 text-[#0052FF]" strokeWidth={2} />
                    <div className="text-left">
                      <p className="text-[16px] font-semibold text-[#0A0F1C]">{file.name}</p>
                      <p className="text-[14px] text-[#1A1A1A]/70">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="ml-4 p-2 rounded-full hover:bg-[#F2F4F7] transition-colors"
                    >
                      <X className="w-5 h-5 text-[#1A1A1A]/70" strokeWidth={2} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                      required
                    />
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-[#0052FF]/10 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-[#0052FF]" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-[16px] font-semibold text-[#0A0F1C] mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-[14px] text-[#1A1A1A]/70">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                      </div>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Link href="/student/dashboard" className="flex-1">
                <PrimaryButton variant="secondary" size="lg" className="w-full">
                  Cancel
                </PrimaryButton>
              </Link>
              <PrimaryButton
                type="submit"
                size="lg"
                className="flex-1"
                disabled={!file || !formData.title || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Document"}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
