
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="relative pt-12 pb-28 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-black font-heiti tracking-tight text-white">
            <span className="text-aurora">3 Step</span> <span className="font-light opacity-80">扭蛋封面生成器</span>
          </h1>
          <p className="text-cyan-100/40 mt-4 text-xl font-light tracking-widest max-w-2xl uppercase">
            再也不用傷腦筋
          </p>
        </div>
        
        <div className="glass-card px-8 py-4 rounded-2xl flex items-center gap-4 border-[#00F5FF]/30 shadow-[0_0_20px_rgba(0,245,255,0.1)]">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F5FF]"></span>
          </div>
          <span className="text-[10px] text-white font-black tracking-[0.3em] uppercase">Neural Engine Active</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
