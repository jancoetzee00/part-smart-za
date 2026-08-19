import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  InventoryItem,
  OwnerBankingDetails,
  OwnerSettings,
  Seller,
  FilterState,
  SubscriptionStatus,
  SubscriptionPlanId
} from '../types';
import {
  INITIAL_INVENTORY,
  INITIAL_OWNER_SETTINGS,
  INITIAL_SELLERS,
  SUBSCRIPTION_PLANS
} from '../data/initialData';
import {
  testFirebaseConnection,
  seedInitialFirebaseDataIfEmpty,
  subscribeSellers,
  subscribeInventory,
  subscribeOwnerSettings,
  saveSellerDoc,
  deleteSellerDoc,
  saveInventoryDoc,
  deleteInventoryDoc,
  saveOwnerSettingsDoc
} from '../lib/firebase';

interface AppContextType {
  inventory: InventoryItem[];
  sellers: Seller[];
  ownerSettings: OwnerSettings;
  activeSeller: Seller | null;
  activeSellerId: string | null;
  isOwnerAdminLoggedIn: boolean;
  filter: FilterState;

  // Actions
  setActiveSellerId: (id: string | null) => void;
  loginOwner: (password: string) => boolean;
  logoutOwner: () => void;
  updateOwnerPassword: (newPass: string) => void;
  updateOwnerBankingDetails: (details: OwnerBankingDetails) => void;

  // Seller management
  registerSeller: (sellerData: Omit<Seller, 'id' | 'createdAt' | 'subscriptionStatus' | 'subscriptionDueDate'>) => Seller;
  updateSeller: (seller: Seller) => void;
  updateSellerStatus: (sellerId: string, status: SubscriptionStatus, dueDate?: string) => void;
  submitPaymentProof: (sellerId: string, reference: string) => void;
  deleteSeller: (sellerId: string, deleteAssociatedListings?: boolean) => void;
  removeUnpaidSellerAndListings: (sellerId: string) => void;

  // Inventory management
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'views' | 'createdAt' | 'updatedAt'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (itemId: string) => void;
  deleteMultipleInventoryItems: (itemIds: string[]) => void;
  incrementViews: (itemId: string) => void;

