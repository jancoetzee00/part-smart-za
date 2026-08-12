import React, { useState } from 'react';
import {
  Wrench,
  Truck,
  Car,
  HardHat,
  Lock,
  Building2,
  ShieldAlert,
  Search,
  Menu,
  X,
  PlusCircle,
  CreditCard,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryType } from '../types';

interface HeaderProps {
  onOpenSellerPortal: () => void;
  onOpenOwnerAdmin: () => void;
  onOpenAiAssistant: () => void;
  onOpenSellersDirectory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSellerPortal,
  onOpenOwnerAdmin,
  onOpenAiAssistant,
  onOpenSellersDirectory
}) => {
  const { filter, setFilter, activeSeller, isOwnerAdminLoggedIn, ownerSettings, sellers } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Count unpaid sellers
  const unpaidCount = sellers.filter(s => s.subscriptionStatus === 'unpaid' || s.subscriptionStatus === 'pending_verification').length;

  const handleCategorySelect = (cat: CategoryType | 'all') => {
    setFilter({ category: cat, subcategory: 'All' });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      {/* Top Utility Bar */}
      <div className="bg-slate-950 text-xs py-1.5 px-4 text-slate-400 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-amber-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Part-Smart ZA
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-300">
              South Africa's Dedicated Car, Truck & Heavy Machinery Ad Network
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Sellers Directory button in top utility bar */}
            <button
              onClick={onOpenSellersDirectory}
              className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5 font-semibold"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Sellers Directory (By Location)</span>
            </button>

            {/* Owner Banking Quick Status */}
            <button
              onClick={onOpenOwnerAdmin}
              className={`flex items-center gap-1.5 transition-colors px-2 py-0.5 rounded text-xs ${
                isOwnerAdminLoggedIn
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'hover:text-amber-400 text-slate-400'
              }`}
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>
                {isOwnerAdminLoggedIn ? 'Owner Admin (Unlocked)' : 'Owner Banking & Settings'}
              </span>
              {unpaidCount > 0 && (
                <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full font-bold text-[10px]">
                  {unpaidCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenAiAssistant}
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-medium"
            >
              <Wrench className="w-3 h-3 text-amber-400" />
              <span>AI Part Finder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => handleCategorySelect('all')}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <HardHat className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  PART-SMART<span className="text-amber-500">.ZA</span>
                </span>
                <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                  SOUTH AFRICA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none mt-0.5">
                Car, Truck & Heavy Equipment Directory
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Category Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-800/70 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filter.category === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            All Inventory
          </button>

          <button
            onClick={() => handleCategorySelect('heavy_equipment')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filter.category === 'heavy_equipment'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            Heavy Equipment
          </button>

          <button
            onClick={() => handleCategorySelect('trucks')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filter.category === 'trucks'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Trucks & Trailers
          </button>

          <button
            onClick={() => handleCategorySelect('cars')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filter.category === 'cars'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            Cars & Bakkies
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Yards & Sellers Directory Button */}
          <button
            onClick={onOpenSellersDirectory}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Yards Directory</span>
          </button>

          {/* Seller Portal Button */}
          <button
            onClick={onOpenSellerPortal}
            className="relative px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <span className="block leading-none">Seller Portal</span>
              <span className="text-[10px] text-slate-400 font-normal">
                {activeSeller ? activeSeller.companyName : 'Subscribe & List Parts'}
              </span>
            </div>
            {activeSeller && (
              <span
                className={`w-2 h-2 rounded-full ${
                  activeSeller.subscriptionStatus === 'active'
                    ? 'bg-emerald-400'
                    : 'bg-amber-400'
                }`}
              ></span>
            )}
          </button>

          {/* Owner Settings Button */}
          <button
            onClick={onOpenOwnerAdmin}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Owner Settings</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                handleCategorySelect('all');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 ${
                filter.category === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-200'
              }`}
            >
              All Parts
            </button>
            <button
              onClick={() => {
                handleCategorySelect('heavy_equipment');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 ${
                filter.category === 'heavy_equipment'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-200'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" /> Heavy
            </button>
            <button
              onClick={() => {
                handleCategorySelect('trucks');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 ${
                filter.category === 'trucks'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Trucks
            </button>
            <button
              onClick={() => {
                handleCategorySelect('cars');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 ${
                filter.category === 'cars'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-200'
              }`}
            >
              <Car className="w-3.5 h-3.5" /> Cars
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                onOpenSellerPortal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              Seller Subscriptions & Listing Manager
            </button>
            <button
              onClick={() => {
                onOpenOwnerAdmin();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              App Owner Banking Details & Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
