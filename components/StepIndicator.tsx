
import React from 'react';
import { AppStep } from '../types';

interface Props {
  currentStep: AppStep;
}

const StepIndicator: React.FC<Props> = ({ currentStep }) => {
  const steps = [
    { label: '設定輸入', step: AppStep.INPUT },
    { label: '風格提案', step: AppStep.PROPOSAL },
    { label: '引擎生成', step: AppStep.FINAL },
  ];

  return (
    <div className="bg-white/5 border-b border-white/5 px-8 py-8 flex justify-center">
      <div className="flex items-center w-full max-w-2xl">
        {steps.map((s, i) => (
          <React.Fragment key={s.step}>
            <div className="flex flex-col items-center flex-1 relative group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm z-10 transition-all duration-700 ${
                currentStep >= s.step 
                  ? 'bg-gradient-to-br from-[#00F5FF] to-[#7B2FF7] text-[#0A0E27] shadow-[0_0_25px_rgba(0,245,255,0.5)] scale-110' 
                  : 'bg-white/5 text-white/20 border border-white/10'
              }`}>
                0{i + 1}
              </div>
              <span className={`mt-4 text-[11px] font-black tracking-[0.25em] uppercase transition-colors duration-500 ${
                currentStep >= s.step ? 'text-[#00F5FF]' : 'text-white/20'
              }`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-[1px] flex-1 -mt-10 mx-[-12px] relative">
                <div className={`h-full w-full transition-all duration-1000 ${
                  currentStep > s.step ? 'bg-[#00F5FF] shadow-[0_0_10px_rgba(0,245,255,0.5)]' : 'bg-white/10'
                }`}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
