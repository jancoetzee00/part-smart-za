import React, { useState, useMemo } from 'react';
import {
  X,
  Lock,
  Unlock,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit,
  Save,
  ShieldAlert,
  Key,
  Users,
  DollarSign,
  Info,
  Send,
  Sparkles,
  Check,
  Search,
  Filter,
  CheckSquare,
  Square,
  HardHat,
  Truck,
  Car,
  Layers,
  AlertOctagon,
  Eye,
  MapPin,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OwnerBankingDetails, Seller, SubscriptionStatus, SubscriptionPlanId, InventoryItem, CategoryType } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/initialData';
import { CATEGORY_VISUALS } from '../data/categoryImages';
import { isLocalAppEnvironment } from '../lib/env';

interface OwnerAdminModalProps {
  onClose: () => void;
}

export const OwnerAdminModal: React.FC<OwnerAdminModalProps> = ({ onClose }) => {
  const {
    ownerSettings,
    isOwnerAdminLoggedIn,
    loginOwner,
    logoutOwner,
    updateOwnerPassword,
    updateOwnerBankingDetails,
    sellers,
    updateSellerStatus,
    updateSeller,
    deleteSeller,
    inventory,
    deleteInventoryItem,
    deleteMultipleInventoryItems
  } = useApp();

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<'banking' | 'sellers' | 'inventory' | 'unpaid' | 'security'>('sellers');

  // Action status message
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Banking Details Form state
  const [bankForm, setBankForm] = useState<OwnerBankingDetails>({
    ...ownerSettings.bankingDetails
  });
  const [bankSaveSuccess, setBankSaveSuccess] = useState(false);

  // Security Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [passSaveSuccess, setPassSaveSuccess] = useState(false);

  // Sellers Filter State
  const [sellerSearch, setSellerSearch] = useState('');
  const [sellerStatusFilter, setSellerStatusFilter] = useState<string>('all');
  const [sellerProvinceFilter, setSellerProvinceFilter] = useState<string>('all');

  // Inventory Moderation Filter State
  const [invSearch, setInvSearch] = useState('');
  const [invCategoryFilter, setInvCategoryFilter] = useState<string>('all');
  const [invSellerFilter, setInvSellerFilter] = useState<string>('all');
  const [invConditionFilter, setInvConditionFilter] = useState<string>('all');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // In-App Deletion Confirmation States (bypasses browser window.confirm blocking)
  const [sellerPendingDelete, setSellerPendingDelete] = useState<Seller | null>(null);
  const [itemPendingDelete, setItemPendingDelete] = useState<InventoryItem | null>(null);
  const [batchDeletePending, setBatchDeletePending] = useState<boolean>(false);

  const showNotice = (message: string, type: 'success' | 'error' = 'success') => {
    setActionNotice({ type, message });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginOwner(passwordInput.trim());
    if (!success) {
      setLoginError('Incorrect password. Default owner password is "admin123".');
    } else {
      showNotice('Authenticated as Part-Smart-ZA Platform Owner.');
    }
  };

  // Save Banking Details
  const handleSaveBanking = (e: React.FormEvent) => {
    e.preventDefault();
    updateOwnerBankingDetails(bankForm);
    setBankSaveSuccess(true);
    showNotice('Owner banking details updated and synchronized with seller portal.');
    setTimeout(() => setBankSaveSuccess(false), 3000);
  };

  // Save New Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    updateOwnerPassword(newPassword.trim());
    setPassSaveSuccess(true);
    setNewPassword('');
    showNotice('Owner admin password updated successfully.');
    setTimeout(() => setPassSaveSuccess(false), 3000);
  };

  // Owner approve / activate payment
  const handleApproveSeller = (sellerId: string) => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    updateSellerStatus(sellerId, 'active', nextMonth.toISOString());
    showNotice('Seller subscription approved and marked ACTIVE for 30 days.');
  };

  // Owner mark seller unpaid
  const handleMarkUnpaid = (sellerId: string) => {
    updateSellerStatus(sellerId, 'unpaid');
    showNotice('Seller marked as UNPAID.');
  };

  // OWNER REQUEST SELLER DELETION
  const handleDeleteSeller = (seller: Seller) => {
    setSellerPendingDelete(seller);
  };

  // EXECUTE CONFIRMED SELLER DELETION
  const executeConfirmDeleteSeller = () => {
    if (!sellerPendingDelete) return;
    const seller = sellerPendingDelete;
    const sellerItemCount = inventory.filter((item) => item.sellerId === seller.id).length;
    
    deleteSeller(seller.id, true);
    setSellerPendingDelete(null);
    showNotice(`Seller "${seller.companyName}" and ${sellerItemCount} listing(s) have been deleted.`);
  };

  // OWNER REQUEST SINGLE INVENTORY ITEM DELETION
  const handleDeleteSingleItem = (item: InventoryItem) => {
    setItemPendingDelete(item);
  };

  // EXECUTE CONFIRMED SINGLE INVENTORY ITEM DELETION
  const executeConfirmDeleteSingleItem = () => {
    if (!itemPendingDelete) return;
    const item = itemPendingDelete;
    deleteInventoryItem(item.id);
    setSelectedItemIds((prev) => prev.filter((id) => id !== item.id));
    setItemPendingDelete(null);
    showNotice(`Listing "${item.title}" was deleted.`);
  };

  // OWNER REQUEST BATCH DELETE SELECTED ITEMS
  const handleBatchDeleteItems = () => {
    if (selectedItemIds.length === 0) return;
    setBatchDeletePending(true);
  };

  // EXECUTE CONFIRMED BATCH DELETE
  const executeConfirmBatchDelete = () => {
    if (selectedItemIds.length === 0) {
      setBatchDeletePending(false);
      return;
    }
    const count = selectedItemIds.length;
    deleteMultipleInventoryItems(selectedItemIds);
    setSelectedItemIds([]);
    setBatchDeletePending(false);
    showNotice(`${count} inventory listing(s) successfully removed from the app.`);
  };

  // Toggle Item Selection
  const toggleSelectItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Filter and sort sellers
  const filteredSellers = useMemo(() => {
    return sellers
      .filter((s) => {
        const matchesSearch =
          s.companyName.toLowerCase().includes(sellerSearch.toLowerCase()) ||
          s.email.toLowerCase().includes(sellerSearch.toLowerCase()) ||
          s.contactName.toLowerCase().includes(sellerSearch.toLowerCase()) ||
          s.city.toLowerCase().includes(sellerSearch.toLowerCase()) ||
          s.province.toLowerCase().includes(sellerSearch.toLowerCase());

        const matchesStatus = sellerStatusFilter === 'all' || s.subscriptionStatus === sellerStatusFilter;
        const matchesProvince = sellerProvinceFilter === 'all' || s.province.toLowerCase() === sellerProvinceFilter.toLowerCase();

        return matchesSearch && matchesStatus && matchesProvince;
      })
      .sort((a, b) => {
        if (a.province !== b.province) return a.province.localeCompare(b.province);
        if (a.city !== b.city) return a.city.localeCompare(b.city);
        return a.companyName.localeCompare(b.companyName);
      });
  }, [sellers, sellerSearch, sellerStatusFilter, sellerProvinceFilter]);

  // Filter inventory items for moderation
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const q = invSearch.toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.make.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        (item.partNumber && item.partNumber.toLowerCase().includes(q)) ||
        (item.oemNumber && item.oemNumber.toLowerCase().includes(q)) ||
        item.sellerName.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.province.toLowerCase().includes(q);

      const matchesCat = invCategoryFilter === 'all' || item.category === invCategoryFilter;
      const matchesSeller = invSellerFilter === 'all' || item.sellerId === invSellerFilter;
      const matchesCond = invConditionFilter === 'all' || item.condition === invConditionFilter;

      return matchesSearch && matchesCat && matchesSeller && matchesCond;
    });
  }, [inventory, invSearch, invCategoryFilter, invSellerFilter, invConditionFilter]);

  // Select all filtered items toggle
  const areAllFilteredSelected =
    filteredInventory.length > 0 &&
    filteredInventory.every((item) => selectedItemIds.includes(item.id));

  const handleToggleSelectAllFiltered = () => {
    if (areAllFilteredSelected) {
      const filteredIdSet = new Set(filteredInventory.map((i) => i.id));
      setSelectedItemIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
    } else {
      const newIds = new Set([...selectedItemIds, ...filteredInventory.map((i) => i.id)]);
      setSelectedItemIds(Array.from(newIds));
    }
  };

  // Calculate unpaid sellers & items
  const unpaidSellers = sellers.filter(
    (s) => s.subscriptionStatus === 'unpaid' || s.subscriptionStatus === 'pending_verification'
  );
  const unpaidSellerIds = unpaidSellers.map((s) => s.id);
  const unpaidItems = inventory.filter((item) => unpaidSellerIds.includes(item.sellerId));

  // Revenue calculation
  const activeSellersList = sellers.filter((s) => s.subscriptionStatus === 'active');
  const monthlyRevenue = activeSellersList.reduce((acc, s) => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === s.planId);
    return acc + (plan ? plan.priceZar : 0);
  }, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[92vh] overflow-y-auto shadow-2xl text-white my-auto flex flex-col">
        
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold">
                  Part-Smart-ZA App Owner Console
                </h2>
                {isLocalAppEnvironment() ? (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Local Dev Mode
                  </span>
                ) : (
                  <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Public Mode
                  </span>
                )}
                {isOwnerAdminLoggedIn && (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Authenticated
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Delete irrelevant sellers & inventory, manage banking details, and verify monthly subscriptions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwnerAdminLoggedIn && (
              <button
                onClick={logoutOwner}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Lock
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Notification Ribbon */}
        {actionNotice && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between border-b ${
              actionNotice.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionNotice.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{actionNotice.message}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* IF NOT LOGGED IN: SHOW PASSWORD LOCK SCREEN */}
        {!isOwnerAdminLoggedIn ? (
          <div className="p-8 max-w-md mx-auto w-full my-8 space-y-6 bg-slate-950 rounded-3xl border border-slate-800 text-center">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">Owner Security Authentication</h3>
              <p className="text-xs text-slate-400">
                Enter your admin password to access the seller deletion, inventory moderation tools, and owner banking settings.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              {loginError && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Owner Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <p className="text-[10px] text-amber-400/80 pt-1">
                  💡 Default App Owner Password: <strong className="font-mono text-amber-400">admin123</strong>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Unlock Owner Console
              </button>
            </form>
          </div>
        ) : (
          /* UNLOCKED OWNER ADMIN PANELS */
          <div className="flex-1 flex flex-col">
            
            {/* Owner Metrics Ribbon */}
            <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Est. Monthly Revenue</span>
                <div className="text-base font-black text-emerald-400 mt-0.5">{formatCurrency(monthlyRevenue)}</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Registered Sellers</span>
                <div className="text-base font-black text-white mt-0.5">{sellers.length} Total Yards</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Active Inventory Items</span>
                <div className="text-base font-black text-amber-400 mt-0.5">{inventory.length} Listed Parts</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Unpaid / Expired</span>
                <div className="text-base font-black text-rose-400 mt-0.5">
                  {unpaidSellers.length} Yards ({unpaidItems.length} items)
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-slate-950/60 px-6 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setAdminTab('sellers')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  adminTab === 'sellers'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Manage & Delete Sellers ({sellers.length})
              </button>

              <button
                onClick={() => setAdminTab('inventory')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  adminTab === 'inventory'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Inventory Moderation & Deletion ({inventory.length})
              </button>

              <button
                onClick={() => setAdminTab('unpaid')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  adminTab === 'unpaid'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Unpaid Yards Review ({unpaidSellers.length})
              </button>

              <button
                onClick={() => setAdminTab('banking')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  adminTab === 'banking'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" /> Owner Banking Details
              </button>

              <button
                onClick={() => setAdminTab('security')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  adminTab === 'security'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Key className="w-3.5 h-3.5" /> Password & Security
              </button>
            </div>

            {/* TAB BODY */}
            <div className="p-6 flex-1 space-y-6">

              {/* ========================================================================= */}
              {/* TAB 1: MANAGE & DELETE SELLERS */}
              {/* ========================================================================= */}
              {adminTab === 'sellers' && (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={sellerSearch}
                          onChange={(e) => setSellerSearch(e.target.value)}
                          placeholder="Search sellers by yard name, city, email..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <select
                        value={sellerStatusFilter}
                        onChange={(e) => setSellerStatusFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white cursor-pointer"
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active Subscriptions</option>
                        <option value="unpaid">Unpaid / Expired</option>
                        <option value="pending_verification">Pending EFT Review</option>
                      </select>
                    </div>

                    <div className="text-xs text-slate-400">
                      Showing <strong>{filteredSellers.length}</strong> of {sellers.length} registered sellers
                    </div>
                  </div>

                  {/* Sellers List */}
                  <div className="space-y-3">
                    {filteredSellers.length > 0 ? (
                      filteredSellers.map((s) => {
                        const sellerListings = inventory.filter((item) => item.sellerId === s.id);
                        return (
                          <div
                            key={s.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              s.subscriptionStatus === 'unpaid'
                                ? 'bg-rose-950/15 border-rose-500/30'
                                : s.subscriptionStatus === 'pending_verification'
                                ? 'bg-amber-950/15 border-amber-500/30'
                                : 'bg-slate-950 border-slate-800'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              
                              <div className="space-y-1.5 min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-sm text-white">{s.companyName}</h4>
                                  
                                  {s.subscriptionStatus === 'active' ? (
                                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                      ACTIVE
                                    </span>
                                  ) : s.subscriptionStatus === 'pending_verification' ? (
                                    <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                      PENDING EFT PROOF
                                    </span>
                                  ) : (
                                    <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                      UNPAID
                                    </span>
                                  )}

                                  <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
                                    {sellerListings.length} Active Listings
                                  </span>

                                  <span className="text-[10px] text-amber-400 font-semibold">
                                    Plan: {s.planId}
                                  </span>
                                </div>

                                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                                  <span>Contact: <strong className="text-slate-200">{s.contactName}</strong> ({s.phone})</span>
                                  <span>•</span>
                                  <span>Email: <strong className="text-slate-200">{s.email}</strong></span>
                                  <span>•</span>
                                  <span>Location: <strong className="text-slate-200">{s.city}, {s.province}</strong></span>
                                </div>

                                {s.lastPaymentRef && (
                                  <div className="text-[11px] font-mono text-emerald-400">
                                    Submitted EFT Reference: <strong>{s.lastPaymentRef}</strong>
                                  </div>
                                )}
                              </div>

                              {/* Owner Actions for Seller */}
                              <div className="flex items-center gap-2 flex-wrap">
                                {s.subscriptionStatus !== 'active' ? (
                                  <button
                                    onClick={() => handleApproveSeller(s.id)}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center gap-1 cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Activate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleMarkUnpaid(s.id)}
                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl transition-all cursor-pointer"
                                  >
                                    Mark Unpaid
                                  </button>
                                )}

                                {/* DELETE SELLER BUTTON */}
                                <button
                                  onClick={() => handleDeleteSeller(s)}
                                  className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                                  title="Permanently delete seller and all their listings"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Seller & Listings</span>
                                </button>
                              </div>

                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400">
                        No sellers found matching the current search criteria.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: INVENTORY MODERATION & DELETION */}
              {/* ========================================================================= */}
              {adminTab === 'inventory' && (
                <div className="space-y-4">
                  {/* Info Header */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-400" />
                        <span>All Inventory Listings Moderation</span>
                        <span className="text-xs text-slate-400">({inventory.length} Total on Platform)</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Search and delete any inappropriate, sold, non-automotive, or spam items from Part-Smart-ZA.
                      </p>
                    </div>

                    {/* Batch Action Bar */}
                    {selectedItemIds.length > 0 && (
                      <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-500/40 p-2 rounded-xl">
                        <span className="text-xs text-rose-300 font-bold px-2">
                          {selectedItemIds.length} item(s) selected
                        </span>
                        <button
                          onClick={handleBatchDeleteItems}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-lg flex items-center gap-1 cursor-pointer shadow"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Selected ({selectedItemIds.length})</span>
                        </button>
                        <button
                          onClick={() => setSelectedItemIds([])}
                          className="px-2 py-1 text-slate-400 hover:text-white text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Filter Toolbar */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={invSearch}
                        onChange={(e) => setInvSearch(e.target.value)}
                        placeholder="Search part, make, OEM #, title..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <select
                      value={invCategoryFilter}
                      onChange={(e) => setInvCategoryFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white cursor-pointer"
                    >
                      <option value="all">All Machinery & Vehicle Categories</option>
                      <option value="heavy_equipment">Heavy Equipment & Earthmoving</option>
                      <option value="trucks">Trucks & Commercial</option>
                      <option value="cars">Passenger Cars & Bakkies</option>
                    </select>

                    <select
                      value={invSellerFilter}
                      onChange={(e) => setInvSellerFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white cursor-pointer truncate"
                    >
                      <option value="all">All Seller Yards ({sellers.length})</option>
                      {sellers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.companyName} ({s.city})
                        </option>
                      ))}
                    </select>

                    <select
                      value={invConditionFilter}
                      onChange={(e) => setInvConditionFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white cursor-pointer"
                    >
                      <option value="all">All Conditions</option>
                      <option value="reconditioned">Reconditioned</option>
                      <option value="used">Used</option>
                      <option value="new">Brand New</option>
                      <option value="stripping_spares">Stripping for Spares</option>
                    </select>
                  </div>

                  {/* Select All Toggle Bar */}
                  <div className="flex items-center justify-between px-2 text-xs text-slate-400">
                    <button
                      onClick={handleToggleSelectAllFiltered}
                      className="flex items-center gap-1.5 hover:text-white cursor-pointer font-semibold"
                    >
                      {areAllFilteredSelected ? (
                        <CheckSquare className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                      <span>Select all {filteredInventory.length} filtered items</span>
                    </button>

                    <span>Showing {filteredInventory.length} listing(s)</span>
                  </div>

                  {/* Inventory Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                    {filteredInventory.length > 0 ? (
                      filteredInventory.map((item) => {
                        const isSelected = selectedItemIds.includes(item.id);
                        const itemSeller = sellers.find((s) => s.id === item.sellerId);
                        const isSellerActive = itemSeller?.subscriptionStatus === 'active';

                        return (
                          <div
                            key={item.id}
                            className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                              isSelected
                                ? 'bg-amber-950/20 border-amber-500/50'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {/* Checkbox */}
                            <button
                              type="button"
                              onClick={() => toggleSelectItem(item.id)}
                              className="mt-1 text-slate-400 hover:text-amber-400 cursor-pointer shrink-0"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-amber-400" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-600" />
                              )}
                            </button>

                            {/* Thumbnail */}
                            <img
                              src={item.images && item.images[0] ? item.images[0] : (CATEGORY_VISUALS[item.category]?.image || CATEGORY_VISUALS.heavy_equipment.image)}
                              alt=""
                              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-800"
                              referrerPolicy="no-referrer"
                            />

                            {/* Item Info */}
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="font-bold text-xs text-white truncate">{item.title}</h4>
                                <span className="font-black text-amber-400 text-xs shrink-0">
                                  {formatCurrency(item.priceZar)}
                                </span>
                              </div>

                              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                <span className="text-slate-300 font-semibold">{item.make} {item.model}</span>
                                {item.year && <span>({item.year})</span>}
                                {item.partNumber && (
                                  <span className="font-mono bg-slate-900 px-1.5 py-0.2 rounded text-[10px]">
                                    #{item.partNumber}
                                  </span>
                                )}
                              </div>

                              <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                                <div className="flex items-center gap-1.5 truncate">
                                  <Building2 className="w-3 h-3 text-slate-400" />
                                  <span className={isSellerActive ? 'text-slate-300' : 'text-rose-400 font-semibold'}>
                                    {item.sellerName}
                                  </span>
                                  <span>• {item.city}</span>
                                </div>

                                <span className="bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">
                                  {item.condition}
                                </span>
                              </div>
                            </div>

                            {/* Delete Action Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteSingleItem(item)}
                              className="p-2 bg-rose-600/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 rounded-xl transition-colors cursor-pointer shrink-0 self-center"
                              title="Delete this listing from Part-Smart-ZA"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-full p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400">
                        No inventory listings found matching the specified filters.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: UNPAID YARDS & LISTINGS REVIEW */}
              {/* ========================================================================= */}
              {adminTab === 'unpaid' && (
                <div className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Unpaid & Pending Yards Management</span>
                    </span>
                    <p>
                      Below are sellers whose subscriptions are currently unpaid or awaiting proof of payment verification. You can approve their payments or permanently delete them and their listings.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {unpaidSellers.length > 0 ? (
                      unpaidSellers.map((s) => {
                        const sellerListings = inventory.filter((item) => item.sellerId === s.id);
                        return (
                          <div
                            key={s.id}
                            className="bg-slate-950 p-4 rounded-2xl border border-rose-500/30 flex flex-wrap items-center justify-between gap-4"
                          >
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm text-white">{s.companyName}</h4>
                                <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                  {s.subscriptionStatus === 'pending_verification' ? 'PENDING PROOF' : 'UNPAID'}
                                </span>
                                <span className="text-xs text-slate-400">
                                  ({sellerListings.length} listings in database)
                                </span>
                              </div>

                              <div className="text-xs text-slate-400">
                                Contact: {s.contactName} ({s.phone}) | Email: {s.email} | Location: {s.city}, {s.province}
                              </div>

                              {s.lastPaymentRef && (
                                <div className="text-xs font-mono text-emerald-400">
                                  Submitted Proof Ref: <strong>{s.lastPaymentRef}</strong>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApproveSeller(s.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approve Payment
                              </button>

                              <button
                                onClick={() => handleDeleteSeller(s)}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete Seller & All Items
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400">
                        🎉 All registered seller yards are up-to-date with active subscriptions!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: OWNER BANKING DETAILS */}
              {/* ========================================================================= */}
              {adminTab === 'banking' && (
                <form onSubmit={handleSaveBanking} className="space-y-6 max-w-3xl mx-auto bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="font-bold text-base text-amber-400">Configure Owner Banking Details</h3>
                      <p className="text-xs text-slate-400">
                        These details are displayed to sellers in their portal for monthly EFT subscription payments.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Banking Info
                    </button>
                  </div>

                  {bankSaveSuccess && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
                      <Check className="w-4 h-4" /> Banking details updated successfully!
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold">Bank Name *</label>
                      <input
                        type="text"
                        required
                        value={bankForm.bankName}
                        onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                        placeholder="e.g. First National Bank (FNB)"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold">Account Holder Name *</label>
                      <input
                        type="text"
                        required
                        value={bankForm.accountHolder}
                        onChange={(e) => setBankForm({ ...bankForm, accountHolder: e.target.value })}
                        placeholder="e.g. Part-Smart ZA (Pty) Ltd"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold">Account Number *</label>
                      <input
                        type="text"
                        required
                        value={bankForm.accountNumber}
                        onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                        placeholder="e.g. 62849102384"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold">Branch Code *</label>
                      <input
                        type="text"
                        required
                        value={bankForm.branchCode}
                        onChange={(e) => setBankForm({ ...bankForm, branchCode: e.target.value })}
                        placeholder="e.g. 250655"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold">Account Type</label>
                      <input
                        type="text"
                        value={bankForm.accountType}
                        onChange={(e) => setBankForm({ ...bankForm, accountType: e.target.value })}
                        placeholder="e.g. Business Cheque Account"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold">SWIFT Code (Optional)</label>
                      <input
                        type="text"
                        value={bankForm.swiftCode || ''}
                        onChange={(e) => setBankForm({ ...bankForm, swiftCode: e.target.value })}
                        placeholder="e.g. FIRNZAJJ"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-slate-300 font-bold">Required EFT Payment Reference Format</label>
                      <input
                        type="text"
                        value={bankForm.paymentReferenceFormat}
                        onChange={(e) => setBankForm({ ...bankForm, paymentReferenceFormat: e.target.value })}
                        placeholder="e.g. PS-[COMPANY-NAME] or PS-[SELLER-ID]"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-slate-300 font-bold">Additional Instructions for Sellers</label>
                      <textarea
                        rows={3}
                        value={bankForm.additionalInstructions}
                        onChange={(e) => setBankForm({ ...bankForm, additionalInstructions: e.target.value })}
                        placeholder="Instructions regarding proof of payment emails or verification timeline..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* ========================================================================= */}
              {/* TAB 5: CHANGE OWNER PASSWORD */}
              {/* ========================================================================= */}
              {adminTab === 'security' && (
                <form onSubmit={handleChangePassword} className="max-w-md mx-auto space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <h3 className="text-sm font-bold text-amber-400 border-b border-slate-800 pb-2">
                    Change App Owner Admin Password
                  </h3>

                  {passSaveSuccess && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs">
                      Password changed successfully!
                    </div>
                  )}

                  <div className="space-y-1 text-xs">
                    <label className="text-slate-300 font-bold">New Owner Password</label>
                    <input
                      type="text"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new owner password..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* IN-APP CONFIRMATION MODALS (Guaranteed to work without browser popups) */}
        {/* ========================================================================= */}

        {/* 1. SELLER DELETION CONFIRMATION MODAL */}
        {sellerPendingDelete && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-rose-500/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
              <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-white">Permanently Delete Seller?</h3>
                <p className="text-xs text-slate-400">
                  This action will permanently delete the seller account and remove all their inventory listings from Part-Smart-ZA.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Company / Yard:</span>
                  <span className="font-bold text-white">{sellerPendingDelete.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-200">{sellerPendingDelete.city}, {sellerPendingDelete.province}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact:</span>
                  <span className="text-slate-200">{sellerPendingDelete.contactName} ({sellerPendingDelete.phone})</span>
                </div>
                <div className="flex justify-between border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400">Associated Listings:</span>
                  <span className="font-bold text-rose-400">
                    {inventory.filter((item) => item.sellerId === sellerPendingDelete.id).length} parts will be removed
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSellerPendingDelete(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeConfirmDeleteSeller}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-950/50 flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Seller</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. SINGLE INVENTORY ITEM DELETION CONFIRMATION MODAL */}
        {itemPendingDelete && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-rose-500/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
              <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-white">Delete Inventory Listing?</h3>
                <p className="text-xs text-slate-400">
                  This part will be permanently removed from the search engine and all buyers.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white">{itemPendingDelete.title}</div>
                <div className="flex justify-between text-slate-400">
                  <span>Make / Model:</span>
                  <span className="text-slate-200">{itemPendingDelete.make} {itemPendingDelete.model} ({itemPendingDelete.year})</span>
                </div>
                {itemPendingDelete.partNumber && (
                  <div className="flex justify-between text-slate-400">
                    <span>Part / OEM:</span>
                    <span className="text-amber-400 font-mono">#{itemPendingDelete.partNumber}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Seller:</span>
                  <span className="text-slate-200">{itemPendingDelete.sellerName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setItemPendingDelete(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeConfirmDeleteSingleItem}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Part</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. BATCH INVENTORY DELETION CONFIRMATION MODAL */}
        {batchDeletePending && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-rose-500/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
              <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-white">Batch Delete {selectedItemIds.length} Listings?</h3>
                <p className="text-xs text-slate-400">
                  Are you sure you want to permanently delete all {selectedItemIds.length} selected inventory listings from Part-Smart-ZA?
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBatchDeletePending(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeConfirmBatchDelete}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All ({selectedItemIds.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
