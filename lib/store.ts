import { create } from 'zustand';

// Booking context state
export interface BookingContextState {
  conversationId: string | null;
  userId: string;
  currentBooking: {
    vehicle_id?: string;
    vehicle_model?: string;
    daily_rate_gbp?: string;
    pickup_date?: string;
    return_date?: string;
    pickup_time?: string;
    return_time?: string;
    pickup_location?: string;
    return_location?: string;
    passengers?: number;
    total_cost_gbp?: string;
  };
  preferences: {
    budget?: number;
    use_case?: string;
    timeline?: string;
    style?: string;
  };
  verificationStatus: {
    license: 'pending' | 'verified' | 'rejected';
    insurance: 'pending' | 'verified' | 'rejected';
    id: 'pending' | 'verified' | 'rejected';
  };
  // Methods
  setConversationId: (id: string) => void;
  setUserId: (id: string) => void;
  updateBooking: (details: Partial<BookingContextState['currentBooking']>) => void;
  updatePreferences: (prefs: Partial<BookingContextState['preferences']>) => void;
  updateVerification: (doc: keyof BookingContextState['verificationStatus'], status: string) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingContextState>((set) => ({
  conversationId: null,
  userId: 'test-user-001',
  currentBooking: {},
  preferences: {},
  verificationStatus: {
    license: 'pending',
    insurance: 'pending',
    id: 'pending',
  },
  setConversationId: (id) => set({ conversationId: id }),
  setUserId: (id) => set({ userId: id }),
  updateBooking: (details) =>
    set((state) => ({
      currentBooking: { ...state.currentBooking, ...details },
    })),
  updatePreferences: (prefs) =>
    set((state) => ({
      preferences: { ...state.preferences, ...prefs },
    })),
  updateVerification: (doc, status) =>
    set((state) => ({
      verificationStatus: {
        ...state.verificationStatus,
        [doc]: status,
      },
    })),
  resetBooking: () =>
    set({
      conversationId: null,
      currentBooking: {},
      preferences: {},
      verificationStatus: {
        license: 'pending',
        insurance: 'pending',
        id: 'pending',
      },
    }),
}));

// Chat/UI state
export interface ChatUIState {
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>;
  isLoading: boolean;
  error: string | null;
  // Methods
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatUIState>((set) => ({
  messages: [],
  isLoading: false,
  error: null,
  addMessage: (role, content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: `msg-${Date.now()}`,
          role,
          content,
          timestamp: Date.now(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

// Vehicles store
export interface VehiclesState {
  vehicles: Array<{
    id: string;
    model: string;
    category: string;
    daily_rate_gbp: string;
    location: string;
    image_url: string | null;
    specs: Record<string, any>;
  }>;
  isLoading: boolean;
  error: string | null;
  // Methods
  setVehicles: (vehicles: VehiclesState['vehicles']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearVehicles: () => void;
}

export const useVehiclesStore = create<VehiclesState>((set) => ({
  vehicles: [],
  isLoading: false,
  error: null,
  setVehicles: (vehicles) => set({ vehicles }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearVehicles: () => set({ vehicles: [] }),
}));

// User profile store
export interface UserProfileState {
  userId: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  tier: 'bronze' | 'silver' | 'platinum' | 'elite';
  habitScore: number;
  mmCredits: number;
  totalBookings: number;
  // Methods
  setProfile: (profile: Partial<Omit<UserProfileState, 'setProfile' | 'clearProfile'>>) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<UserProfileState>((set) => ({
  userId: null,
  email: null,
  firstName: null,
  lastName: null,
  tier: 'bronze',
  habitScore: 0,
  mmCredits: 0,
  totalBookings: 0,
  setProfile: (profile) => set(profile),
  clearProfile: () =>
    set({
      userId: null,
      email: null,
      firstName: null,
      lastName: null,
      tier: 'bronze',
      habitScore: 0,
      mmCredits: 0,
      totalBookings: 0,
    }),
}));
