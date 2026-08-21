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
  AlertTriangle,
  Globe,
  Sparkles,
  SlidersHorizontal,
  Heart,
  Flame,
  Trophy,
  Monitor,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryType } from '../types';
import { isLocalAppEnvironment } from '../lib/env';

interface HeaderProps {
  onOpenSellerPortal: () => void;
  onOpenOwnerAdmin: () => void;
  onOpenAiAssistant: () => void;
  onOpenSellersDirectory: () => void;
  onOpenSearchEngine: () => void;
  onOpenVisibilityCenter: () => void;
  onOpenSpecialsCompetitions: () => void;
  onOpenDesktopShortcut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSellerPortal,
  onOpenOwnerAdmin,
  onOpenAiAssistant,
  onOpenSellersDirectory,
  onOpenSearchEngine,
  onOpenVisibilityCenter,
  onOpenSpecialsCompetitions,
  onOpenDesktopShortcut
}) => {
  const { filter, setFilter, activeSeller, isOwnerAdminLoggedIn, ownerSettings, sellers, favorites, specials, competitions } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showOwnerControls = isLocalAppEnvironment() || isOwnerAdminLoggedIn;
  const showSellersDirectory = isLocalAppEnvironment() || isOwnerAdminLoggedIn;

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
              South Africa's Dedicated Car, Truck & Heavy Machinery Search Engine & Ad Network
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Specials & Competitions Shortcut in Top Bar */}
            <button
              onClick={onOpenSpecialsCompetitions}
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 font-bold cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded"
            >
              <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              <span>Specials & Competitions</span>
              <span className="bg-orange-500 text-slate-950 px-1 py-0.2 rounded text-[9px] font-black">
                {specials.length} DEALS
              </span>
            </button>

            {/* Desktop Link Shortcut */}
            <button
              onClick={onOpenDesktopShortcut}
              className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 font-semibold cursor-pointer"
              title="Download Desktop Link or Install App"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop App</span>
            </button>

            {/* Search Engine & SEO Visibility */}
            <button
              onClick={onOpenVisibilityCenter}
              className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SEO & Search Visibility</span>
            </button>

            {/* Sellers Directory button in top utility bar - Local App / Admin Only */}
            {showSellersDirectory && (
              <button
                onClick={onOpenSellersDirectory}
                className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 font-semibold cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Sellers Directory</span>
              </button>
            )}

            {/* Owner Quick Status - Shown on Local App or when logged in */}
            {showOwnerControls && (
              <button
                onClick={onOpenOwnerAdmin}
                className={`flex items-center gap-1.5 transition-colors px-2 py-0.5 rounded text-xs cursor-pointer ${
                  isOwnerAdminLoggedIn
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
                }`}
                title="App Owner Banking & Administration"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>{isOwnerAdminLoggedIn ? 'Owner Admin' : 'Owner Settings'}</span>
                {unpaidCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full font-bold text-[10px]">
                    {unpaidCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={onOpenAiAssistant}
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <Wrench className="w-3 h-3 text-amber-400" />
              <span>AI Part Finder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
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
                Spares Search Engine & Scrap Yard Exchange
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Engine Shortcut Bar */}
        <button
          onClick={onOpenSearchEngine}
          className="hidden md:flex items-center gap-3 bg-slate-950 hover:bg-slate-850 border border-slate-700/80 hover:border-amber-500/50 px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-all cursor-pointer shadow-inner min-w-[280px] lg:min-w-[340px] justify-between group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-slate-400 group-hover:text-slate-200">
              Smart Search Engine...
            </span>
          </div>
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono">
            <span>⌘K</span>
          </div>
        </button>

        {/* Desktop Category Navigation */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-800/70 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              filter.category === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleCategorySelect('heavy_equipment')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              filter.category === 'heavy_equipment'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            Heavy
          </button>
          <button
            onClick={() => handleCategorySelect('trucks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              filter.category === 'trucks'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Trucks
          </button>
          <button
            onClick={() => handleCategorySelect('cars')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              filter.category === 'cars'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            Cars
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Specials & Competitions Quick Button */}
          <button
            onClick={onOpenSpecialsCompetitions}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            title="View Seller Specials & Scrap Yard Competitions"
          >
            <Flame className="w-4 h-4 fill-slate-950" />
            <span>Specials & Competitions</span>
            <span className="bg-slate-950 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {specials.length}
            </span>
          </button>

          {/* Desktop Link Button */}
          <button
            onClick={onOpenDesktopShortcut}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Download 1-Click Desktop Link or Install App"
          >
            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
            <span>Desktop Link</span>
          </button>

          {/* Saved Parts Button */}
          <button
            onClick={() => setFilter({ onlyFavorites: !filter.onlyFavorites })}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border ${
              filter.onlyFavorites
                ? 'bg-rose-600 border-rose-500 text-white shadow-rose-950/40'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white'
            }`}
            title="View saved inventory items"
          >
            <Heart className={`w-3.5 h-3.5 ${filter.onlyFavorites ? 'fill-white text-white' : favorites.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>Saved</span>
            {favorites.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${filter.onlyFavorites ? 'bg-white text-rose-600' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}>
                {favorites.length}
              </span>
            )}
          </button>

          {/* Yards & Sellers Directory Button - Local App / Admin Only */}
          {showSellersDirectory && (
            <button
              onClick={onOpenSellersDirectory}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Yards</span>
            </button>
          )}

          {/* Seller Portal Button */}
          <button
            onClick={onOpenSellerPortal}
            className="relative px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <span className="block leading-none">Seller Portal</span>
              <span className="text-[10px] text-slate-400 font-normal">
                {activeSeller ? activeSeller.companyName : 'Plans & List Parts'}
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

          {/* Owner Settings Button - Visible in Local App or when logged in */}
          {showOwnerControls && (
            <button
              onClick={onOpenOwnerAdmin}
              className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                isOwnerAdminLoggedIn
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/10'
              }`}
              title="App Owner Banking Details & Settings"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isOwnerAdminLoggedIn ? 'Owner Admin' : 'Owner'}</span>
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 p-4 space-y-3">
          {/* Mobile Search Engine Launch */}
          <button
            onClick={() => {
              onOpenSearchEngine();
              setIsMobileMenuOpen(false);
            }}
            className="w-full py-2.5 bg-slate-950 border border-amber-500/40 text-amber-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Launch Smart Search Engine</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                handleCategorySelect('all');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 cursor-pointer ${
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
              className={`p-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 cursor-pointer ${
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
              className={`p-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 cursor-pointer ${
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
              className={`p-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 cursor-pointer ${
                filter.category === 'cars'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-200'
              }`}
            >
              <Car className="w-3.5 h-3.5" /> Cars
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            {/* Specials & Competitions Button in Mobile Menu */}
            <button
              onClick={() => {
                onOpenSpecialsCompetitions();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 rounded-lg text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Flame className="w-4 h-4 fill-slate-950" />
              <span>Seller Specials & Yard Competitions ({specials.length} Active Deals)</span>
            </button>

            {/* Desktop Link Button in Mobile Menu */}
            <button
              onClick={() => {
                onOpenDesktopShortcut();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-950/80 to-slate-800 hover:from-cyan-900/80 hover:to-slate-700 border border-cyan-500/40 text-cyan-300 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Monitor className="w-4 h-4 text-cyan-400" />
              <span>Desktop Link & App Install (1-Click)</span>
            </button>

            {/* Saved Parts Button in Mobile Menu */}
            <button
              onClick={() => {
                setFilter({ onlyFavorites: !filter.onlyFavorites });
                setIsMobileMenuOpen(false);
              }}
              className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                filter.onlyFavorites
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${filter.onlyFavorites || favorites.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} ${filter.onlyFavorites ? 'fill-white text-white' : ''}`} />
              <span>Saved Parts ({favorites.length})</span>
            </button>

            <button
              onClick={() => {
                onOpenVisibilityCenter();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>SEO & Search Visibility Center</span>
            </button>

            {/* Sellers Directory in Mobile Menu - Local App / Admin Only */}
            {showSellersDirectory && (
              <button
                onClick={() => {
                  onOpenSellersDirectory();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Sellers Directory (By Location)</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenSellerPortal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Seller Subscriptions & Listing Manager</span>
            </button>

            {/* Owner Button - Visible on Local App or when logged in */}
            {showOwnerControls && (
              <button
                onClick={() => {
                  onOpenOwnerAdmin();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                  isOwnerAdminLoggedIn
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>{isOwnerAdminLoggedIn ? 'Owner Admin Console' : 'App Owner Banking Details & Settings'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