  // Filtering
  setFilter: (newFilter: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Helpers
  getSellerById: (sellerId: string) => Seller | undefined;
  getSellerListings: (sellerId: string) => InventoryItem[];
}

const STORAGE_KEYS = {
  INVENTORY: 'part_smart_za_inventory_v1',
  SELLERS: 'part_smart_za_sellers_v1',
  OWNER_SETTINGS: 'part_smart_za_owner_settings_v1',
  ACTIVE_SELLER_ID: 'part_smart_za_active_seller_id_v1'
};

const initialFilterState: FilterState = {
  searchQuery: '',
  category: 'all',
  subcategory: 'All',
  condition: 'all',
  province: 'all',
  make: '',
  sortBy: 'newest'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inventory state
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  // Sellers state
  const [sellers, setSellers] = useState<Seller[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELLERS);
      return saved ? JSON.parse(saved) : INITIAL_SELLERS;
    } catch {
      return INITIAL_SELLERS;
    }
  });

  // Owner settings state (including banking details & password)
  const [ownerSettings, setOwnerSettings] = useState<OwnerSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OWNER_SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_OWNER_SETTINGS;
    } catch {
      return INITIAL_OWNER_SETTINGS;
    }
  });

  // Active seller session
  const [activeSellerId, setActiveSellerIdState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_SELLER_ID) || null;
    } catch {
      return null;
    }
  });

  // Admin authentication state
  const [isOwnerAdminLoggedIn, setIsOwnerAdminLoggedIn] = useState<boolean>(false);

  // Filters state
  const [filter, setFilterState] = useState<FilterState>(initialFilterState);

  // Initial Firebase setup & real-time synchronization
  useEffect(() => {
    // Test connection & seed initial data if Firestore collections are empty
    testFirebaseConnection();
    seedInitialFirebaseDataIfEmpty(INITIAL_INVENTORY, INITIAL_SELLERS, INITIAL_OWNER_SETTINGS);

    // Subscribe to Sellers
    const unsubscribeSellers = subscribeSellers((remoteSellers) => {
      if (Array.isArray(remoteSellers)) {
        setSellers(remoteSellers);
      }
    });

    // Subscribe to Inventory
    const unsubscribeInventory = subscribeInventory((remoteInventory) => {
      if (Array.isArray(remoteInventory)) {
        setInventory(remoteInventory);
      }
    });

    // Subscribe to Owner Settings
    const unsubscribeOwner = subscribeOwnerSettings((remoteSettings) => {
      if (remoteSettings) {
        setOwnerSettings(remoteSettings);
      }
    });

    return () => {
      unsubscribeSellers();
      unsubscribeInventory();
      unsubscribeOwner();
    };
  }, []);

  // Sync to LocalStorage (as offline backup)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(sellers));
  }, [sellers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OWNER_SETTINGS, JSON.stringify(ownerSettings));
  }, [ownerSettings]);

  useEffect(() => {
    if (activeSellerId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SELLER_ID, activeSellerId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SELLER_ID);
    }
  }, [activeSellerId]);

  const activeSeller = sellers.find(s => s.id === activeSellerId) || null;

  const setActiveSellerId = (id: string | null) => {
    setActiveSellerIdState(id);
  };

  // Owner Admin Authentication
  const loginOwner = (password: string): boolean => {
    if (password === ownerSettings.passwordHash) {
      setIsOwnerAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutOwner = () => {
    setIsOwnerAdminLoggedIn(false);
  };

  const updateOwnerPassword = (newPass: string) => {
    const newSettings = {
      ...ownerSettings,
      passwordHash: newPass
    };
    setOwnerSettings(newSettings);
    saveOwnerSettingsDoc(newSettings);
  };

  const updateOwnerBankingDetails = (details: OwnerBankingDetails) => {
    const newSettings = {
      ...ownerSettings,
      bankingDetails: {
        ...details,
        updatedAt: new Date().toISOString()
      }
    };
    setOwnerSettings(newSettings);
    saveOwnerSettingsDoc(newSettings);
  };

  // Seller operations
  const registerSeller = (
    sellerData: Omit<Seller, 'id' | 'createdAt' | 'subscriptionStatus' | 'subscriptionDueDate'>
  ): Seller => {
    const newId = `seller-${Date.now()}`;
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const newSeller: Seller = {
      ...sellerData,
      id: newId,
      subscriptionStatus: 'unpaid', // New registrations start as unpaid until proof/EFT confirmed
      subscriptionDueDate: nextMonth.toISOString(),
      createdAt: new Date().toISOString()
    };

    setSellers(prev => [newSeller, ...prev]);
    setActiveSellerIdState(newId);
    saveSellerDoc(newSeller);
    return newSeller;
  };

  const updateSeller = (updatedSeller: Seller) => {
    setSellers(prev => prev.map(s => (s.id === updatedSeller.id ? updatedSeller : s)));
    saveSellerDoc(updatedSeller);
  };

  const updateSellerStatus = (sellerId: string, status: SubscriptionStatus, dueDate?: string) => {
    const existingSeller = sellers.find(s => s.id === sellerId);
    if (!existingSeller) return;

    const updatedSeller: Seller = {
      ...existingSeller,
      subscriptionStatus: status,
      subscriptionDueDate: dueDate || existingSeller.subscriptionDueDate
    };

    setSellers(prev => prev.map(s => (s.id === sellerId ? updatedSeller : s)));
    saveSellerDoc(updatedSeller);
  };

  const submitPaymentProof = (sellerId: string, reference: string) => {
    const existingSeller = sellers.find(s => s.id === sellerId);
    if (!existingSeller) return;

    const updatedSeller: Seller = {
      ...existingSeller,
      subscriptionStatus: 'pending_verification',
      lastPaymentRef: reference,
      paymentProofSubmittedAt: new Date().toISOString()
    };

    setSellers(prev => prev.map(s => (s.id === sellerId ? updatedSeller : s)));
    saveSellerDoc(updatedSeller);
  };

  // OWNER DELETE SELLER & ALL ASSOCIATED LISTINGS
  const deleteSeller = (sellerId: string, deleteAssociatedListings: boolean = true) => {
    // 1. Remove seller from state
    setSellers(prev => {
      const updated = prev.filter(s => s.id !== sellerId);
      try {
        localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. Remove seller document from Firestore
    deleteSellerDoc(sellerId).catch(err => console.warn('Could not delete seller doc:', err));

    // 3. Remove all inventory items belonging to this seller
    if (deleteAssociatedListings) {
      setInventory(prev => {
        const remaining = prev.filter(item => item.sellerId !== sellerId);
        const sellerItems = prev.filter(item => item.sellerId === sellerId);
        try {
          localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(remaining));
        } catch {}
        sellerItems.forEach(item => {
          deleteInventoryDoc(item.id).catch(err => console.warn('Could not delete item doc:', err));
        });
        return remaining;
      });
    }

    // 4. If active seller was this one, clear active seller session
    if (activeSellerId === sellerId) {
      setActiveSellerIdState(null);
      try {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_SELLER_ID);
      } catch {}
    }
  };

  // Keep for backwards compatibility
  const removeUnpaidSellerAndListings = (sellerId: string) => {
    deleteSeller(sellerId, true);
  };

  // Inventory Operations
  const addInventoryItem = (
    itemData: Omit<InventoryItem, 'id' | 'views' | 'createdAt' | 'updatedAt'>
  ) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setInventory(prev => [newItem, ...prev]);
    saveInventoryDoc(newItem);
  };

  const updateInventoryItem = (updatedItem: InventoryItem) => {
    const itemWithUpdate = { ...updatedItem, updatedAt: new Date().toISOString() };
    setInventory(prev =>
      prev.map(item => (item.id === updatedItem.id ? itemWithUpdate : item))
    );
    saveInventoryDoc(itemWithUpdate);
  };

  const deleteInventoryItem = (itemId: string) => {
    setInventory(prev => {
      const remaining = prev.filter(item => item.id !== itemId);
      try {
        localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(remaining));
      } catch {}
      return remaining;
    });
    deleteInventoryDoc(itemId).catch(err => console.warn('Could not delete item doc:', err));
  };

  const deleteMultipleInventoryItems = (itemIds: string[]) => {
    if (!itemIds || itemIds.length === 0) return;
    const idSet = new Set(itemIds);
    setInventory(prev => {
      const remaining = prev.filter(item => !idSet.has(item.id));
      try {
        localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(remaining));
      } catch {}
      return remaining;
    });
    itemIds.forEach(id => {
      deleteInventoryDoc(id).catch(err => console.warn('Could not delete item doc:', err));
    });
  };

  const incrementViews = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const updated = { ...item, views: item.views + 1 };
    setInventory(prev =>
      prev.map(i => (i.id === itemId ? updated : i))
    );
    saveInventoryDoc(updated);
  };

  // Filter Operations
  const setFilter = (newFilter: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilter }));
  };

  const resetFilters = () => {
    setFilterState(initialFilterState);
  };

  // Helper getters
  const getSellerById = (sellerId: string) => sellers.find(s => s.id === sellerId);
  const getSellerListings = (sellerId: string) => inventory.filter(i => i.sellerId === sellerId);

  return (
    <AppContext.Provider
      value={{
        inventory,
        sellers,
        ownerSettings,
        activeSeller,
        activeSellerId,
        isOwnerAdminLoggedIn,
        filter,
        setActiveSellerId,
        loginOwner,
        logoutOwner,
        updateOwnerPassword,
        updateOwnerBankingDetails,
        registerSeller,
        updateSeller,
        updateSellerStatus,
        submitPaymentProof,
        deleteSeller,
        removeUnpaidSellerAndListings,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        deleteMultipleInventoryItems,
        incrementViews,
        setFilter,
        resetFilters,
        getSellerById,
        getSellerListings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

