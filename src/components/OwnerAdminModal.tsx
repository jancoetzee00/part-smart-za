import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OwnerBankingDetails, Seller, SubscriptionStatus, SubscriptionPlanId } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/initialData';

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
    removeUnpaidSellerAndListings,
    inventory,
    deleteInventoryItem
  } = useApp();

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<'banking' | 'sellers' | 'unpaid_items' | 'security'>('banking');

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

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginOwner(passwordInput.trim());
    if (!success) {
      setLoginError('Incorrect password. Default owner password is "admin123".');
    }
  };

  // Save Banking Details
  const handleSaveBanking = (e: React.FormEvent) => {
    e.preventDefault();
    updateOwnerBankingDetails(bankForm);
    setBankSaveSuccess(true);
    setTimeout(() => setBankSaveSuccess(false), 3000);
  };

  // Save New Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    updateOwnerPassword(newPassword.trim());
    setPassSaveSuccess(true);
    setNewPassword('');
    setTimeout(() => setPassSaveSuccess(false), 3000);
  };

  // Owner approve / activate payment
  const handleApproveSeller = (sellerId: string) => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    updateSellerStatus(sellerId, 'active', nextMonth.toISOString());
  };

  // Owner mark seller unpaid
  const handleMarkUnpaid = (sellerId: string) => {
    updateSellerStatus(sellerId, 'unpaid');
  };

  // Owner EDIT AND REMOVE UNPAID SUBSCRIPTION
  const handleRemoveUnpaidSeller = (seller: Seller) => {
    if (
      confirm(
        `Are you sure you want to PERMANENTLY REMOVE the unpaid subscription for "${seller.companyName}"?\n\nThis will delete the seller account and remove all associated inventory listings from the app.`
      )
    ) {
      removeUnpaidSellerAndListings(seller.id);
    }
  };

  // Filter and sort sellers by Province, then City/Town, then Company Name
  const filteredSellers = sellers
    .filter((s) => {
      const matchesSearch =
        s.companyName.toLowerCase().includes(sellerSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(sellerSearch.toLowerCase()) ||
        s.contactName.toLowerCase().includes(sellerSearch.toLowerCase()) ||
        s.city.toLowerCase().includes(sellerSearch.toLowerCase()) ||
        s.province.toLowerCase().includes(sellerSearch.toLowerCase());

      if (sellerStatusFilter === 'all') return matchesSearch;
      return matchesSearch && s.subscriptionStatus === sellerStatusFilter;
    })
    .sort((a, b) => {
      if (a.province !== b.province) {
        return a.province.localeCompare(b.province);
      }
      if (a.city !== b.city) {
        return a.city.localeCompare(b.city);
      }
      return a.companyName.localeCompare(b.companyName);
    });

  // Calculate unpaid inventory items
  const unpaidSellerIds = sellers
    .filter((s) => s.subscriptionStatus === 'unpaid')
    .map((s) => s.id);

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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl text-white my-auto flex flex-col">
        
        {/* Top Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span>Part-Smart-ZA App Owner Console</span>
                {isOwnerAdminLoggedIn && (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Authenticated
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Password-protected owner settings, banking management & unpaid subscription editor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwnerAdminLoggedIn && (
              <button
                onClick={logoutOwner}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Lock Console
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

        {/* IF NOT LOGGED IN: SHOW PASSWORD LOCK SCREEN */}
        {!isOwnerAdminLoggedIn ? (
          <div className="p-8 max-w-md mx-auto w-full my-8 space-y-6 bg-slate-950 rounded-3xl border border-slate-800 text-center">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">App Owner Password Protection</h3>
              <p className="text-xs text-slate-400">
                Enter your owner admin password to configure banking details and manage unpaid seller subscriptions.
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
                <label className="text-xs font-bold text-slate-300">Owner Admin Password</label>
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
                <span className="text-[10px] text-slate-400 uppercase font-bold">Est. Monthly Subscription</span>
                <div className="text-base font-black text-emerald-400 mt-0.5">{formatCurrency(monthlyRevenue)}</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Subscribed Sellers</span>
                <div className="text-base font-black text-white mt-0.5">{sellers.length} Total</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Unpaid / Expired</span>
                <div className="text-base font-black text-amber-400 mt-0.5">
                  {sellers.filter((s) => s.subscriptionStatus === 'unpaid').length} Yards
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Pending EFT Review</span>
                <div className="text-base font-black text-blue-400 mt-0.5">
                  {sellers.filter((s) => s.subscriptionStatus === 'pending_verification').length} Proofs
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-slate-950/60 px-6 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setAdminTab('banking')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  adminTab === 'banking'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-3 h-3" /> App Owner Banking Settings
              </button>

              <button
                onClick={() => setAdminTab('sellers')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  adminTab === 'sellers'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Sellers & Subscriptions ({sellers.length})
              </button>

              <button
                onClick={() => setAdminTab('unpaid_items')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  adminTab === 'unpaid_items'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Unpaid Listings Manager ({unpaidItems.length})
              </button>

              <button
                onClick={() => setAdminTab('security')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  adminTab === 'security'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Key className="w-3.5 h-3.5" /> Change Password
              </button>
            </div>

            {/* TAB BODY */}
            <div className="p-6 flex-1 space-y-6">

              {/* TAB 1: OWNER BANKING DETAILS EDITOR */}
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
                      <Check className="w-4 h-4" /> Banking details updated successfully! Sellers can now view these updated details.
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

              {/* TAB 2: MANAGE SELLERS & SUBSCRIPTIONS (EDIT & REMOVE UNPAID SUBSCRIPTIONS) */}
              {adminTab === 'sellers' && (
                <div className="space-y-4">
                  {/* Filter Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sellerSearch}
                        onChange={(e) => setSellerSearch(e.target.value)}
                        placeholder="Search seller by company or email..."
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 w-64 focus:outline-none"
                      />

                      <select
                        value={sellerStatusFilter}
                        onChange={(e) => setSellerStatusFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white cursor-pointer"
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active Subscriptions</option>
                        <option value="unpaid">Unpaid / Expired</option>
                        <option value="pending_verification">Pending EFT Proof</option>
                      </select>
                    </div>

                    <div className="text-xs text-slate-400">
                      Showing <strong>{filteredSellers.length}</strong> of {sellers.length} registered yards
                    </div>
                  </div>

                  {/* Sellers List Table / Cards */}
                  <div className="space-y-3">
                    {filteredSellers.map((s) => (
                      <div
                        key={s.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          s.subscriptionStatus === 'unpaid'
                            ? 'bg-rose-950/20 border-rose-500/30'
                            : s.subscriptionStatus === 'pending_verification'
                            ? 'bg-amber-950/20 border-amber-500/30'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-white">{s.companyName}</h4>
                              {s.subscriptionStatus === 'active' ? (
                                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                  ACTIVE
                                </span>
                              ) : s.subscriptionStatus === 'pending_verification' ? (
                                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                  PENDING REVIEW
                                </span>
                              ) : (
                                <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                  UNPAID
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-slate-400">
                              Contact: <strong>{s.contactName}</strong> ({s.phone}) | Email: {s.email}
                            </div>

                            <div className="text-[11px] text-slate-500">
                              Location: {s.city}, {s.province} | Plan: <span className="text-amber-400 font-semibold">{s.planId}</span>
                            </div>

                            {s.lastPaymentRef && (
                              <div className="text-[11px] font-mono text-emerald-400 pt-1">
                                Submitted EFT Ref: <strong>{s.lastPaymentRef}</strong>
                              </div>
                            )}
                          </div>

                          {/* Owner Action Buttons for this Seller */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {s.subscriptionStatus !== 'active' ? (
                              <button
                                onClick={() => handleApproveSeller(s.id)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow cursor-pointer flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Mark Paid
                              </button>
                            ) : (
                              <button
                                onClick={() => handleMarkUnpaid(s.id)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl transition-all cursor-pointer"
                              >
                                Mark Unpaid
                              </button>
                            )}

                            {/* REMOVE UNPAID SUBSCRIPTION BUTTON */}
                            <button
                              onClick={() => handleRemoveUnpaidSeller(s)}
                              className="px-3.5 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                              title="Delete seller account and remove all unpaid listings"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove Unpaid Seller
                            </button>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: UNPAID LISTINGS OVERVIEW */}
              {adminTab === 'unpaid_items' && (
                <div className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-amber-400 block">Unpaid Inventory Overview</span>
                    <p>
                      Below are inventory items posted by sellers whose subscriptions are currently unpaid or pending. You can approve their seller payment or delete unpaid items directly.
                    </p>
                  </div>

                  {unpaidItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {unpaidItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-950 p-4 rounded-2xl border border-rose-500/20 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.images[0]}
                              alt=""
                              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-800"
                            />
                            <div className="min-w-0">
                              <h5 className="font-bold text-xs text-white truncate">{item.title}</h5>
                              <div className="text-[11px] text-amber-400 font-bold">{formatCurrency(item.priceZar)}</div>
                              <div className="text-[10px] text-slate-400">Seller: {item.sellerName}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleApproveSeller(item.sellerId)}
                              className="px-2.5 py-1.5 bg-emerald-600 text-white font-bold text-[11px] rounded-lg cursor-pointer"
                            >
                              Approve Seller
                            </button>
                            <button
                              onClick={() => deleteInventoryItem(item.id)}
                              className="p-1.5 bg-rose-500/20 text-rose-300 hover:text-white rounded-lg cursor-pointer"
                              title="Delete Unpaid Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
                      No inventory items from unpaid sellers right now!
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CHANGE OWNER PASSWORD */}
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

      </div>
    </div>
  );
};
