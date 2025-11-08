"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function CreateStudentPage() {
  const router = useRouter();
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    field: "",
    bio: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { writeContractAsync: registerStudent } = useScaffoldWriteContract("StudentRegistry");

  const handleSubmit = async () => {
    if (!address) return;

    setIsLoading(true);

    try {
      await registerStudent({
        functionName: "addStudent",
        args: [
          address,
          formData.name,
          formData.university,
          formData.field, // researchArea
        ],
      });

      setIsLoading(false);
      setShowSuccess(true);

      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      console.error("Registration failed:", error);
      setIsLoading(false);
    }
  };

  const isFormValid = formData.name && formData.university && formData.field && formData.bio;

  if (showSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="card-title text-2xl mb-2">Registration Successful!</h2>
            <p className="mb-2">Your student profile has been created</p>
            <p className="text-sm text-base-content/60">Redirecting to homepage...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6">Register as Student</h1>

      {!address && (
        <div className="alert alert-warning mb-4">
          <span>Please connect your wallet to register</span>
        </div>
      )}

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Full Name *</span>
            </label>
            <input
              type="text"
              placeholder="Maria Silva"
              className="input input-bordered"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              disabled={!address}
            />
          </div>

          {/* University */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text font-semibold">University *</span>
            </label>
            <input
              type="text"
              placeholder="Universidade de São Paulo (USP)"
              className="input input-bordered"
              value={formData.university}
              onChange={e => setFormData({ ...formData, university: e.target.value })}
              disabled={!address}
            />
          </div>

          {/* Field of Study */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text font-semibold">Field of Study *</span>
            </label>
            <input
              type="text"
              placeholder="Computer Science PhD"
              className="input input-bordered"
              value={formData.field}
              onChange={e => setFormData({ ...formData, field: e.target.value })}
              disabled={!address}
            />
          </div>

          {/* Bio */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text font-semibold">Research Bio *</span>
            </label>
            <textarea
              placeholder="Describe your research focus and goals..."
              className="textarea textarea-bordered h-32"
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              disabled={!address}
            />
            <label className="label">
              <span className="label-text-alt">Minimum 50 characters</span>
            </label>
          </div>

          {/* Info Alert */}
          <div className="alert alert-info mt-4">
            <div className="text-sm">
              <div className="font-semibold mb-1">What happens next?</div>
              <div>• Your profile will be visible to donors</div>
              <div>• You&apos;ll be eligible to receive funding allocations</div>
              <div>• Your wallet address will be used for receiving funds</div>
            </div>
          </div>

          {/* Transaction Status */}
          {isLoading && (
            <div className="alert alert-info mt-4">
              <span className="loading loading-spinner"></span>
              <span>Registering on-chain...</span>
            </div>
          )}

          {/* Submit */}
          <button
            className={`btn btn-primary btn-lg btn-block mt-6`}
            onClick={handleSubmit}
            disabled={isLoading || !address || !isFormValid || formData.bio.length < 50}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                Registering...
              </>
            ) : (
              "Register →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
