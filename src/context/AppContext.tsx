"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import { DateMemory, PlanItem, DatePhoto } from '../lib/types';
import { supabase } from '../lib/supabaseClient';
import {
  fetchCoupleUsers,
  updateCoupleNicknameInDB,
  fetchPlansFromDB,
  upsertPlanInDB,
  deletePlanFromDB,
  fetchDatesFromDB,
  createOngoingDateInDB,
  saveOngoingDateToBitacoraInDB,
  deleteMemoryFromDB,
  loginCoupleUser,
  addPhotoToOngoingDateInDB,
  deletePhotoFromDB
} from '../lib/dataService';
import { uploadPolaroid } from '../lib/uploadPhoto';

interface AppContextProps {
  activeTab: string;
  setActiveTab: (val: string) => void;
  bitacoraMode: string;
  setBitacoraMode: (val: string) => void;
  currentUserSlot: number;
  setCurrentUserSlot: (val: number) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  user1Alias: string;
  setUser1Alias: (val: string) => void;
  user2Alias: string;
  setUser2Alias: (val: string) => void;
  isEditNicknamesOpen: boolean;
  setIsEditNicknamesOpen: (val: boolean) => void;
  saveNicknames: (nick1: string, nick2: string) => Promise<void>;
  user1Email: string;
  setUser1Email: (val: string) => void;
  user2Email: string;
  setUser2Email: (val: string) => void;
  surpriseNiceNotes: boolean;
  setSurpriseNiceNotes: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  currentPageIndex: number;
  setCurrentPageIndex: React.Dispatch<React.SetStateAction<number>>;
  isPageTurning: boolean;
  setIsPageTurning: (val: boolean) => void;
  memories: DateMemory[];
  setMemories: React.Dispatch<React.SetStateAction<DateMemory[]>>;
  wishlist: PlanItem[];
  setWishlist: React.Dispatch<React.SetStateAction<PlanItem[]>>;
  activeOngoingDate: DateMemory | null;
  setActiveOngoingDate: React.Dispatch<React.SetStateAction<DateMemory | null>>;
  isLiveDateModalOpen: boolean;
  setIsLiveDateModalOpen: (val: boolean) => void;
  randomQuoteIndex: number;
  setRandomQuoteIndex: React.Dispatch<React.SetStateAction<number>>;
  randomPhotoSeed: number;
  setRandomPhotoSeed: React.Dispatch<React.SetStateAction<number>>;
  randomPlanIndex: number;
  setRandomPlanIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedMemory: DateMemory | null;
  setSelectedMemory: (val: DateMemory | null) => void;
  zoomedPhoto: DatePhoto | null;
  setZoomedPhoto: (val: DatePhoto | null) => void;
  flippedPolaroids: Record<string, boolean>;
  setFlippedPolaroids: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  editingWish: PlanItem | null;
  setEditingWish: (val: PlanItem | null) => void;
  isQuickCreateOpen: boolean;
  setIsQuickCreateOpen: (val: boolean) => void;
  quickCreateMode: string;
  setQuickCreateMode: (val: string) => void;
  petalShower: boolean;
  setPetalShower: (val: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  allPhotosWithContext: any[];
  displayedRandomPhotos: any[];
  currentRandomMemoryForQuote: DateMemory | null;
  currentSuggestedPlan: PlanItem | null;
  startOngoingDateFromPlan: (plan: PlanItem) => Promise<void>;
  startNewQuickDate: (title?: string, location?: string) => Promise<void>;
  saveOngoingDateToBitacora: (completedDate: DateMemory) => Promise<void>;
  savePlan: (plan: PlanItem) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
  deleteMemory: (memoryId: string) => Promise<void>;
  uploadAndAddPhotoToOngoing: (file: File, caption?: string, secret?: string) => Promise<DatePhoto | null>;
  deletePhotoFromOngoing: (photoId: string) => Promise<void>;
  openQuickPlan: () => void;
  isLoadingDB: boolean;
  refreshFromSupabase: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState('inicio');
  const [bitacoraMode, setBitacoraMode] = useState('completa');
  const [isLoadingDB, setIsLoadingDB] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bitacora_is_logged_in') === 'true';
    }
    return false;
  });
  const [currentUserSlot, setCurrentUserSlot] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('bitacora_current_slot') || '1', 10);
    }
    return 1;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bitacora_is_logged_in', String(isLoggedIn));
      localStorage.setItem('bitacora_current_slot', String(currentUserSlot));
    }
  }, [isLoggedIn, currentUserSlot]);
  const [isEditNicknamesOpen, setIsEditNicknamesOpen] = useState(false);
  const [user1Alias, setUser1Alias] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bitacora_user1_alias') || 'Marcelo';
    }
    return 'Marcelo';
  });
  const [user2Alias, setUser2Alias] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bitacora_user2_alias') || 'Nicole';
    }
    return 'Nicole';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bitacora_user1_alias', user1Alias);
    }
  }, [user1Alias]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bitacora_user2_alias', user2Alias);
    }
  }, [user2Alias]);

  const [user1Email, setUser1Email] = useState('marcelo@bitacora.local');
  const [user2Email, setUser2Email] = useState('nicole@bitacora.local');
  const [surpriseNiceNotes, setSurpriseNiceNotes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPageTurning, setIsPageTurning] = useState(false);

  // Estados cargados desde Supabase (por defecto vacíos para construir recuerdos)
  const [memories, setMemories] = useState<DateMemory[]>([]);
  const [wishlist, setWishlist] = useState<PlanItem[]>([]);

  const [activeOngoingDate, setActiveOngoingDate] = useState<DateMemory | null>(null);
  const [isLiveDateModalOpen, setIsLiveDateModalOpen] = useState(false);

  const [randomQuoteIndex, setRandomQuoteIndex] = useState(0);
  const [randomPhotoSeed, setRandomPhotoSeed] = useState(0);
  const [randomPlanIndex, setRandomPlanIndex] = useState(0);

  const [selectedMemory, setSelectedMemory] = useState<DateMemory | null>(null);
  const [zoomedPhoto, setZoomedPhoto] = useState<DatePhoto | null>(null);
  const [flippedPolaroids, setFlippedPolaroids] = useState<Record<string, boolean>>({});
  const [editingWish, setEditingWish] = useState<PlanItem | null>(null);

  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [quickCreateMode, setQuickCreateMode] = useState('start_now');
  const [petalShower, setPetalShower] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  }, []);

  // Cargar datos iniciales desde Supabase
  const refreshFromSupabase = useCallback(async () => {
    try {
      const [usersResult, plansResult, datesResult] = await Promise.all([
        fetchCoupleUsers(),
        fetchPlansFromDB(),
        fetchDatesFromDB()
      ]);

      if (usersResult.marcelo?.nickname) setUser1Alias(usersResult.marcelo.nickname);
      if (usersResult.nicole?.nickname) setUser2Alias(usersResult.nicole.nickname);

      setWishlist(plansResult);
      setMemories(datesResult.memories);

      if (datesResult.activeOngoing) {
        setActiveOngoingDate(datesResult.activeOngoing);
      }
    } catch (err) {
      console.error('Error al sincronizar con Supabase:', err);
    } finally {
      setIsLoadingDB(false);
    }
  }, []);

  const login = async (username: string, pass: string) => {
    setIsLoadingDB(true);
    const user = await loginCoupleUser(username, pass);
    setIsLoadingDB(false);
    if (user) {
      setCurrentUserSlot(user.user_slot);
      setIsLoggedIn(true);
      await refreshFromSupabase();
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUserSlot(1);
  };

  useEffect(() => {
    refreshFromSupabase();

    // Suscribirse a cambios en tiempo real (Supabase Realtime)
    const channel = supabase
      .channel('couple-bitacora-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'couple_users' }, async () => {
        const users = await fetchCoupleUsers();
        if (users.marcelo?.nickname) setUser1Alias(users.marcelo.nickname);
        if (users.nicole?.nickname) setUser2Alias(users.nicole.nickname);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'plans' }, async () => {
        const plans = await fetchPlansFromDB();
        setWishlist(plans);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dates' }, async () => {
        const { memories, activeOngoing } = await fetchDatesFromDB();
        setMemories(memories);
        if (activeOngoing) {
          setActiveOngoingDate(activeOngoing);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'date_photos' }, async () => {
        const { memories, activeOngoing } = await fetchDatesFromDB();
        setMemories(memories);
        if (activeOngoing) {
          setActiveOngoingDate(activeOngoing);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshFromSupabase]);

  // Guardar apodos en Supabase
  const saveNicknames = async (nick1: string, nick2: string) => {
    const clean1 = nick1.trim() || 'Marcelo';
    const clean2 = nick2.trim() || 'Nicole';
    setUser1Alias(clean1);
    setUser2Alias(clean2);

    await Promise.all([
      updateCoupleNicknameInDB(1, clean1),
      updateCoupleNicknameInDB(2, clean2)
    ]);
    showToast('¡Apodos guardados y sincronizados!');
  };

  // Guardar / editar plan en Supabase
  const savePlan = async (plan: PlanItem) => {
    try {
      const saved = await upsertPlanInDB(plan, currentUserSlot);
      setWishlist((prev) => {
        const exists = prev.some((p) => p.id === saved.id || p.id === plan.id);
        if (exists) {
          return prev.map((p) => (p.id === plan.id || p.id === saved.id ? saved : p));
        }
        return [saved, ...prev];
      });
      showToast('¡Idea de plan guardada!');
    } catch (err: any) {
      console.error('Error al guardar plan:', err);
      // Optimistic fallback
      setWishlist((prev) => [plan, ...prev.filter((p) => p.id !== plan.id)]);
      showToast('Idea guardada en planes');
    }
  };

  const deletePlan = async (planId: string) => {
    try {
      setWishlist((prev) => prev.filter((p) => p.id !== planId));
      await deletePlanFromDB(planId);
      showToast('Plan eliminado');
    } catch (err: any) {
      console.error('Error al eliminar plan:', err);
    }
  };

  const deleteMemory = async (memoryId: string) => {
    try {
      setMemories((prev) => prev.filter((m) => m.id !== memoryId));
      if (selectedMemory?.id === memoryId) setSelectedMemory(null);
      await deleteMemoryFromDB(memoryId);
      showToast('Cita eliminada de la bitácora');
    } catch (err: any) {
      console.error('Error al eliminar memoria:', err);
    }
  };

  const startOngoingDateFromPlan = async (plan: PlanItem) => {
    try {
      const newOngoing = await createOngoingDateInDB(
        {
          title: plan.title,
          location_name: plan.location_name || '',
          fromWishId: plan.id,
          gerbera_color: ['purple', 'teal', 'aqua', 'lavender', 'mixed'][Math.floor(Math.random() * 5)]
        },
        currentUserSlot
      );
      setActiveOngoingDate(newOngoing);
      setIsLiveDateModalOpen(true);
      showToast(`¡Cita "${plan.title}" iniciada!`);
    } catch (err) {
      console.error('Error al iniciar cita desde plan en Supabase:', err);
      // Fallback local
      setActiveOngoingDate({
        id: `mem-${Date.now()}`,
        fromWishId: plan.id,
        isEditingExistingMemory: false,
        title: plan.title,
        location_name: plan.location_name || '',
        scheduled_date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        gerbera_color: 'teal',
        stamp_code: `CITA #${String(memories.length + 1).padStart(3, '0')}`,
        random_quote: '',
        person1_liked: '',
        person2_liked: '',
        person1_nice_note: '',
        person2_nice_note: '',
        photos: []
      });
      setIsLiveDateModalOpen(true);
    }
  };

  const startNewQuickDate = async (title?: string, location?: string) => {
    try {
      const newOngoing = await createOngoingDateInDB(
        {
          title: title?.trim() || 'Cita de Hoy',
          location_name: location?.trim() || '',
          gerbera_color: ['purple', 'teal', 'aqua', 'lavender', 'mixed'][Math.floor(Math.random() * 5)]
        },
        currentUserSlot
      );
      setActiveOngoingDate(newOngoing);
      setIsLiveDateModalOpen(true);
      showToast('¡Cita iniciada! Activado botón flotante.');
    } catch (err) {
      console.error('Error al crear cita rápida en Supabase:', err);
      // Fallback local
      const dateNum = memories.length + 1;
      const formattedNum = String(dateNum).padStart(3, '0');
      setActiveOngoingDate({
        id: `mem-${Date.now()}`,
        isEditingExistingMemory: false,
        title: title?.trim() || 'Cita de Hoy',
        location_name: location?.trim() || '',
        scheduled_date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        gerbera_color: 'teal',
        stamp_code: `CITA #${formattedNum}`,
        random_quote: '',
        person1_liked: '',
        person2_liked: '',
        person1_nice_note: '',
        person2_nice_note: '',
        photos: []
      });
      setIsLiveDateModalOpen(true);
    }
  };

  const saveOngoingDateToBitacora = async (completedDate: DateMemory) => {
    try {
      const saved = await saveOngoingDateToBitacoraInDB(completedDate, currentUserSlot);
      setMemories((prev) => [saved, ...prev.filter((m) => m.id !== saved.id)]);

      if (completedDate.fromWishId) {
        setWishlist((prev) => prev.filter((w) => w.id !== completedDate.fromWishId));
      }

      setActiveOngoingDate(null);
      setIsLiveDateModalOpen(false);
      setActiveTab('bitacora');
      showToast(`¡Cita sellada como ${saved.stamp_code || 'recuerdo'}! Guardada en la bitácora.`);
      setPetalShower(true);
      setTimeout(() => setPetalShower(false), 5000);
    } catch (err: any) {
      console.error('Error al guardar cita en Supabase:', err);
      // Fallback local
      setMemories((prev) => [completedDate, ...prev]);
      if (completedDate.fromWishId) {
        setWishlist((prev) => prev.filter((w) => w.id !== completedDate.fromWishId));
      }
      setActiveOngoingDate(null);
      setIsLiveDateModalOpen(false);
      setActiveTab('bitacora');
      showToast('Cita guardada en la bitácora');
    }
  };

  const uploadAndAddPhotoToOngoing = async (
    file: File,
    caption?: string,
    secret?: string
  ): Promise<DatePhoto | null> => {
    if (!activeOngoingDate || !file) return null;

    try {
      showToast('Comprimiendo foto para la bitácora...');
      const publicUrl = await uploadPolaroid(file, activeOngoingDate.id);

      const newPhoto = await addPhotoToOngoingDateInDB(
        activeOngoingDate.id,
        publicUrl,
        caption || activeOngoingDate.title,
        secret || 'Momento especial capturado durante la cita.',
        currentUserSlot,
        activeOngoingDate.photos.length
      );

      setActiveOngoingDate({
        ...activeOngoingDate,
        photos: [...activeOngoingDate.photos, newPhoto]
      });

      showToast('¡Foto comprimida y guardada en la cita! 📸');
      return newPhoto;
    } catch (err: any) {
      console.error('Error al subir foto:', err);
      showToast('Error al subir foto: ' + (err.message || 'Intenta de nuevo'));
      return null;
    }
  };

  const deletePhotoFromOngoing = async (photoId: string) => {
    if (!activeOngoingDate) return;
    await deletePhotoFromDB(photoId);
    setActiveOngoingDate({
      ...activeOngoingDate,
      photos: activeOngoingDate.photos.filter((p) => p.id !== photoId)
    });
    showToast('Foto eliminada de la cita');
  };

  const openQuickPlan = () => {
    setEditingWish({
      id: `wish-${Date.now()}`,
      title: '',
      location_name: '',
      tentative_date: '',
      planning_notes: '',
      references: [],
      checklist: []
    });
  };

  const allPhotosWithContext = useMemo(() => {
    const list: any[] = [];
    memories.forEach((m) => {
      m.photos.forEach((p) => {
        list.push({
          ...p,
          memoryId: m.id,
          memoryTitle: m.title,
          memoryDate: m.scheduled_date,
          memoryLocation: m.location_name,
          memoryObj: m
        });
      });
    });
    return list;
  }, [memories]);

  const displayedRandomPhotos = useMemo(() => {
    if (allPhotosWithContext.length === 0) return [];
    const pseudoRandom = (seed: number) => {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    let seed = randomPhotoSeed;
    const shuffled = [...allPhotosWithContext].sort(() => 0.5 - pseudoRandom(seed++));
    return shuffled.slice(0, 3);
  }, [allPhotosWithContext, randomPhotoSeed]);

  const currentRandomMemoryForQuote = useMemo(() => {
    if (memories.length === 0) return null;
    return memories[randomQuoteIndex % memories.length];
  }, [memories, randomQuoteIndex]);

  const currentSuggestedPlan = useMemo(() => {
    if (wishlist.length === 0) return null;
    return wishlist[randomPlanIndex % wishlist.length];
  }, [wishlist, randomPlanIndex]);

  const value = {
    activeTab, setActiveTab,
    bitacoraMode, setBitacoraMode,
    currentUserSlot, setCurrentUserSlot,
    isLoggedIn, setIsLoggedIn,
    login, logout,
    user1Alias, setUser1Alias,
    user2Alias, setUser2Alias,
    isEditNicknamesOpen, setIsEditNicknamesOpen,
    saveNicknames,
    user1Email, setUser1Email,
    user2Email, setUser2Email,
    surpriseNiceNotes, setSurpriseNiceNotes,
    searchQuery, setSearchQuery,
    currentPageIndex, setCurrentPageIndex,
    isPageTurning, setIsPageTurning,
    memories, setMemories,
    wishlist, setWishlist,
    activeOngoingDate, setActiveOngoingDate,
    isLiveDateModalOpen, setIsLiveDateModalOpen,
    randomQuoteIndex, setRandomQuoteIndex,
    randomPhotoSeed, setRandomPhotoSeed,
    randomPlanIndex, setRandomPlanIndex,
    selectedMemory, setSelectedMemory,
    zoomedPhoto, setZoomedPhoto,
    flippedPolaroids, setFlippedPolaroids,
    editingWish, setEditingWish,
    isQuickCreateOpen, setIsQuickCreateOpen,
    quickCreateMode, setQuickCreateMode,
    petalShower, setPetalShower,
    toastMessage, showToast,
    allPhotosWithContext,
    displayedRandomPhotos,
    currentRandomMemoryForQuote,
    currentSuggestedPlan,
    startOngoingDateFromPlan,
    startNewQuickDate,
    saveOngoingDateToBitacora,
    savePlan,
    deletePlan,
    deleteMemory,
    uploadAndAddPhotoToOngoing,
    deletePhotoFromOngoing,
    openQuickPlan,
    isLoadingDB,
    refreshFromSupabase
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
