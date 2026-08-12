import React from 'react';
import {
  Search,
  MapPin,
  HardHat,
  Truck,
  Car,
  ShieldCheck,
  CreditCard,
  Zap,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PROVINCES_LIST } from '../data/initialData';
import { CategoryType, SAProvince } from '../types';

interface HeroBannerProps {
  onOpenSellerPortal: () => void;
  onOpenOwnerAdmin: () => void;
  onOpenSellersDirectory: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenSellerPortal,
  onOpenOwnerAdmin,
  onOpenSellersDirectory
}) => {
  const { filter, setFilter, inventory, sellers } = useApp();

  const totalParts = inventory.length;
  const activeSellers = sellers.filter(s => s.subscriptionStatus === 'active').length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
      {/* Background Industrial Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-950 to-slate-950 pointer-events-none"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Copy */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>South Africa's Heavy Duty Spares & Equipment Exchange</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              BUY & ADVERTISE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-300">
                CAR, TRUCK & HEAVY EQUIPMENT
              </span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              Connect directly with verified South African earthmoving yards, truck breakers, and auto scrap dealers. Monthly seller subscriptions with direct EFT owner banking.
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span><strong className="text-white font-bold">{totalParts}+</strong> Listed Inventory</span>
              </div>
              <button
                type="button"
                onClick={onOpenSellersDirectory}
                className="flex items-center gap-1.5 bg-indigo-900/40 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span><strong className="text-white font-bold">{activeSellers}</strong> Yards Sorted by Province & City</span>
                <ChevronRight className="w-3 h-3 text-indigo-400" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Direct WhatsApp & Call Leads</span>
              </div>
            </div>

            {/* Search Bar Container */}
            <form onSubmit={handleSearchSubmit} className="pt-2">
              <div className="bg-slate-900/90 p-2 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md flex flex-col md:flex-row gap-2">
                
                {/* Search Text Input */}
                <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 focus-within:border-amber-500 transition-colors">
                  <Search className="w-4 h-4 text-amber-400 shrink-0" />
                  <input
                    type="text"
                    value={filter.searchQuery}
                    onChange={(e) => setFilter({ searchQuery: e.target.value })}
                    placeholder="Search CAT excavator pump, Scania gearbox, Hilux GD-6..."
                    className="w-full bg-transparent text-white text-xs md:text-sm placeholder:text-slate-500 focus:outline-none"
                  />
                </div>

                {/* Province Selector */}
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <select
                    value={filter.province}
                    onChange={(e) => setFilter({ province: e.target.value as SAProvince | 'all' })}
                    className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-slate-900 text-white">All SA Provinces</option>
                    {PROVINCES_LIST.map((prov) => (
                      <option key={prov} value={prov} className="bg-slate-900 text-white">
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Search Button */}
                <button
                  type="button"
                  onClick={() => setFilter({ category: filter.category })}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  Find Parts
                </button>
              </div>
            </form>
          </div>

          {/* Category Cards & Seller Banner */}
          <div className="lg:col-span-5 space-y-3">
            
            {/* Quick Category Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setFilter({ category: 'heavy_equipment', subcategory: 'All' })}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  filter.category === 'heavy_equipment'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
                  <HardHat className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-white">Heavy Equipment</div>
                <div className="text-[10px] text-slate-400 mt-0.5">CAT, Komatsu, JCB</div>
              </button>

              <button
                onClick={() => setFilter({ category: 'trucks', subcategory: 'All' })}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  filter.category === 'trucks'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-white">Trucks & Commercial</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Scania, Volvo, Isuzu</div>
              </button>

              <button
                onClick={() => setFilter({ category: 'cars', subcategory: 'All' })}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  filter.category === 'cars'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
                  <Car className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-white">Cars & Bakkies</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Toyota, Ford, Spares</div>
              </button>
            </div>

            {/* Seller Subscription CTA Box */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Are you a Spares Yard or Breaker?</span>
                </div>
                <p className="text-xs text-slate-300">
                  Subscribe from <strong>R450/month</strong>. List inventory & edit anytime.
                </p>
              </div>

              <button
                onClick={onOpenSellerPortal}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold text-xs rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
              >
                Subscribe <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
