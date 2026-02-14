
import React, { useState, useEffect } from 'react';
import { Proposal, ProductData, GenerationConfig } from '../types';
import { ASPECT_RATIOS, IMAGE_SIZES } from '../constants';
import { generatePosterImage, editPosterImage, analyzeImage } from '../services/gemini';

interface Props {
  proposal: Proposal;
  productData: ProductData;
  onBack: () => void;
}

const Step3Final: React.FC<Props> = ({ proposal, productData, onBack }) => {
  const [config, setConfig] = useState<GenerationConfig>({
    aspectRatio: "1:1",
    imageSize: "1K",
    model: 'gemini-2.5-flash-image'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      if (config.model === 'gemini-3-pro-image-preview') {
        const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
        if (!hasKey) {
          await (window as any).aistudio?.openSelectKey();
        }
      }

      const promptText = `
        ${proposal.visualDirection}
        
        [材質細節強制要求]: 嚴格還原產品的材質、光影、結構。
        [文案視覺化]: 請在海報留白處預留適合放置主標「${proposal.copyTitle}」的位置。
        [畫幅]: ${config.aspectRatio}
      `;

      const url = await generatePosterImage(promptText, config, productData.productImages);
      setPosterUrl(url);
      setAnalysis(null);
    } catch (err) {
      console.error(err);
      alert("生成海報失敗。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async () => {
    if (!posterUrl || !editPrompt) return;
    setIsEditing(true);
    try {
      const url = await editPosterImage(posterUrl, editPrompt);
      setPosterUrl(url);
      setEditPrompt('');
    } catch (err) {
      console.error(err);
      alert("修改失敗。");
    } finally {
      setIsEditing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!posterUrl) return;
    setIsAnalyzing(true);
    try {
      const res = await analyzeImage(posterUrl);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
      alert("分析失敗。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <h2 className="text-4xl md:text-5xl font-black font-heiti text-white tracking-tight">Final Generation</h2>
        <button onClick={onBack} className="px-8 py-3 rounded-full border border-white/10 text-[10px] font-black tracking-[0.4em] text-white/40 hover:text-[#00F5FF] transition-all uppercase">
          ← Shift Vision
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16 items-start">
        {/* Left: Poster Display */}
        <div className="xl:col-span-2 space-y-10">
          <div className="relative aspect-square bg-white/[0.02] rounded-[48px] overflow-hidden shadow-2xl border-2 border-white/5 group ring-1 ring-[#00F5FF]/20">
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center bg-[#0A0E27]/80 backdrop-blur-3xl z-30">
                <div className="w-32 h-32 rounded-full border-t-2 border-l-2 border-[#00F5FF] animate-spin mb-10 shadow-[0_0_40px_rgba(0,245,255,0.2)]"></div>
                <h4 className="text-4xl font-black font-heiti text-white mb-4 tracking-[0.2em] text-aurora">RENDERING...</h4>
                <p className="text-slate-400/60 font-medium tracking-widest text-sm">正在聚合量子像素並重構物理材質...</p>
                <div className="mt-16 w-full max-w-md">
                  <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#00F5FF] to-[#7B2FF7] animate-[loading_25s_linear_infinite]"></div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <span className="text-[10px] font-black tracking-[0.5em] text-[#00F5FF] uppercase">Material Locking</span>
                    <span className="text-[10px] font-black tracking-[0.5em] text-[#7B2FF7] uppercase">Aurora Synthesis</span>
                  </div>
                </div>
              </div>
            ) : posterUrl ? (
              <>
                <img src={posterUrl} className="w-full h-full object-contain" alt="Generated Poster" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0A0E27]/40 backdrop-blur-[4px] flex items-center justify-center z-20">
                  <a href={posterUrl} download="poster.png" className="aurora-btn px-14 py-6 rounded-2xl shadow-3xl text-[#0A0E27] font-black font-heiti tracking-[0.3em] hover:scale-110 transition-all uppercase">
                    Harvest Poster
                  </a>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/5 uppercase font-black font-heiti text-5xl tracking-widest">
                Standby...
              </div>
            )}
            
            {isEditing && (
              <div className="absolute inset-0 bg-[#0A0E27]/70 backdrop-blur-2xl flex flex-col items-center justify-center z-40 transition-all">
                <div className="w-20 h-20 rounded-full border-t-2 border-[#7B2FF7] animate-spin mb-6"></div>
                <span className="font-black font-heiti text-[#7B2FF7] tracking-[0.5em] uppercase">Shift Pixels...</span>
              </div>
            )}
          </div>

          <div className="glass-card p-10 flex flex-col md:flex-row gap-8 items-center border-[#00F5FF]/10 shadow-[0_0_30px_rgba(0,245,255,0.05)]">
            <div className="flex-1 w-full">
              <label className="block text-[11px] font-black text-[#00F5FF] uppercase tracking-[0.5em] mb-4 ml-4 opacity-60"> 微調指令 / Pixel Refinement</label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="指令：優化背景光效、增加材質折射、調整雲朵分佈..."
                  className="flex-1 bg-white/[0.02] border border-white/10 p-5 rounded-2xl text-white placeholder:text-white/10 text-sm focus:border-[#00F5FF] outline-none transition-all"
                />
                <button 
                  onClick={handleEdit}
                  disabled={isEditing || !posterUrl}
                  className="bg-white text-[#0A0E27] px-12 rounded-2xl font-black tracking-widest hover:bg-[#00F5FF] transition-all disabled:opacity-10"
                >
                  APPLY
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls & Analysis */}
        <div className="space-y-12">
          <div className="glass-card p-10 text-white space-y-10 border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00F5FF]/10 blur-[80px] rounded-full"></div>
            <h3 className="text-xl font-black font-heiti border-l-4 border-[#00F5FF] pl-6 uppercase tracking-[0.3em] text-white">Neural Config</h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] block ml-2">渲染引擎</label>
                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => setConfig({...config, model: 'gemini-2.5-flash-image'})}
                    className={`p-6 rounded-2xl text-left border transition-all ${config.model === 'gemini-2.5-flash-image' ? 'bg-white/10 border-[#00F5FF] text-white shadow-[0_0_20px_rgba(0,245,255,0.2)]' : 'bg-white/5 border-transparent text-white/30 hover:bg-white/10'}`}
                  >
                    <p className="font-black text-sm tracking-widest uppercase">Flash 2.5 Matrix</p>
                    <p className="text-[9px] opacity-40 mt-1 uppercase tracking-widest">Base Efficiency · Standard Precision</p>
                  </button>
                  <button 
                    onClick={() => setConfig({...config, model: 'gemini-3-pro-image-preview'})}
                    className={`p-6 rounded-2xl text-left border transition-all ${config.model === 'gemini-3-pro-image-preview' ? 'bg-gradient-to-r from-[#00F5FF]/20 to-[#7B2FF7]/20 border-[#00F5FF] text-white shadow-[0_0_30px_rgba(0,245,255,0.3)]' : 'bg-white/5 border-transparent text-white/30 hover:bg-white/10'}`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-black text-sm tracking-widest uppercase">Pro 3 Neural Core</p>
                      <span className="text-[8px] bg-[#00F5FF] text-[#0A0E27] px-2 py-0.5 rounded-sm font-black tracking-tighter">PREMIUM</span>
                    </div>
                    <p className="text-[9px] opacity-60 mt-1 uppercase tracking-widest">Ultra Resolution · Advanced PBR Rendering</p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-3 block ml-2">構圖比例</label>
                  <select 
                    value={config.aspectRatio}
                    onChange={(e) => setConfig({...config, aspectRatio: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm text-white outline-none focus:border-[#00F5FF] transition-all"
                  >
                    {ASPECT_RATIOS.map(r => <option key={r} value={r} className="bg-[#0A0E27] text-white">{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-3 block ml-2">解析能級</label>
                  <select 
                    value={config.imageSize}
                    onChange={(e) => setConfig({...config, imageSize: e.target.value})}
                    disabled={config.model !== 'gemini-3-pro-image-preview'}
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-sm text-white outline-none disabled:opacity-10 focus:border-[#00F5FF] transition-all"
                  >
                    {IMAGE_SIZES.map(s => <option key={s} value={s} className="bg-[#0A0E27] text-white">{s}</option>)}
                  </select>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full aurora-btn py-6 rounded-2xl font-black font-heiti text-xl tracking-[0.4em] shadow-3xl disabled:opacity-20 uppercase"
              >
                Re-Generate
              </button>
            </div>
          </div>

          <div className="glass-card p-10 space-y-10 border-white/10 relative">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black font-heiti text-white uppercase tracking-[0.3em]">AI Diagnosis</h3>
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !posterUrl}
                className={`text-[10px] font-black px-5 py-2.5 rounded-full border transition-all tracking-[0.2em] ${isAnalyzing ? 'border-white/10 text-white/10' : 'border-[#00F5FF]/50 text-[#00F5FF] hover:bg-[#00F5FF] hover:text-[#0A0E27]'}`}
              >
                {isAnalyzing ? "ANALYTICS..." : "SCAN AESTHETICS"}
              </button>
            </div>
            
            <div className="space-y-6">
              {analysis ? (
                <div className="bg-white/[0.02] p-8 rounded-3xl text-sm text-slate-300 leading-relaxed whitespace-pre-wrap border border-white/5 italic font-medium tracking-wide">
                  {analysis}
                </div>
              ) : (
                <div className="text-center py-16 px-10 border-2 border-dashed border-white/5 rounded-[40px]">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] leading-loose">
                    啟動視覺診斷 <br/> 獲取極光級美學與行銷權重建議
                  </p>
                </div>
              )}
            </div>

            <div className="pt-10 border-t border-white/5 space-y-6">
              <div>
                <span className="text-[10px] font-black text-[#7B2FF7] uppercase tracking-[0.5em] opacity-60">Selected Narrative</span>
                <p className="text-2xl font-black text-white font-heiti mt-3 leading-tight tracking-wide">{proposal.copyTitle}</p>
                <p className="text-sm text-slate-500 mt-3 font-medium tracking-wide leading-relaxed">{proposal.copySubtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animation-delay-\[-5s\] { animation-delay: -5s; }
        .animation-delay-\[-10s\] { animation-delay: -10s; }
      `}</style>
    </div>
  );
};

export default Step3Final;
