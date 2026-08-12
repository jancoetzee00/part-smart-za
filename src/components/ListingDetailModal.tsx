import React, { useState } from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  Mail,
  HardHat,
  Truck,
  Car,
  ShieldCheck,
  Building2,
  Share2,
  ExternalLink,
  Info,
  CreditCard
} from 'lucide-react';
import { InventoryItem } from '../types';
import { useApp } from '../context/AppContext';

interface ListingDetailModalProps {
  item: InventoryItem;
  onClose: () => void;
  onOpenSellerPortal: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  item,
  onClose,
  onOpenSellerPortal
}) => {
  const { sellers, ownerSettings } = useApp();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const seller = sellers.find(s => s.id === item.sellerId);
  const isSellerActive = seller?.subscriptionStatus === 'active';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleWhatsapp = () => {
    const cleanPhone = item.sellerWhatsapp.replace(/\+/g, '');
    const text = encodeURIComponent(
      `Hello ${item.sellerName}, I am inquiring about your listing "${item.title}" (${formatCurrency(item.priceZar)}) listed on Part-Smart-ZA.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handlePhone = () => {
    window.open(`tel:${item.sellerPhone}`, '_self');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl text-white my-auto flex flex-col">
        
        {/* Modal Top Navigation */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase">
              {item.category.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-400">Listing ID: #{item.id}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Image Gallery & Specs */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Main Photo */}
              <div className="relative aspect-[4/3] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[selectedImageIndex] || item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                    <HardHat className="w-12 h-12 opacity-30" />
                    <span className="text-xs mt-2">No Photo Provided</span>
                  </div>
                )}
                
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur px-3 py-1 rounded-xl text-amber-400 text-sm font-black border border-slate-800">
                  {formatCurrency(item.priceZar)}
                </div>
              </div>

              {/* Thumbnails */}
              {item.images && item.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {item.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImageIndex === idx ? 'border-amber-500 scale-105' : 'border-slate-800 opacity-60'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Title & Key Attributes */}
              <div className="space-y-2 pt-2">
                <h1 className="text-xl md:text-2xl font-black text-white leading-tight">
                  {item.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span className="bg-slate-800 px-2.5 py-1 rounded-lg">
                    Make: <strong className="text-amber-400">{item.make}</strong>
                  </span>
                  <span className="bg-slate-800 px-2.5 py-1 rounded-lg">
                    Model: <strong>{item.model}</strong>
                  </span>
                  {item.year && (
                    <span className="bg-slate-800 px-2.5 py-1 rounded-lg">
                      Year: <strong>{item.year}</strong>
                    </span>
                  )}
                  {item.partNumber && (
                    <span className="bg-slate-800 px-2.5 py-1 rounded-lg font-mono">
                      Part #: <strong>{item.partNumber}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Item Description & Condition Notes
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              {/* Specifications Table */}
              {item.specifications && Object.keys(item.specifications).length > 0 && (
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(item.specifications).map(([key, val]) => (
                      <div key={key} className="bg-slate-900 p-2 rounded-xl border border-slate-800/60">
                        <span className="block text-[10px] text-slate-400 font-medium">{key}</span>
                        <span className="font-semibold text-white">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Seller Details & Direct Contact */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Price Card */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
                <div className="text-xs text-slate-400">Advertised Price</div>
                <div className="text-3xl font-black text-amber-400">
                  {formatCurrency(item.priceZar)}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Located in <strong>{item.city}, {item.province}</strong></span>
                </div>
              </div>

              {/* Seller Business Card */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Advertiser Info
                    </span>
                  </div>

                  {isSellerActive ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Subscribed Yard
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      <Info className="w-3 h-3" /> Pending Verification
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-white">{item.sellerName}</h2>
                  {seller && (
                    <p className="text-xs text-slate-400">
                      {seller.address}, {seller.city} ({seller.province})
                    </p>
                  )}
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleWhatsapp}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
                    Chat Directly on WhatsApp
                  </button>

                  <button
                    onClick={handlePhone}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    Call Seller: {item.sellerPhone}
                  </button>
                </div>
              </div>

              {/* Owner Banking & Safety Banner */}
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <CreditCard className="w-4 h-4" />
                  <span>Part-Smart-ZA Subscription Notice</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  All seller subscription fees are paid directly to Part-Smart-ZA owner banking account ({ownerSettings.bankingDetails.bankName}). Deal directly with advertisers for inventory purchases.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
