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
  removeUnpaidSellerAndListings: (sellerId: string) => void;

  // Inventory management
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'views' | 'createdAt' | 'updatedAt'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (itemId: string) => void;
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

  // Sync to LocalStorage
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
    setOwnerSettings(prev => ({
      ...prev,
      passwordHash: newPass
    }));
  };

  const updateOwnerBankingDetails = (details: OwnerBankingDetails) => {
    setOwnerSettings(prev => ({
      ...prev,
      bankingDetails: {
        ...details,
        updatedAt: new Date().toISOString()
      }
    }));
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
    return newSeller;
  };

  const updateSeller = (updatedSeller: Seller) => {
    setSellers(prev => prev.map(s => (s.id === updatedSeller.id ? updatedSeller : s)));
  };

  const updateSellerStatus = (sellerId: string, status: SubscriptionStatus, dueDate?: string) => {
    setSellers(prev =>
      prev.map(s => {
        if (s.id === sellerId) {
          const updatedDue = dueDate || s.subscriptionDueDate;
          return {
            ...s,
            subscriptionStatus: status,
            subscriptionDueDate: updatedDue
          };
        }
        return s;
      })
    );
  };

  const submitPaymentProof = (sellerId: string, reference: string) => {
    setSellers(prev =>
      prev.map(s => {
        if (s.id === sellerId) {
          return {
            ...s,
            subscriptionStatus: 'pending_verification',
            lastPaymentRef: reference,
            paymentProofSubmittedAt: new Date().toISOString()
          };
        }
        return s;
      })
    );
  };

  // OWNER REMOVE / EDIT UNPAID SUBSCRIPTION
  const removeUnpaidSellerAndListings = (sellerId: string) => {
    // Remove seller
    setSellers(prev => prev.filter(s => s.id !== sellerId));
    // Remove all inventory items belonging to this unpaid seller
    setInventory(prev => prev.filter(item => item.sellerId !== sellerId));
    // If active seller was this one, clear active seller session
    if (activeSellerId === sellerId) {
      setActiveSellerIdState(null);
    }
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
  };

  const updateInventoryItem = (updatedItem: InventoryItem) => {
    setInventory(prev =>
      prev.map(item =>
        item.id === updatedItem.id
          ? { ...updatedItem, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteInventoryItem = (itemId: string) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
  };

  const incrementViews = (itemId: string) => {
    setInventory(prev =>
      prev.map(item => (item.id === itemId ? { ...item, views: item.views + 1 } : item))
    );
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
        removeUnpaidSellerAndListings,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
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
