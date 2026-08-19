import React, { useState, useMemo } from 'react';
import { InventoryCard } from './InventoryCard';
import { ListingDetailModal } from './ListingDetailModal';
import { useApp } from '../context/AppContext';
import { InventoryItem } from '../types';
import { SearchX, SlidersHorizontal, HardHat, PlusCircle, Search, Sparkles } from 'lucide-react';
import { executeSearchEngine } from '../lib/searchEngine';

interface InventoryGridProps {
  onOpenSellerPortal: () => void;
  onOpenSearchEngine?: () => void;
}

export const InventoryGrid: React.FC<InventoryGridProps> = ({
  onOpenSellerPortal,
  onOpenSearchEngine
}) => {
  const { inventory, filter, resetFilters } = useApp();
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Use the Smart Search Engine algorithm for high visibility, synonym expansion, and typo tolerance
  const searchResults = useMemo(() => {
    return executeSearchEngine(inventory, {
      query: filter.searchQuery,
      category: filter.category,
      subcategory: filter.subcategory,
      condition: filter.condition,
      province: filter.province,
      make: filter.make,
      sortBy: filter.sortBy,
      expandSynonyms: true
    });
  }, [
    inventory,
    filter.searchQuery,
    filter.category,
    filter.subcategory,
    filter.condition,
    filter.province,
    filter.make,
    filter.sortBy
  ]);

  const sortedItems = searchResults.map(r => r.item);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Result Counter */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Available Inventory & Advertised Spares</span>
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {sortedItems.length} items
            </span>
            {filter.searchQuery && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 font-normal">
                matched via <span className="text-amber-400 font-semibold">Search Engine</span>
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified equipment yards, commercial truck breakers, and auto scrap yards across South Africa
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSearchEngine && (
            <button
              onClick={onOpenSearchEngine}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Smart Search (⌘K)</span>
            </button>
          )}

          <button
            onClick={onOpenSellerPortal}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Advertise Your Inventory
          </button>
        </div>
      </div>

      {/* Grid or Empty State */}
      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onSelect={(selected) => setSelectedItem(selected)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 text-white">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold">No Part or Equipment Listings Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We couldn't find any listings matching your search criteria. Try adjusting your filters, searching for an OEM part code, or searching without abbreviations.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl border border-amber-500/30 transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
            <button
              onClick={onOpenSellerPortal}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              List This Part as a Seller
            </button>
          </div>
        </div>
      )}

      {/* Listing Detail Modal */}
      {selectedItem && (
        <ListingDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onOpenSellerPortal={onOpenSellerPortal}
        />
      )}
    </div>
  );
};
