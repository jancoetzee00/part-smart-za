import React from 'react';
import { Filter, RotateCcw, MapPin, Tag, ArrowUpDown, HardHat, Truck, Car } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PROVINCES_LIST, SUBCATEGORIES } from '../data/initialData';
import { CategoryType, PartCondition, SAProvince, FilterState } from '../types';

export const InventoryFilter: React.FC = () => {
  const { filter, setFilter, resetFilters, inventory } = useApp();

  const currentCategory = filter.category;

  // Get available subcategories for selected category
  const availableSubcategories =
    currentCategory === 'all'
      ? ['All', 'Hydraulics & Pumps', 'Engines & Transmissions', 'Gearboxes', 'Buckets & Attachments', 'Stripping for Spares']
      : SUBCATEGORIES[currentCategory] || ['All'];

  const handleConditionChange = (cond: PartCondition | 'all') => {
    setFilter({ condition: cond });
  };

  const handleSubcategoryChange = (sub: string) => {
    setFilter({ subcategory: sub });
  };

  const isFiltered =
    filter.searchQuery !== '' ||
    filter.category !== 'all' ||
    filter.subcategory !== 'All' ||
    filter.condition !== 'all' ||
    filter.province !== 'all' ||
    filter.make !== '';

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white py-4 px-4 shadow-md sticky top-14 z-30">
      <div className="max-w-7xl mx-auto space-y-3">
        
        {/* Top Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Main Category Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilter({ category: 'all', subcategory: 'All' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter.category === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Categories
            </button>
            <button
              onClick={() => setFilter({ category: 'heavy_equipment', subcategory: 'All' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                filter.category === 'heavy_equipment'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              Heavy
            </button>
            <button
              onClick={() => setFilter({ category: 'trucks', subcategory: 'All' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                filter.category === 'trucks'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              Trucks
            </button>
            <button
              onClick={() => setFilter({ category: 'cars', subcategory: 'All' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                filter.category === 'cars'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              Cars
            </button>
          </div>

          {/* Location & Sort Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Province Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={filter.province}
                onChange={(e) => setFilter({ province: e.target.value as SAProvince | 'all' })}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All SA Provinces</option>
                {PROVINCES_LIST.map((prov) => (
                  <option key={prov} value={prov} className="bg-slate-900">
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={filter.sortBy}
                onChange={(e) => setFilter({ sortBy: e.target.value as FilterState['sortBy'] })}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-slate-900">Newest First</option>
                <option value="price_low" className="bg-slate-900">Price: Low to High</option>
                <option value="price_high" className="bg-slate-900">Price: High to Low</option>
                <option value="views" className="bg-slate-900">Most Popular</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-xl border border-amber-500/20 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Subcategories & Condition Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
          
          {/* Subcategory Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Subcategory:
            </span>
            {availableSubcategories.map((sub) => {
              const isSelected = filter.subcategory === sub || (sub === 'All' && filter.subcategory === 'All');
              return (
                <button
                  key={sub}
                  onClick={() => handleSubcategoryChange(sub)}
                  className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all font-medium ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>

          {/* Condition Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Condition:
            </span>
            <button
              onClick={() => handleConditionChange('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filter.condition === 'all'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleConditionChange('new')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filter.condition === 'new'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              New
            </button>
            <button
              onClick={() => handleConditionChange('reconditioned')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filter.condition === 'reconditioned'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Reconditioned
            </button>
            <button
              onClick={() => handleConditionChange('used')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filter.condition === 'used'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Used
            </button>
            <button
              onClick={() => handleConditionChange('stripping_spares')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filter.condition === 'stripping_spares'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Stripping for Spares
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
