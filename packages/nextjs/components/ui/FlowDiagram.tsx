"use client";

import { ArrowRight, CheckCircle, DollarSign, GraduationCap, TrendingUp, Users, Vote } from "lucide-react";

export function FlowDiagram() {
  return (
    <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
      <h3 className="text-[24px] font-bold text-[#0A0F1C] mb-6 text-center">¿Cómo Funciona?</h3>
      
      {/* Flow Steps */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
        {/* Step 1: Donador */}
        <div className="flex flex-col items-center text-center flex-1">
          <div className="w-16 h-16 rounded-full bg-[#0052FF]/10 flex items-center justify-center mb-3">
            <Users className="w-8 h-8 text-[#0052FF]" />
          </div>
          <h4 className="text-[16px] font-bold text-[#0A0F1C] mb-2">Donador</h4>
          <p className="text-[12px] text-[#1A1A1A]/70">Deposita USDC</p>
        </div>

        <ArrowRight className="w-6 h-6 text-[#0052FF] hidden md:block" />

        {/* Step 2: Capital */}
        <div className="flex flex-col items-center text-center flex-1">
          <div className="w-16 h-16 rounded-full bg-[#0052FF]/10 flex items-center justify-center mb-3">
            <DollarSign className="w-8 h-8 text-[#0052FF]" />
          </div>
          <h4 className="text-[16px] font-bold text-[#0A0F1C] mb-2">Capital</h4>
          <p className="text-[12px] text-[#1A1A1A]/70">Se invierte en DeFi</p>
        </div>

        <ArrowRight className="w-6 h-6 text-[#0052FF] hidden md:block" />

        {/* Step 3: Yield */}
        <div className="flex flex-col items-center text-center flex-1">
          <div className="w-16 h-16 rounded-full bg-[#5CE27F]/10 flex items-center justify-center mb-3">
            <TrendingUp className="w-8 h-8 text-[#5CE27F]" />
          </div>
          <h4 className="text-[16px] font-bold text-[#0A0F1C] mb-2">Yield</h4>
          <p className="text-[12px] text-[#1A1A1A]/70">Genera intereses</p>
        </div>

        <ArrowRight className="w-6 h-6 text-[#0052FF] hidden md:block" />

        {/* Step 4: Universidad */}
        <div className="flex flex-col items-center text-center flex-1">
          <div className="w-16 h-16 rounded-full bg-[#0052FF]/10 flex items-center justify-center mb-3">
            <GraduationCap className="w-8 h-8 text-[#0052FF]" />
          </div>
          <h4 className="text-[16px] font-bold text-[#0A0F1C] mb-2">Universidad</h4>
          <p className="text-[12px] text-[#1A1A1A]/70">Recibe yield</p>
        </div>

        <ArrowRight className="w-6 h-6 text-[#0052FF] hidden md:block" />

        {/* Step 5: Distribución */}
        <div className="flex flex-col items-center text-center flex-1">
          <div className="w-16 h-16 rounded-full bg-[#5CE27F]/10 flex items-center justify-center mb-3">
            <Vote className="w-8 h-8 text-[#5CE27F]" />
          </div>
          <h4 className="text-[16px] font-bold text-[#0A0F1C] mb-2">Distribución</h4>
          <div className="text-[12px] text-[#1A1A1A]/70 space-y-1">
            <p>70% Operaciones</p>
            <p>30% Estudiantes</p>
          </div>
        </div>
      </div>

      {/* Distribution Details */}
      <div className="mt-8 pt-6 border-t border-[#F2F4F7]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#F8FAFC] rounded-[6px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-[#5CE27F]" />
              <span className="text-[14px] font-semibold text-[#0A0F1C]">70% Operaciones</span>
            </div>
            <p className="text-[12px] text-[#1A1A1A]/70">Para gastos operativos de la universidad</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-[6px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-[#0052FF]" />
              <span className="text-[14px] font-semibold text-[#0A0F1C]">30% Estudiantes</span>
            </div>
            <p className="text-[12px] text-[#1A1A1A]/70">Distribuido mediante votación DAO</p>
          </div>
        </div>
      </div>

      {/* Scroll L2 Badge */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 bg-[#F8FAFC] rounded-full px-4 py-2">
          <span className="text-[12px] text-[#1A1A1A]/70">Todo ejecutado en la L2 de</span>
          <span className="text-[14px] font-bold text-[#0052FF]">Scroll Sepolia</span>
        </div>
      </div>
    </div>
  );
}

