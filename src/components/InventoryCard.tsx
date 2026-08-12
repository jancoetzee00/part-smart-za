import React, { useState } from 'react';
import {
  MapPin,
  Eye,
  CheckCircle2,
  HardHat,
  Truck,
  Car,
  MessageSquare,
  ChevronRight,
  Sparkles,
  AlertCircle,
  PhoneCall,
  Mail
} from 'lucide-react';
import { InventoryItem } from '../types';
import { useApp } from '../context/AppContext';
import { SellerContactModal } from './SellerContactModal';

interface InventoryCardProps {
  item: InventoryItem;
  onSelect: (item: InventoryItem) => void;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ item, onSelect }) => {
  const { sellers, incrementViews } = useApp();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const seller = sellers.find(s => s.id === item.sellerId);
  const isSellerActive = seller?.subscriptionStatus === 'active';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'heavy_equipment':
        return <HardHat className="w-3.5 h-3.5 text-amber-500" />;
      case 'trucks':
        return <Truck className="w-3.5 h-3.5 text-blue-500" />;
      case 'cars':
        return <Car className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <HardHat className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  const getConditionBadge = (cond: string) => {
    switch (cond) {
      case 'new':
        return (
          <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
            NEW
          </span>
        );
      case 'reconditioned':
        return (
          <span className="bg-amber-500/10 text-amber-600 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
            RECONDITIONED
          </span>
        );
      case 'used':
        return (
          <span className="bg-blue-500/10 text-blue-600 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
            USED
          </span>
        );
      case 'stripping_spares':
        return (
          <span className="bg-purple-500/10 text-purple-600 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
            STRIPPING FOR SPARES
          </span>
        );
      default:
        return null;
    }
  };

  const handleCardClick = () => {
    incrementViews(item.id);
    onSelect(item);
  };

  const handleOpenContactModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsContactModalOpen(true);
  };

  const handleWhatsappClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = item.sellerWhatsapp.replace(/\+/g, '');
    const text = encodeURIComponent(
      `Hello ${item.sellerName}, I found your listing "${item.title}" (${formatCurrency(item.priceZar)}) on Part-Smart-ZA. Is this still available?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group bg-slate-900 rounded-2xl border border-slate-800 hover:border-amber-500/50 shadow-md hover:shadow-2xl hover:shadow-amber-500/5 transition-all cursor-pointer flex flex-col overflow-hidden text-white relative"
      >
        {/* Photo Container */}
        <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-2">
              <HardHat className="w-10 h-10 opacity-40" />
              <span className="text-xs">No Photo Available</span>
            </div>
          )}

          {/* Featured Badge */}
          {item.isFeatured && (
            <div className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow flex items-center gap-1 z-10">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              FEATURED
            </div>
          )}

          {/* Condition Badge */}
          <div className="absolute top-2.5 right-2.5 z-10">
            {getConditionBadge(item.condition)}
          </div>

          {/* Price Tag Overlay */}
          <div className="absolute bottom-2.5 left-2.5 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 text-amber-400 font-black text-sm md:text-base shadow-lg z-10">
            {formatCurrency(item.priceZar)}
          </div>

          {/* Floating Action Button (FAB) for Quick Contact */}
          <button
            type="button"
            onClick={handleOpenContactModal}
            className="absolute bottom-2.5 right-2.5 z-20 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-[11px] px-3 py-1.5 rounded-full shadow-xl shadow-amber-500/30 border border-amber-300/80 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Contact Seller (Phone & Email)"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Contact</span>
          </button>
        </div>

        {/* Card Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            {/* Category & Subcategory line */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                {getCategoryIcon(item.category)}
                <span className="capitalize">{item.subcategory}</span>
              </div>
              {item.partNumber && (
                <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono text-[10px]">
                  #{item.partNumber}
                </span>
              )}
            </div>

            {/* Item Title */}
            <h3 className="font-bold text-sm md:text-base text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
              {item.title}
            </h3>

            {/* Make & Model pill */}
            <div className="mt-2 text-xs text-slate-300 font-medium">
              <span className="text-amber-400 font-bold">{item.make}</span> {item.model} {item.year ? `(${item.year})` : ''}
            </div>
          </div>

          {/* Location & Seller Footer */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{item.city}, {item.province}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Eye className="w-3 h-3" />
                <span>{item.views}</span>
              </div>
            </div>

            {/* Seller Badge & WhatsApp action */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5 min-w-0">
                {isSellerActive ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span className="text-xs font-semibold text-slate-300 truncate">
                  {item.sellerName}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleOpenContactModal}
                  className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="View Seller Phone & Email"
                >
                  <PhoneCall className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleWhatsappClick}
                  className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                  title="Chat on WhatsApp"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Seller Contact Modal */}
      {isContactModalOpen && (
        <SellerContactModal
          item={item}
          seller={seller}
          onClose={() => setIsContactModalOpen(false)}
        />
      )}
    </>
  );
};
