import React, { useState } from 'react';
import {
  X,
  Building2,
  PlusCircle,
  Edit2,
  Trash2,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Search,
  HardHat,
  Eye,
  Send,
  Lock,
  Copy,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_PLANS, PROVINCES_LIST, SUBCATEGORIES } from '../data/initialData';
import {
  InventoryItem,
  Seller,
  SubscriptionPlanId,
  CategoryType,
  PartCondition,
  SAProvince
} from '../types';

interface SellerPortalModalProps {
  onClose: () => void;
  onOpenOwnerAdmin: () => void;
}

export const SellerPortalModal: React.FC<SellerPortalModalProps> = ({
  onClose,
  onOpenOwnerAdmin
}) => {
  const {
    sellers,
    activeSeller,
    setActiveSellerId,
    registerSeller,
    ownerSettings,
    submitPaymentProof,
    getSellerListings,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'subscription' | 'switch_account' | 'register'>('inventory');
  
  // Registration state
  const [regForm, setRegForm] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    whatsapp: '',
    email: '',
    province: 'Gauteng' as SAProvince,
    city: 'Johannesburg',
    address: '12 Main Road',
    planId: 'pro' as SubscriptionPlanId
  });

  // Payment proof form
  const [eftReference, setEftReference] = useState('');
  const [paymentSuccessNote, setPaymentSuccessNote] = useState('');

  // Item Form Modal state (For Adding / Editing Inventory)
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [itemForm, setItemForm] = useState({
    title: '',
    category: 'heavy_equipment' as CategoryType,
    subcategory: 'Hydraulics & Pumps',
    make: 'Caterpillar',
    model: '320D',
    year: 2021,
    partNumber: '',
    condition: 'reconditioned' as PartCondition,
    priceZar: 45000,
    province: 'Gauteng' as SAProvince,
    city: 'Johannesburg',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    isFeatured: false
  });

  const sellerListings = activeSeller ? getSellerListings(activeSeller.id) : [];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.companyName || !regForm.email || !regForm.phone) {
      alert('Please fill in all required company contact details.');
      return;
    }
    const newSeller = registerSeller(regForm);
    alert(`Account for ${newSeller.companyName} created successfully! Please review Owner Banking Details below to complete your monthly EFT subscription.`);
    setActiveTab('subscription');
  };

  const handleEftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSeller || !eftReference.trim()) return;
    submitPaymentProof(activeSeller.id, eftReference.trim());
    setPaymentSuccessNote('EFT Payment Proof reference submitted! The App Owner will review and activate your monthly subscription shortly.');
    setEftReference('');
  };

  const handleOpenAddItem = () => {
    setEditingItem(null);
    setItemForm({
      title: '',
      category: activeSeller ? 'heavy_equipment' : 'cars',
      subcategory: 'Hydraulics & Pumps',
      make: 'CAT',
      model: '320D',
      year: 2022,
      partNumber: '',
      condition: 'reconditioned',
      priceZar: 25000,
      province: activeSeller ? activeSeller.province : 'Gauteng',
      city: activeSeller ? activeSeller.city : 'Johannesburg',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      isFeatured: false
    });
    setIsItemFormOpen(true);
  };

  const handleOpenEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setItemForm({
      title: item.title,
      category: item.category,
      subcategory: item.subcategory,
      make: item.make,
      model: item.model,
      year: item.year || 2022,
      partNumber: item.partNumber || '',
      condition: item.condition,
      priceZar: item.priceZar,
      province: item.province,
      city: item.city,
      description: item.description,
      imageUrl: item.images && item.images.length > 0 ? item.images[0] : '',
      isFeatured: !!item.isFeatured
    });
    setIsItemFormOpen(true);
  };

  const handleSaveInventoryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSeller) {
      alert('Please select or register a seller account first.');
      return;
    }

    const payload = {
      sellerId: activeSeller.id,
      sellerName: activeSeller.companyName,
      sellerPhone: activeSeller.phone,
      sellerWhatsapp: activeSeller.whatsapp,
      title: itemForm.title,
      category: itemForm.category,
      subcategory: itemForm.subcategory,
      make: itemForm.make,
      model: itemForm.model,
      year: Number(itemForm.year),
      partNumber: itemForm.partNumber,
      condition: itemForm.condition,
      priceZar: Number(itemForm.priceZar),
      province: itemForm.province,
      city: itemForm.city,
      description: itemForm.description,
      specifications: {
        'Condition': itemForm.condition.toUpperCase(),
        'Location': `${itemForm.city}, ${itemForm.province}`,
        'Seller': activeSeller.companyName
      },
      images: [itemForm.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
      isFeatured: itemForm.isFeatured
    };

    if (editingItem) {
      updateInventoryItem({
        ...editingItem,
        ...payload
      });
      alert('Listing updated successfully!');
    } else {
      addInventoryItem(payload);
      alert('New inventory item added to directory!');
    }

    setIsItemFormOpen(false);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to remove this item from your inventory?')) {
      deleteInventoryItem(itemId);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied to clipboard: ${text}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl text-white my-auto flex flex-col">
        
        {/* Top Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Seller Portal & Inventory Management</h2>
              <p className="text-xs text-slate-400">
                {activeSeller ? `Logged in as: ${activeSeller.companyName}` : 'Select an account or subscribe to list parts'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950 px-6 py-2 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'inventory'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              My Inventory ({sellerListings.length})
            </button>

            <button
              onClick={() => setActiveTab('subscription')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'subscription'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Subscription & Owner Banking
            </button>

            <button
              onClick={() => setActiveTab('switch_account')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'switch_account'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Switch Seller Account
            </button>
          </div>

          <button
            onClick={() => setActiveTab('register')}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Register New Yard
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-6 flex-1">

          {/* TAB 1: INVENTORY MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {!activeSeller ? (
                <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center space-y-4">
                  <Building2 className="w-12 h-12 text-amber-400 mx-auto opacity-80" />
                  <h3 className="text-base font-bold">No Active Seller Account Selected</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Please register a new equipment/spares yard or switch to an existing seller account to manage your listings.
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setActiveTab('register')}
                      className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
                    >
                      Register New Seller
                    </button>
                    <button
                      onClick={() => setActiveTab('switch_account')}
                      className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl"
                    >
                      Select Existing Seller
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Seller Header & Action */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-white">{activeSeller.companyName}</h3>
                        {activeSeller.subscriptionStatus === 'active' ? (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Active Subscription
                          </span>
                        ) : (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {activeSeller.subscriptionStatus.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {activeSeller.city}, {activeSeller.province} | Contact: {activeSeller.contactName} ({activeSeller.phone})
                      </p>
                    </div>

                    <button
                      onClick={handleOpenAddItem}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" /> Add Inventory Listing
                    </button>
                  </div>

                  {/* Listings Grid */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Your Current Listings ({sellerListings.length})
                    </h4>

                    {sellerListings.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sellerListings.map((item) => (
                          <div
                            key={item.id}
                            className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex gap-4 items-center justify-between"
                          >
                            <div className="flex gap-3 items-center min-w-0">
                              <img
                                src={item.images[0]}
                                alt=""
                                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-800"
                              />
                              <div className="min-w-0">
                                <h5 className="font-bold text-xs text-white truncate">{item.title}</h5>
                                <div className="text-[11px] text-amber-400 font-bold mt-0.5">
                                  {formatCurrency(item.priceZar)}
                                </div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-1">
                                  <span className="uppercase">{item.condition}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {item.views}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleOpenEditItem(item)}
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                                title="Edit Listing"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors cursor-pointer"
                                title="Delete Listing"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-950/50 p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-3">
                        <HardHat className="w-10 h-10 text-slate-600 mx-auto" />
                        <div className="text-xs font-bold text-slate-300">No Inventory Items Added Yet</div>
                        <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                          Start adding your heavy machinery, truck spares, or bakkie parts to reach buyers across South Africa.
                        </p>
                        <button
                          onClick={handleOpenAddItem}
                          className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
                        >
                          Add Your First Part
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: SUBSCRIPTION & OWNER BANKING DETAILS */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              {!activeSeller ? (
                <p className="text-xs text-amber-400">Please select a seller account first.</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Current Subscription Status */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-slate-400">Subscription Status</span>
                        {activeSeller.subscriptionStatus === 'active' ? (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-bold">
                            Active
                          </span>
                        ) : activeSeller.subscriptionStatus === 'pending_verification' ? (
                          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-bold">
                            Pending Verification
                          </span>
                        ) : (
                          <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-full text-xs font-bold">
                            Unpaid / Expired
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-white">{activeSeller.companyName}</h4>
                        <div className="text-xs text-amber-400 font-semibold">
                          Plan: {SUBSCRIPTION_PLANS.find(p => p.id === activeSeller.planId)?.name} (R{SUBSCRIPTION_PLANS.find(p => p.id === activeSeller.planId)?.priceZar}/mo)
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Due Date: {new Date(activeSeller.subscriptionDueDate).toLocaleDateString('en-ZA')}
                        </div>
                      </div>

                      {activeSeller.lastPaymentRef && (
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                          <span className="text-slate-400 block text-[10px]">Submitted Payment Reference:</span>
                          <span className="font-mono font-bold text-emerald-400">{activeSeller.lastPaymentRef}</span>
                        </div>
                      )}
                    </div>

                    {/* EFT Proof Submission Form */}
                    <form onSubmit={handleEftSubmit} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5" /> Submit EFT Payment Proof Reference
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        After paying via EFT to the App Owner's bank account, enter your payment reference number below for instant verification.
                      </p>

                      {paymentSuccessNote && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs">
                          {paymentSuccessNote}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-300 font-medium">EFT Reference ID / POP Note</label>
                        <input
                          type="text"
                          value={eftReference}
                          onChange={(e) => setEftReference(e.target.value)}
                          placeholder="e.g. PS-HIGHVELD-AUG26 or FNB-981240"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Submit Payment Proof
                      </button>
                    </form>
                  </div>

                  {/* Right Column: OWNER BANKING DETAILS DISPLAY */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-6 rounded-2xl border-2 border-amber-500/40 space-y-4 shadow-xl">
                      
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-amber-400" />
                          <h3 className="font-bold text-sm text-white">App Owner Banking Details</h3>
                        </div>
                        <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded">
                          EFT PAYMENTS ONLY
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        Please transfer your monthly subscription fee to the official Part-Smart-ZA owner banking account below:
                      </p>

                      {/* Banking Details Box */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Bank Name</span>
                          <span className="font-bold text-white text-sm">{ownerSettings.bankingDetails.bankName}</span>
                        </div>

                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Account Holder</span>
                          <span className="font-bold text-white text-sm">{ownerSettings.bankingDetails.accountHolder}</span>
                        </div>

                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1 relative group">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Account Number</span>
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-amber-400 text-base">
                              {ownerSettings.bankingDetails.accountNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(ownerSettings.bankingDetails.accountNumber)}
                              className="text-slate-400 hover:text-white p-1 cursor-pointer"
                              title="Copy Account Number"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Branch Code</span>
                          <span className="font-mono font-bold text-white text-sm">{ownerSettings.bankingDetails.branchCode}</span>
                        </div>

                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Account Type</span>
                          <span className="font-semibold text-slate-200">{ownerSettings.bankingDetails.accountType}</span>
                        </div>

                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Payment Reference</span>
                          <span className="font-mono text-emerald-400 font-bold text-xs">{ownerSettings.bankingDetails.paymentReferenceFormat}</span>
                        </div>
                      </div>

                      {/* Additional Instructions */}
                      <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-amber-400 block">Payment Notes & Instructions:</span>
                        <p className="text-[11px] leading-relaxed">
                          {ownerSettings.bankingDetails.additionalInstructions}
                        </p>
                      </div>

                      <div className="text-[10px] text-slate-500 text-right">
                        Last updated by App Owner: {new Date(ownerSettings.bankingDetails.updatedAt).toLocaleDateString('en-ZA')}
                      </div>

                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 3: SWITCH SELLER ACCOUNT */}
          {activeTab === 'switch_account' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Select Active Seller Yard</h3>
                <span className="text-xs text-slate-400 font-medium">Sorted by Province & City/Town</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...sellers]
                  .sort((a, b) => {
                    if (a.province !== b.province) return a.province.localeCompare(b.province);
                    if (a.city !== b.city) return a.city.localeCompare(b.city);
                    return a.companyName.localeCompare(b.companyName);
                  })
                  .map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSellerId(s.id);
                      setActiveTab('inventory');
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      activeSeller?.id === s.id
                        ? 'bg-amber-500/15 border-amber-500'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-white">{s.companyName}</h4>
                        <p className="text-xs text-slate-400">{s.city}, {s.province}</p>
                        <p className="text-[11px] text-slate-500 mt-1">Contact: {s.contactName} ({s.phone})</p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          s.subscriptionStatus === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {s.subscriptionStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REGISTER NEW SELLER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-6 max-w-2xl mx-auto bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-base font-bold text-amber-400 border-b border-slate-800 pb-2">
                Register Equipment Yard / Breaker Account
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Company / Yard Name *</label>
                  <input
                    type="text"
                    required
                    value={regForm.companyName}
                    onChange={(e) => setRegForm({ ...regForm, companyName: e.target.value })}
                    placeholder="e.g. Witbank Truck Breakers"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={regForm.contactName}
                    onChange={(e) => setRegForm({ ...regForm, contactName: e.target.value })}
                    placeholder="e.g. Piet Botha"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value, whatsapp: regForm.whatsapp || e.target.value })}
                    placeholder="e.g. +27 82 123 4567"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    value={regForm.whatsapp}
                    onChange={(e) => setRegForm({ ...regForm, whatsapp: e.target.value })}
                    placeholder="e.g. 27821234567"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="e.g. sales@witbankbreakers.co.za"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Province *</label>
                  <select
                    value={regForm.province}
                    onChange={(e) => setRegForm({ ...regForm, province: e.target.value as SAProvince })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    {PROVINCES_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-slate-300 font-medium">City & Street Address</label>
                  <input
                    type="text"
                    value={regForm.address}
                    onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                    placeholder="e.g. 14 Industrial Park, eMalahleni"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Choose Subscription Plan */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-400">Select Monthly Subscription Plan</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {SUBSCRIPTION_PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setRegForm({ ...regForm, planId: plan.id })}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        regForm.planId === plan.id
                          ? 'bg-amber-500/20 border-amber-500'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">{plan.name}</div>
                      <div className="text-base font-black text-amber-400 mt-1">
                        R{plan.priceZar}<span className="text-[10px] text-slate-400">/month</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Up to {plan.maxListings} active listings
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
              >
                Complete Registration & View Banking Details
              </button>
            </form>
          )}

        </div>

      </div>

      {/* Add / Edit Item Sub-Modal */}
      {isItemFormOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 space-y-5 text-white my-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-amber-400">
                {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
              </h3>
              <button
                onClick={() => setIsItemFormOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInventoryItem} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Listing Title *</label>
                <input
                  type="text"
                  required
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  placeholder="e.g. Caterpillar 320D Excavator Main Hydraulic Pump"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Category *</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value as CategoryType })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="heavy_equipment">Heavy Equipment</option>
                    <option value="trucks">Trucks & Commercial</option>
                    <option value="cars">Cars & Bakkies</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Subcategory</label>
                  <input
                    type="text"
                    value={itemForm.subcategory}
                    onChange={(e) => setItemForm({ ...itemForm, subcategory: e.target.value })}
                    placeholder="e.g. Hydraulics / Engine / Gearbox"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Make / Brand *</label>
                  <input
                    type="text"
                    required
                    value={itemForm.make}
                    onChange={(e) => setItemForm({ ...itemForm, make: e.target.value })}
                    placeholder="e.g. Caterpillar / Scania / Toyota"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Model</label>
                  <input
                    type="text"
                    value={itemForm.model}
                    onChange={(e) => setItemForm({ ...itemForm, model: e.target.value })}
                    placeholder="e.g. 320D / R500 / Hilux GD-6"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Price in Rands (ZAR) *</label>
                  <input
                    type="number"
                    required
                    value={itemForm.priceZar}
                    onChange={(e) => setItemForm({ ...itemForm, priceZar: Number(e.target.value) })}
                    placeholder="e.g. 85000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Condition *</label>
                  <select
                    value={itemForm.condition}
                    onChange={(e) => setItemForm({ ...itemForm, condition: e.target.value as PartCondition })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="reconditioned">Reconditioned</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="stripping_spares">Stripping for Spares</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Image URL</label>
                <input
                  type="text"
                  value={itemForm.imageUrl}
                  onChange={(e) => setItemForm({ ...itemForm, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Full Description</label>
                <textarea
                  rows={3}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="Provide specifications, warranty terms, and yard location..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsItemFormOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
