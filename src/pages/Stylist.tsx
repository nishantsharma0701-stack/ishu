import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Sparkles, ArrowRight, ShieldAlert, Award, ArrowUpRight, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';

export const Stylist: React.FC = () => {
  const { getRecommendation, selectedRecommendation, loading, products, navigateTo, user } = useApp();
  
  // Quiz multistep form state
  const [step, setStep] = useState<number>(1);
  const [skinTone, setSkinTone] = useState<string>('Medium');
  const [bodyType, setBodyType] = useState<string>('Athletic');
  const [heightRange, setHeightRange] = useState<string>('5’10 - 6’0');
  const [weightRange, setWeightRange] = useState<string>('72 kg');
  const [fashionStyle, setFashionStyle] = useState<string>('Old Money');
  const [occasion, setOccasion] = useState<string>('Date Night');
  const [budget, setBudget] = useState<string>('₹7000–₹15000');
  const [clothingFit, setClothingFit] = useState<string>('Relaxed Fit');
  const [selectedColors, setSelectedColors] = useState<string[]>(['Midnight Navy', 'Beige']);

  const colorsList = ["Midnight Navy", "Warm Sand", "Sage Green", "Slate Grey", "Cream", "Earthy Olive", "Charcoal Noir", "Burgundy"];

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(prev => prev.filter(c => c !== color));
    } else {
      setSelectedColors(prev => [...prev, color]);
    }
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      skinTone,
      bodyType,
      heightRange,
      weightRange,
      fashionStyle,
      occasion,
      budget,
      favoriteColors: selectedColors,
      clothingFit
    };

    const res = await getRecommendation(payload);
    if (res) {
      setStep(4); // transition to recommendation result dashboard screen!
    }
  };

  const resetStylistQuiz = () => {
    setStep(1);
  };

  // Find shoppable product cards that fit the recommended outfit IDs matching the catalog
  const recommendedProductModels = selectedRecommendation 
    ? products.filter(p => selectedRecommendation.matchingProductIds.includes(p.id))
    : [];

  return (
    <div className="bg-black py-12 text-white min-h-[85vh]">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        
        {/* Banner header info */}
        <div className="border-b border-neutral-905 pb-6 text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mb-3">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <h1 className="font-sans text-3xl font-extrabold tracking-tight sm:text-4xl uppercase">AI SARTORIAL PORTAL</h1>
          <p className="mt-2 text-xs text-neutral-500 uppercase tracking-widest leading-relaxed">
            Personalised clothing layouts curated on the fly by Gemini AI
          </p>
        </div>

        {/* 1. QUIZ QUESTIONNAIRE STEPS */}
        {step >= 1 && step <= 3 && (
          <form onSubmit={handleQuizSubmit} className="mt-12 bg-neutral-950 rounded-xl border border-neutral-900 overflow-hidden shadow-2xl">
            
            {/* Steps tracker breadcrumbs header */}
            <div className="grid grid-cols-3 text-center border-b border-neutral-900 bg-black font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-semibold h-12 items-center">
              <span className={step === 1 ? 'text-amber-500 font-bold' : ''}>1. Proportions</span>
              <span className={step === 2 ? 'text-amber-500 font-bold' : ''}>2. Taste Profile</span>
              <span className={step === 3 ? 'text-amber-500 font-bold' : ''}>3. Budget & Event</span>
            </div>

            <div className="p-8 sm:p-12 space-y-8">
              
              {/* STEP 1: Body Proportions Questionnaire fields */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-sans text-lg font-bold uppercase tracking-wider text-white">Select Your Proportions</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Skin Tone Selector */}
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-2">Skin Melanin Tone</label>
                      <select
                        value={skinTone}
                        onChange={(e) => setSkinTone(e.target.value)}
                        className="w-full rounded bg-neutral-900 border border-neutral-800 p-3.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Fair">Fair / Pale White</option>
                        <option value="Medium">Medium / Olive Tone</option>
                        <option value="Wheatish">Wheatish / Soft Golden Brown</option>
                        <option value="Dark">Dark Melanin / Espresso Tone</option>
                      </select>
                    </div>

                    {/* Body Type */}
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-2">Chest & Silhouette Frame</label>
                      <select
                        value={bodyType}
                        onChange={(e) => setBodyType(e.target.value)}
                        className="w-full rounded bg-neutral-900 border border-neutral-800 p-3.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Slim">Slim / Ectomorph</option>
                        <option value="Athletic">Athletic / Balanced Taper</option>
                        <option value="Muscular">Muscular / Thick Shoulders</option>
                        <option value="Heavy">Heavy Frame / Endomorph</option>
                      </select>
                    </div>

                    {/* Height selector */}
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-2">Height Span Range</label>
                      <select
                        value={heightRange}
                        onChange={(e) => setHeightRange(e.target.value)}
                        className="w-full rounded bg-neutral-900 border border-neutral-800 p-3.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="5’0 - 5’5">Short span: 5’0 - 5’5</option>
                        <option value="5’6 - 5’9">Average span: 5’6 - 5’9</option>
                        <option value="5’10 - 6’0">Tall span: 5’10 - 6’0</option>
                        <option value="6’0+">Statuesque: 6’0+</option>
                      </select>
                    </div>

                    {/* Weight input */}
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Weight Range Estimation</label>
                      <input
                        type="text"
                        placeholder="e.g. 74 kg"
                        value={weightRange}
                        onChange={(e) => setWeightRange(e.target.value)}
                        className="w-full rounded bg-neutral-900 border border-neutral-800 p-3.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-900 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="rounded bg-white hover:bg-amber-500 hover:text-black py-3 px-6 text-xs font-bold tracking-widest text-black uppercase transition-colors"
                    >
                      taste layout
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Taste Preferences (Styles, Fit, Colors) */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-sans text-lg font-bold uppercase tracking-wider text-white">Define Your Aesthetics</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Fashion Style */}
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-2">Style Narrative Archetype</label>
                      <select
                        value={fashionStyle}
                        onChange={(e) => setFashionStyle(e.target.value)}
                        className="w-full rounded bg-neutral-900 border border-neutral-800 p-3.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Casual">Casual drape</option>
                        <option value="Streetwear">Streetwear Utility</option>
                        <option value="Minimal">Quiet Minimalism</option>
                        <option value="Old Money">Savile Row Old Money</option>
                        <option value="Korean Fashion">Korean slouchy</option>
                        <option value="Formal">Modern Formal tailoring</option>
                        <option value="Luxury">Atelier High Luxury</option>
                        <option value="Smart Casual">Refined Smart Casual</option>
                      </select>
                    </div>

                    {/* Clothing Fit */}
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-2">Preferred Silhouette Slouch</label>
                      <select
                        value={clothingFit}
                        onChange={(e) => setClothingFit(e.target.value)}
                        className="w-full rounded bg-neutral-900 border border-neutral-800 p-3.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Slim Fit">Slim fit shape tracking</option>
                        <option value="Regular Fit">Contemporary regular shape</option>
                        <option value="Relaxed Fit">Relaxed casual drape</option>
                        <option value="Oversized">Boxy oversized template</option>
                      </select>
                    </div>
                  </div>

                  {/* Multi Palette Toggles */}
                  <div>
                    <span className="block text-[10px] font-mono text-neutral-400 uppercase mb-3 text-left">Ideal Palettes Colors (Select multi)</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {colorsList.map((col) => {
                        const active = selectedColors.includes(col);
                        return (
                          <button
                            key={col}
                            type="button"
                            onClick={() => toggleColor(col)}
                            className={`rounded border p-2.5 text-center text-xs font-sans transition-all ${active ? 'bg-amber-500 text-black border-amber-500 font-semibold' : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'}`}
                          >
                            {col}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-900 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="rounded border border-neutral-800 bg-black text-xs py-3 px-6 text-neutral-400 uppercase tracking-wider hover:text-white hover:border-neutral-500"
                    >
                      previous proportions
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="rounded bg-white hover:bg-amber-500 hover:text-black py-3 px-6 text-xs font-bold tracking-widest text-black uppercase transition-colors"
                    >
                      budget & occasion
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Occasion & Budget Questionnaire and Submit triggers Gemini */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-sans text-lg font-bold uppercase tracking-wider text-white">Occasion and Budget Coordinates</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Occasions options */}
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-2">Target Occasion event</label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full rounded bg-neutral-900 border border-neutral-800 p-3.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Date Night">Evening Date Night</option>
                        <option value="Party">Festive Party</option>
                        <option value="Office">Corporate Corporate standard</option>
                        <option value="Wedding">Traditional Wedding Reception</option>
                        <option value="Vacation">Coastal Island resort</option>
                        <option value="Casual Outing">Weekend city stroll</option>
                        <option value="Business Meeting">High-Stakes Boardroom convene</option>
                      </select>
                    </div>

                    {/* Budget segmentation */}
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-2">Wardrobe Cost ceiling limit</label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full rounded bg-neutral-900 border border-neutral-800 p-3.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="₹1000–₹3000">Earthy budget segment</option>
                        <option value="₹3000–₹7050">Mid level premium selections</option>
                        <option value="₹7000–₹15000">Exquisite high end bespoke limits</option>
                        <option value="Premium Luxury">Atelier infinite couture luxury</option>
                      </select>
                    </div>
                  </div>

                  {!user && (
                    <div className="rounded border border-amber-600/20 bg-amber-500/5 p-4 flex items-start space-x-3 text-xs text-amber-500">
                      <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block mb-1">Signed Out Consultation</span>
                        <span>Your customized Lookbook recommend profile will not be synced to user archives unless you sign in first. We recommend registered login session operations.</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-neutral-900 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="rounded border border-neutral-800 bg-black text-xs py-3 px-6 text-neutral-400 uppercase tracking-wider hover:text-white"
                    >
                      previous tastes
                    </button>
                    <button
                      type="submit"
                      className="rounded bg-white hover:bg-amber-500 hover:text-black py-3 px-8 text-xs font-bold tracking-widest text-black uppercase transition-all shadow-md active:scale-98"
                    >
                      Draft Lookbook recommendation
                    </button>
                  </div>
                </div>
              )}

            </div>
          </form>
        )}

        {/* 2. LOADING STATE WITH CINEMATIC MESSAGES */}
        {loading && (
          <div className="mt-16 text-center border border-neutral-900 bg-neutral-950 p-16 rounded-xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-44 w-44 items-center justify-between rounded-full bg-amber-500/5 filter blur-2xl" />
            
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-neutral-805 border-t-amber-500 mx-auto" />
            
            <h3 className="mt-8 font-sans text-lg font-bold uppercase tracking-wider text-white">Synthesizing Sartorial Fit...</h3>
            
            <div className="mt-4 font-mono text-[9px] uppercase tracking-widest text-neutral-500 max-w-sm mx-auto space-y-2">
              <p className="animate-pulse">Consulting Gemini luxury menswear engine...</p>
              <p className="text-amber-500">Balancing physical parameters with color theory limits...</p>
              <p>Curating real showroom items match layouts...</p>
            </div>
          </div>
        )}

        {/* 3. GEMINI AI RECOMMENDATION SHEET */}
        {!loading && step === 4 && selectedRecommendation && (
          <div className="mt-12 space-y-10 animate-fade-in text-left">
            
            {/* Main Outfit banner with cinematic glass panels */}
            <div className="border border-neutral-900 rounded-xl bg-gradient-to-tr from-neutral-950 via-neutral-950/40 to-neutral-950 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
              
              <div className="absolute top-6 right-6 inline-flex border border-amber-500/20 bg-amber-500/10 rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-amber-500 font-bold">
                Custom Synthesized Look
              </div>

              <div className="max-w-xl">
                <span className="font-mono text-[10px] tracking-widest text-amber-500 uppercase font-semibold">THE LOOKBOOK</span>
                <h2 className="mt-2 font-sans text-3xl font-extrabold sm:text-5xl uppercase tracking-tight text-white">{selectedRecommendation.outfitName}</h2>
                <div className="mt-2 h-[1px] w-24 bg-amber-500" />
                
                <p className="mt-6 text-sm text-neutral-300 leading-relaxed font-light italic">
                  "{selectedRecommendation.detailedStylingExplanation}"
                </p>
              </div>
            </div>

            {/* Custom fit proportions breakdown cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Proportions analysis match Card */}
              <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-6">
                <h3 className="font-mono text-[10px] text-amber-500 uppercase tracking-widest font-bold mb-4">Sartorial Matches Summary</h3>
                <p className="text-xs text-neutral-300 leading-relaxed font-light">{selectedRecommendation.whyThisOutfitSuitsUser}</p>
                <div className="mt-4 border-t border-neutral-900 pt-4 grid grid-cols-2 gap-4 text-[10px] font-mono">
                  <div>
                    <span className="block text-neutral-500 uppercase">Aesthetic style</span>
                    <span className="text-white text-xs mt-0.5 block">{selectedRecommendation.styleCategory}</span>
                  </div>
                  <div>
                    <span className="block text-neutral-500 uppercase">Recommended fit</span>
                    <span className="text-white text-xs mt-0.5 block">{selectedRecommendation.bestFitType}</span>
                  </div>
                </div>
              </div>

              {/* Extra specifications Tips Card */}
              <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-mono text-[10px] text-amber-505 uppercase tracking-widest font-bold mb-4">Style Guides & Tips</h3>
                  <ul className="space-y-3">
                    {selectedRecommendation.fashionTips.map((tip: string, i: number) => (
                      <li key={i} className="flex items-start space-x-2.5 text-xs text-neutral-400 leading-relaxed">
                        <span className="h-4 w-4 shrink-0 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-mono text-[9px] font-bold">{i+1}</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-neutral-900 pt-4 flex flex-wrap gap-1.5">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase pt-1 inline-block mr-2">Color wheels:</span>
                  {selectedRecommendation.recommendedColors.map((col: string) => (
                    <span key={col} className="rounded bg-neutral-900 px-2 py-0.5 text-[9px] font-mono text-neutral-400 capitalize">
                      {col}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* REAL DISPLAY PRODUCTS INTEGRATED GRID: User can click directly and transfer items to bag */}
            {recommendedProductModels.length > 0 && (
              <div className="border-t border-neutral-900 pt-10">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-sans text-md font-bold text-white uppercase tracking-wider">Shoppable Garments Included</h3>
                  <span className="font-mono text-[9px] text-neutral-500 uppercase">Check sizes & stock</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendedProductModels.map((p) => (
                    <div key={p.id} className="group relative bg-neutral-950 border border-neutral-900 rounded-xl overflow-hidden p-4 hover:border-amber-500 transition-colors flex flex-col justify-between">
                      <div className="aspect-[4/5] rounded overflow-hidden bg-neutral-900">
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover filter brightness-90 group-hover:scale-102 transition-transform duration-300" />
                      </div>
                      <div className="mt-4 flex-1 flex flex-col justify-between pt-1">
                        <div>
                          <span className="font-mono text-[8px] text-neutral-500 uppercase">{p.brand}</span>
                          <h4 className="font-sans text-xs font-semibold text-white truncate line-clamp-1 mt-0.5 uppercase tracking-wide">{p.name}</h4>
                          <span className="block font-mono text-xs text-amber-500 mt-1">₹{p.price.toLocaleString('en-IN')}</span>
                        </div>
                        
                        <button
                          onClick={() => navigateTo('shop', p.id)}
                          className="mt-4 flex w-full items-center justify-center space-x-1 border border-neutral-850 bg-neutral-900/40 rounded py-2 text-[10px] font-mono tracking-widest text-amber-500 font-bold uppercase hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-colors"
                        >
                          <span>Buy item</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reset / History triggers */}
            <div className="border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={resetStylistQuiz}
                className="flex items-center space-x-2 font-mono text-[9px] uppercase tracking-widest text-neutral-500 hover:text-white transition-all border border-neutral-850 rounded px-4 py-2 hover:bg-neutral-900"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Re-draft styling quiz</span>
              </button>
              
              <button
                onClick={() => navigateTo('dashboard')}
                className="font-mono text-[9px] uppercase tracking-widest text-amber-500 hover:text-white transition-colors"
              >
                Go to saved outfit library lookbook →
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
