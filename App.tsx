
import React, { useState } from 'react';
import { AppStep, ProductData, Proposal } from './types';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import Step1Input from './components/Step1Input';
import Step2Proposal from './components/Step2Proposal';
import Step3Final from './components/Step3Final';
import { generateProposals } from './services/gemini';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.INPUT);
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    details: '',
    productImages: [],
    referenceImages: [],
    referenceDesc: '',
    useRef: false,
    styles: [],
    constraints: []
  });
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStartDesign = async (data: ProductData) => {
    setLoading(true);
    try {
      setProductData(data);
      const res = await generateProposals(data);
      setProposals(res);
      setCurrentStep(AppStep.PROPOSAL);
    } catch (err) {
      console.error(err);
      alert("生成提案失敗，請檢查網路或 API Key。");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setCurrentStep(AppStep.FINAL);
  };

  return (
    <div className="min-h-screen pb-24 bg-transparent selection:bg-[#00F5FF] selection:text-[#0A0E27]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="glass-card glow-md overflow-hidden border border-[#00F5FF]/20 shadow-2xl">
          <StepIndicator currentStep={currentStep} />
          
          <div className="p-8 md:p-14">
            {currentStep === AppStep.INPUT && (
              <Step1Input 
                onNext={handleStartDesign} 
                isLoading={loading} 
              />
            )}
            
            {currentStep === AppStep.PROPOSAL && (
              <Step2Proposal 
                proposals={proposals} 
                onSelect={handleSelectProposal}
                onBack={() => setCurrentStep(AppStep.INPUT)}
              />
            )}
            
            {currentStep === AppStep.FINAL && selectedProposal && (
              <Step3Final 
                proposal={selectedProposal} 
                productData={productData}
                onBack={() => setCurrentStep(AppStep.PROPOSAL)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Aurora Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-[#0A0E27]/90 backdrop-blur-3xl z-[100] flex items-center justify-center p-6 transition-all">
          <div className="text-center space-y-10 max-w-lg animate-in fade-in zoom-in duration-500">
            <div className="relative w-40 h-40 mx-auto">
              <div className="absolute inset-0 border-2 border-[#00F5FF]/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-[#00F5FF] border-r-[#7B2FF7] border-b-[#00FF88] rounded-full animate-spin"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-[#00F5FF]/20 to-[#7B2FF7]/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black font-heiti text-white tracking-[0.2em] uppercase text-aurora">Harmonizing Aurora Core</h3>
              <p className="text-[#00F5FF]/60 font-medium text-lg tracking-wide">
                正在進行材質特徵共振... <br/>
                系統正在精準鎖定產品邏輯與全球風格配比。
              </p>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-16 text-center opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#00F5FF]">
          AURORA BOREALIS S20 DESIGN SYSTEM &copy; 2025
        </p>
      </footer>
    </div>
  );
};

export default App;
