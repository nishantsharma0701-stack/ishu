import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Star, ArrowLeft, Heart, Sparkles, MessageSquare, ShieldCheck, Truck, Clipboard, Share2, Check } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { 
    selectedProductId, 
    products, 
    addToCart, 
    toggleWishlist, 
    wishlistIds, 
    navigateTo, 
    addProductReview 
  } = useApp();

  const [product, setProduct] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [activeImg, setActiveImg] = useState<string>('');
  
  // Sizing & Color States
  const [chosenColor, setChosenColor] = useState<string>('');
  const [chosenSize, setChosenSize] = useState<string>('');
  
  // Custom Size Advisor State
  const [userHeight, setUserHeight] = useState<string>('');
  const [userWeight, setUserWeight] = useState<string>('');
  const [advisedSize, setAdvisedSize] = useState<string>('');
  
  // Interactive Review States
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string>('');

  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Fetch product from list or ID
  useEffect(() => {
    if (!selectedProductId) return;
    
    // Find current active product
    const p = products.find(x => x.id === selectedProductId);
    if (p) {
      setProduct(p);
      setActiveImg(p.image);
      setChosenColor(p.colors[0]);
      setChosenSize(p.sizes[0] === 'One Size' ? 'One Size' : p.sizes[1] || p.sizes[0]);
      
      // Determine similar products
      const filteredSim = products.filter(x => x.id !== p.id && x.category === p.category).slice(0, 3);
      setSimilar(filteredSim);
    }
  }, [selectedProductId, products]);

  if (!product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-black">
        <div className="text-center font-mono">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-800 border-t-amber-500 mx-auto mb-4" />
          <span className="text-xs text-neutral-500 uppercase tracking-widest">Decoding Product ledger...</span>
        </div>
      </div>
    );
  }

  const isWishlisted = wishlistIds.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, 1, chosenColor, chosenSize);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Smart size recommendation model: simply calculations
  const calculateSizeAdvised = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userHeight || !userWeight) return;
    
    const h = Number(userHeight); // e.g. 175cm
    const w = Number(userWeight); // e.g. 70kg

    // Simplistic sizing formula
    let size = 'M';
    if (product.sizes.includes('One Size')) {
      size = 'One Size';
    } else {
      if (w < 60) size = 'S';
      else if (w >= 60 && w < 75) size = 'M';
      else if (w >= 75 && w < 90) size = 'L';
      else if (w >= 90) size = 'XL';

      // Match against available product sizes
      if (!product.sizes.includes(size)) {
        size = product.sizes[0];
      }
    }
    setAdvisedSize(size);
    setChosenSize(size);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess(false);

    if (!newComment.trim()) {
      setReviewError("Please provide a review comment.");
      return;
    }

    try {
      await addProductReview(product.id, newRating, newComment);
      setReviewSuccess(true);
      setNewComment('');
      setNewRating(5);
    } catch (err: any) {
      setReviewError(err.message || "Failed to submit review. Make sure you are logged in.");
    }
  };

  return (
    <div className="bg-black py-12 text-white min-h-[85vh]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Breadcrumb row */}
        <button 
          onClick={() => navigateTo('shop')}
          className="flex items-center space-x-2 font-mono text-xs text-neutral-500 hover:text-white mb-10 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Exit Showroom Ledger</span>
        </button>

        {/* Product Details Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* A. Product Image Panel */}
          <div className="space-y-4">
            <div className="aspect-[3/4] overflow-hidden rounded-xl border border-neutral-900 bg-neutral-950 relative">
              <img 
                src={activeImg} 
                alt={product.name} 
                className="h-full w-full object-cover filter brightness-95"
              />
              <div className="absolute top-4 left-4 rounded bg-black/80 border border-neutral-850 px-3 py-1 font-mono text-[9px] text-amber-500 uppercase">
                {product.style} Style
              </div>
            </div>

            {/* Sub-images thumbnail list */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2.5">
                {product.images.map((imgUrl: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(imgUrl)}
                    className={`aspect-square rounded overflow-hidden border transition-all ${activeImg === imgUrl ? 'border-amber-500' : 'border-neutral-900 hover:border-neutral-700'}`}
                  >
                    <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* B. Informational Specification panel */}
          <div className="space-y-8">
            
            {/* Header info */}
            <div>
              <span className="font-mono text-xs text-amber-500 uppercase tracking-widest font-bold">{product.brand}</span>
              <h1 className="mt-2 font-sans text-3xl font-extrabold tracking-tight uppercase sm:text-4xl">{product.name}</h1>
              
              <div className="mt-4 flex items-center space-x-4 border-b border-neutral-950 pb-6 text-sm">
                <span className="font-mono text-xl font-bold text-amber-500">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <div className="h-4 w-[1px] bg-neutral-800" />
                <div className="flex items-center space-x-1 text-xs">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="font-mono text-neutral-300 font-bold">{product.rating}</span>
                  <span className="text-neutral-500 font-light">({product.reviews.length} clients)</span>
                </div>
              </div>
            </div>

            {/* Description list */}
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-neutral-400 font-light">{product.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-xs font-mono text-neutral-400 py-3 border-y border-neutral-900 bg-neutral-950/20 p-4 rounded">
                <div>
                  <span className="block text-neutral-600 uppercase mb-0.5">Composition</span>
                  <span className="text-white font-sans">{product.material}</span>
                </div>
                <div>
                  <span className="block text-neutral-600 uppercase mb-0.5">Availability</span>
                  <span className={`font-sans font-bold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} Units In Store` : 'Out Of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Selection specifications: Colors & Sizes */}
            <div>
              {/* Color swatches */}
              <div className="mb-6">
                <span className="block font-mono text-[10px] tracking-widest text-neutral-500 uppercase mb-3">Target Color: {chosenColor}</span>
                <div className="flex space-x-2">
                  {product.colors.map((c: string) => (
                    <button
                      key={c}
                      onClick={() => setChosenColor(c)}
                      className={`rounded-full px-4 py-2 text-xs border transition-all uppercase ${chosenColor === c ? 'bg-amber-500 text-black border-amber-500 font-semibold' : 'bg-neutral-950/50 text-neutral-400 border-neutral-800 hover:text-white'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size selectors */}
              <div>
                <span className="block font-mono text-[10px] tracking-widest text-neutral-500 uppercase mb-3">Torsional Size: {chosenSize}</span>
                <div className="flex space-x-2">
                  {product.sizes.map((sz: string) => (
                    <button
                      key={sz}
                      onClick={() => setChosenSize(sz)}
                      className={`rounded border px-4 py-2.5 text-xs font-mono transition-all uppercase ${chosenSize === sz ? 'bg-amber-500 border-amber-500 text-black font-extrabold shadow-md' : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700'}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SMART SIZE RECOMMENDATION TOOL */}
            {!product.sizes.includes('One Size') && (
              <div className="rounded-xl border border-neutral-900 bg-neutral-950/40 p-6 backdrop-blur-md">
                <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 uppercase tracking-widest mb-3">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Sartorial Smart Size Advisor</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-light mb-4">
                  Enter your physical proportions below to let our mathematical shape engine recommend the flawless clothing fit.
                </p>
                <form onSubmit={calculateSizeAdvised} className="grid grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Height (cm)</label>
                    <input
                      type="number"
                      placeholder="e.g. 178"
                      value={userHeight}
                      onChange={(e) => setUserHeight(e.target.value)}
                      className="w-full rounded border border-neutral-800 bg-black py-2.5 px-3 font-sans text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      placeholder="e.g. 72"
                      value={userWeight}
                      onChange={(e) => setUserWeight(e.target.value)}
                      className="w-full rounded border border-neutral-800 bg-black py-2.5 px-3 font-sans text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="col-span-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 tracking-wider font-semibold py-2.5 text-[10px] uppercase text-amber-500 transition-colors"
                  >
                    Consult Size Guide
                  </button>
                </form>

                {advisedSize && (
                  <div className="mt-4 border-t border-neutral-900 pt-3 flex items-center justify-between">
                    <span className="text-xs text-neutral-400 font-light">Advised Outfit Fitting:</span>
                    <span className="font-mono text-sm font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded">
                      SIZE {advisedSize}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Primary Action Button Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 rounded-md bg-white hover:bg-amber-500 hover:text-black py-4 text-xs font-bold tracking-widest text-black transition-colors uppercase disabled:bg-neutral-850 disabled:text-neutral-600 disabled:hover:bg-neutral-850"
              >
                {product.stock > 0 ? "Transfer to Basket" : "Showroom Exhausted"}
              </button>
              
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`rounded-md p-4 flex items-center justify-center border aspect-square ${isWishlisted ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-black border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-700'}`}
              >
                <Heart className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} />
              </button>
              
              <button
                onClick={handleShare}
                className="rounded-md p-4 flex items-center justify-center border bg-black border-neutral-850 text-neutral-400 hover:text-white"
                title="Copy share link"
              >
                {copiedLink ? <Check className="h-5 w-5 text-green-500" /> : <Share2 className="h-5 w-5" />}
              </button>
            </div>

            {/* Extra product specification tabs */}
            <div className="border-t border-neutral-900 pt-6 space-y-4">
              <div className="flex items-center space-x-3 text-xs text-neutral-400 font-light">
                <Truck className="h-4 w-4 text-amber-500" />
                <span>Complimentary priority dispatch for orders exceeding ₹15,000.</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-neutral-400 font-light">
                <ShieldCheck className="h-4 w-4 text-amber-500" />
                <span>Sartorial satisfaction guarantee. 14-days return collection.</span>
              </div>
            </div>

          </div>

        </div>

        {/* C. CLIENT REVIEWS SECTION */}
        <section className="mt-20 border-t border-neutral-900 pt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Review Stats / Form */}
          <div className="space-y-6">
            <span className="font-mono text-xs text-amber-500 uppercase tracking-widest font-bold">Client appraisal ledger</span>
            <h2 className="font-sans text-2xl font-extrabold uppercase tracking-wide">Leave A Valuation</h2>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              Your assessment guides are vital. Share your valuation regarding knit density, button quality, and drop shoulders.
            </p>

            <form onSubmit={submitReview} className="space-y-4 bg-neutral-950 p-6 rounded-xl border border-neutral-900">
              <div>
                <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-2">Assign Stars (1 - 5)</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewRating(num)}
                      className="p-1 focus:outline-none"
                    >
                      <Star className={`h-5 w-5 ${newRating >= num ? 'fill-amber-500 text-amber-500' : 'text-neutral-750'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1">Your comment</label>
                <textarea
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="The drop shoulders are immaculately shaped..."
                  className="w-full rounded border border-neutral-800 bg-black p-3 font-sans text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-amber-500"
                />
              </div>

              {reviewSuccess && (
                <div className="text-xs text-green-500 bg-green-500/10 p-3 rounded">
                  Valuation recorded. Refreshing parameters...
                </div>
              )}

              {reviewError && (
                <div className="text-xs text-red-500 bg-red-400/10 p-3 rounded">
                  {reviewError}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded bg-white hover:bg-amber-500 hover:text-black py-3 text-xs tracking-widest text-black font-semibold uppercase transition-colors"
              >
                Log Valuation
              </button>
            </form>
          </div>

          {/* Reviews logs list */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold mb-2">Appraisals Timeline</h3>
            {product.reviews.length === 0 ? (
              <div className="text-center py-16 border border-neutral-900 rounded-xl bg-neutral-950/20 p-8">
                <MessageSquare className="h-6 w-6 mx-auto text-neutral-850 mb-3" />
                <span className="block text-xs font-mono text-neutral-500 uppercase">Archive contains no valuations</span>
                <p className="text-[11px] text-neutral-600 mt-1 font-light">Be the first gentleman to report an appraisal for this design.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((rev: any) => (
                  <div key={rev.id} className="bg-neutral-950 p-6 rounded-xl border border-neutral-900 relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="h-8 w-8 overflow-hidden rounded-full border border-neutral-800 bg-neutral-900">
                          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${rev.username}`} alt="" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-white uppercase tracking-wider">{rev.username}</span>
                          <span className="block text-[8px] font-mono text-neutral-500 leading-none mt-0.5">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-0.5">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <Star key={num} className={`h-3 w-3 ${rev.rating >= num ? 'fill-amber-500 text-amber-500' : 'text-neutral-800'}`} />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed font-light">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </section>

      </div>
    </div>
  );
};
