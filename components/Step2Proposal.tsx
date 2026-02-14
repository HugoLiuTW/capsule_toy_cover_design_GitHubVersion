
import React, { useState } from 'react';
import { Proposal } from '../types';

interface Props {
  proposals: Proposal[];
  onSelect: (p: Proposal) => void;
  onBack: () => void;
}

const Step2Proposal: React.FC<Props> = ({ proposals, onSelect, onBack }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-black font-heiti text-white tracking-tight">視覺共振提案</h2>
          <p className="text-[#00F5FF]/40 mt-3 font-semibold tracking-widest uppercase text-xs">AI Neural Adaptation Logic: Activated</p>
        </div>
        <button onClick={onBack} className="px-8 py-3 rounded-full border border-white/10 text-[10px] font-black tracking-[0.3em] text-white/40 hover:text-[#00F5FF] hover:border-[#00F5FF]/50 transition-all uppercase">
          ← Reset Input Matrix
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {proposals.map((p, i) => (
          <div 
            key={p.id}
            onMouseEnter={() => setHoveredId(p.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`group relative glass-card p-12 cursor-pointer transition-all duration-500 flex flex-col h-full border-white/10 overflow-hidden ${
              hoveredId === p.id 
                ? 'scale-[1.04] border-[#00F5FF]/40 shadow-[0_0_40px_rgba(0,245,255,0.2)] -translate-y-5' 
                : 'hover:border-white/20 shadow-none'
            }`}
            onClick={() => onSelect(p)}
          >
            {/* Organic Glow Background */}
            <div className={`absolute top-[-40%] left-[-40%] w-[180%] h-[180%] bg-gradient-to-br from-[#00F5FF]/5 to-[#7B2FF7]/5 transition-opacity duration-700 pointer-events-none ${hoveredId === p.id ? 'opacity-100' : 'opacity-0'}`}></div>

            <div className="relative z-10 mb-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center font-black font-heiti text-3xl text-aurora group-hover:bg-[#00F5FF] group-hover:text-[#0A0E27] transition-all duration-500 shadow-inner">
                  0{i + 1}
                </div>
                <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black tracking-[0.3em] text-[#00F5FF]/60 uppercase">
                  Adaptive
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-6 font-heiti leading-tight tracking-wide">{p.title}</h3>
              <p className="text-sm text-slate-400/80 leading-relaxed font-medium tracking-wide">{p.description}</p>
            </div>

            <div className="relative z-10 mt-auto space-y-8">
              <div className="bg-white/[0.02] rounded-3xl p-8 space-y-6 border border-white/5 backdrop-blur-md">
                <div>
                  <span className="text-[10px] font-black text-[#00F5FF] uppercase tracking-[0.4em] opacity-60">Primary Copy</span>
                  <p className="font-black text-white text-xl mt-2 tracking-wide leading-snug">{p.copyTitle}</p>
                </div>
                <div className="h-[1px] bg-white/10"></div>
                <div>
                  <span className="text-[10px] font-black text-[#00F5FF] uppercase tracking-[0.4em] opacity-60">Narrative</span>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">{p.copySubtitle}</p>
                </div>
              </div>
              
              <button className="w-full py-6 rounded-2xl bg-white/5 text-white text-[11px] font-black tracking-[0.4em] uppercase group-hover:bg-gradient-to-r group-hover:from-[#00F5FF] group-hover:to-[#7B2FF7] group-hover:text-[#0A0E27] transition-all duration-500">
                Resonate Concept
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="glass-card p-12 text-white flex flex-col md:flex-row items-center gap-10 border-[#00F5FF]/10 shadow-[0_0_30px_rgba(0,245,255,0.05)]">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#00F5FF] to-[#7B2FF7] flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(0,245,255,0.4)]">
          <svg className="w-12 h-12 text-[#0A0E27]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <div className="space-y-3">
          <h4 className="text-2xl font-black font-heiti tracking-wide text-aurora">極光多態適配引擎</h4>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl font-medium tracking-wide">
            系統正在同步執行「全球風格指令」與「多族群心理適配」。針對不同客群的需求，AI 自動優化了視覺對比度、材質亮度與文案的情緒飽和度。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step2Proposal;
