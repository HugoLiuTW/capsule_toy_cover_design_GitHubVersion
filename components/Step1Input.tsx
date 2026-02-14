
import React, { useState } from 'react';
import { ProductData } from '../types';
import { STYLE_OPTIONS, CONSTRAINT_OPTIONS } from '../constants';

interface Props {
  onNext: (data: ProductData) => void;
  isLoading: boolean;
}

const Step1Input: React.FC<Props> = ({ onNext, isLoading }) => {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [productImages, setProductImages] = useState<string[]>([]);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [refDesc, setRefDesc] = useState('');
  const [useRef, setUseRef] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    
    const files = Array.from(fileList);
    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(prev => [...prev, reader.result as string].slice(0, 10));
      };
      reader.readAsDataURL(file);
    });
  };

  const toggleItem = (item: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleSubmit = () => {
    if (!name || productImages.length === 0) {
      alert("請填寫產品名稱並上傳至少一張產品原圖。");
      return;
    }
    onNext({
      name,
      details,
      productImages,
      referenceImages,
      referenceDesc: refDesc,
      useRef,
      styles: selectedStyles,
      constraints: selectedConstraints
    });
  };

  return (
    <div className="space-y-14 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* Left Column: Media */}
        <div className="space-y-12">
          <div>
            <h3 className="text-2xl font-black font-heiti mb-8 text-white flex items-center gap-4">
              <span className="text-[#00F5FF] opacity-50 font-light">/ 01</span> 核心特徵錄入
            </h3>
            
            <div className="space-y-10">
              <div className="group">
                <label className="block text-[11px] font-black text-[#00F5FF]/60 uppercase tracking-[0.3em] mb-4 ml-2">產品高精原圖 (1-10)</label>
                <div className="glass-card p-10 transition-all hover:bg-white/[0.05] group-focus-within:border-[#00F5FF]/40 border-dashed">
                  <input 
                    type="file" 
                    multiple 
                    onChange={(e) => handleFileChange(e, setProductImages)}
                    className="w-full text-sm file:mr-6 file:py-3 file:px-8 file:rounded-xl file:border-0 file:bg-[#00F5FF] file:text-[#0A0E27] file:font-black hover:file:scale-105 cursor-pointer file:transition-all" 
                  />
                  {productImages.length > 0 && (
                    <div className="grid grid-cols-5 gap-4 mt-8">
                      {productImages.map((img, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/5 relative group/item hover:border-[#00F5FF]/50 transition-colors">
                          <img src={img} className="w-full h-full object-cover" alt="" />
                          <button 
                            onClick={() => setProductImages(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center text-xl"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-[#00F5FF]/60 uppercase tracking-[0.3em] mb-4 ml-2">風格導引參考</label>
                <div className="glass-card p-10 space-y-6">
                  <input 
                    type="file" 
                    multiple 
                    onChange={(e) => handleFileChange(e, setReferenceImages)}
                    className="w-full text-sm file:mr-6 file:py-3 file:px-8 file:rounded-xl file:border-0 file:bg-white/5 file:text-white file:font-black hover:file:bg-white/10 cursor-pointer" 
                  />
                  <textarea 
                    value={refDesc}
                    onChange={(e) => setRefDesc(e.target.value)}
                    placeholder="解析重點（如：色彩共振、構圖張力、材質折射感...）" 
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/10 text-sm h-32 focus:border-[#7B2FF7] outline-none transition-all"
                  />
                  <label className="flex items-center gap-4 cursor-pointer group pt-2">
                    <div className={`w-6 h-6 rounded-lg border-2 border-white/10 flex items-center justify-center transition-all ${useRef ? 'bg-[#00F5FF] border-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.4)]' : 'group-hover:border-[#00F5FF]/40'}`}>
                      {useRef && <div className="w-2.5 h-2.5 bg-[#0A0E27] rounded-sm"></div>}
                    </div>
                    <input type="checkbox" checked={useRef} onChange={(e) => setUseRef(e.target.checked)} className="hidden" />
                    <span className="text-sm font-semibold text-white/40 group-hover:text-white transition-colors tracking-wide">正式渲染階段採用此參考</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-12">
          <div>
            <h3 className="text-2xl font-black font-heiti mb-8 text-white flex items-center gap-4">
              <span className="text-[#7B2FF7] opacity-50 font-light">/ 02</span> 智慧架構參數
            </h3>

            <div className="space-y-10">
              <div className="space-y-4">
                <label className="block text-[11px] font-black text-[#00F5FF]/60 uppercase tracking-[0.3em] ml-2">產品定義</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="品名 (例如：星辰極光限定款扭蛋)" 
                  className="w-full bg-white/[0.02] border border-white/10 p-5 rounded-2xl text-white placeholder:text-white/10 focus:border-[#00F5FF] outline-none transition-all text-sm" 
                />
                <textarea 
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="細節特徵 (例如：磨砂霧面質感、目標為 20-30 歲都會女性...)" 
                  className="w-full bg-white/[0.02] border border-white/10 p-5 rounded-2xl text-white placeholder:text-white/10 h-32 focus:border-[#00F5FF] outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-[#00F5FF]/60 uppercase tracking-[0.3em] mb-4 ml-2">極光風格矩陣 (多選)</label>
                <div className="grid grid-cols-2 gap-3 glass-card p-6 border-white/5">
                  {STYLE_OPTIONS.map(style => (
                    <button 
                      key={style}
                      onClick={() => toggleItem(style, selectedStyles, setSelectedStyles)}
                      className={`text-left p-4 rounded-xl text-xs font-black tracking-wider transition-all border ${
                        selectedStyles.includes(style) 
                          ? 'bg-gradient-to-r from-[#00F5FF] to-[#7B2FF7] border-white/20 text-[#0A0E27] shadow-[0_0_20px_rgba(0,245,255,0.4)]' 
                          : 'bg-white/5 border-transparent text-white/30 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-[#00F5FF]/60 uppercase tracking-[0.3em] mb-4 ml-2">渲染約束條件 (多選)</label>
                <div className="grid grid-cols-1 gap-3">
                  {CONSTRAINT_OPTIONS.map(cond => (
                    <button 
                      key={cond}
                      onClick={() => toggleItem(cond, selectedConstraints, setSelectedConstraints)}
                      className={`text-left p-5 rounded-2xl text-sm font-semibold transition-all border flex items-center justify-between group ${
                        selectedConstraints.includes(cond) 
                          ? 'bg-[#00F5FF]/10 border-[#00F5FF] text-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.2)]' 
                          : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'
                      }`}
                    >
                      <span className="tracking-wide">{cond}</span>
                      <div className={`w-2.5 h-2.5 rounded-full transition-colors ${selectedConstraints.includes(cond) ? 'bg-[#00F5FF]' : 'bg-white/10 group-hover:bg-white/20'}`}></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full aurora-btn py-9 rounded-[24px] text-2xl font-black font-heiti tracking-[0.4em] shadow-2xl active:scale-[0.98] disabled:opacity-30"
      >
        INITIATE AURORA CORE
      </button>
    </div>
  );
};

export default Step1Input;
