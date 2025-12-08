"use client";

import { getAllActiveUniversities } from "~~/data/universities";
import { UniversityCard } from "~~/components/fund/UniversityCard";

export default function UniversitiesPage() {
  const universities = getAllActiveUniversities();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-[36px] font-bold text-[#0A0F1C] mb-4">Top Mexican Universities</h1>
          <p className="text-[16px] text-[#1A1A1A]/70 max-w-2xl">
            Fund these leading universities. Your principal stays safe, 100% of yield goes to education.
          </p>
        </div>

        {/* Universities Grid */}
        {universities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university) => (
              <UniversityCard key={university.id} university={university} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[6px] p-12 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <p className="text-[16px] text-[#1A1A1A]/70">No universities available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

