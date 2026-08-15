import { create } from 'zustand';

export type Room =
  | 'landing'
  | 'ship-map'
  | 'command'
  | 'ai-lab'
  | 'project-archive'
  | 'engineering'
  | 'achievement'
  | 'communications'
  | 'system-core';

export type ViewMode = 'explore' | 'professional';

interface PortfolioStore {
  currentRoom: Room;
  viewMode: ViewMode;
  finaleTriggered: boolean;
  exploredRooms: Set<Room>;
  activeProject: string | null;
  activeAchievement: string | null;
  chatOpen: boolean;

  // Actions
  navigateTo: (room: Room) => void;
  setViewMode: (mode: ViewMode) => void;
  triggerFinale: () => void;
  markRoomExplored: (room: Room) => void;
  openProject: (id: string) => void;
  closeProject: () => void;
  openAchievement: (id: string) => void;
  closeAchievement: () => void;
  toggleChat: () => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  currentRoom: 'landing',
  viewMode: 'explore',
  finaleTriggered: false,
  exploredRooms: new Set<Room>(),
  activeProject: null,
  activeAchievement: null,
  chatOpen: false,

  navigateTo: (room) =>
    set((state) => ({
      currentRoom: room,
      exploredRooms: new Set([...state.exploredRooms, room]),
    })),

  setViewMode: (mode) => set({ viewMode: mode }),

  triggerFinale: () => set({ finaleTriggered: true }),

  markRoomExplored: (room) =>
    set((state) => ({
      exploredRooms: new Set([...state.exploredRooms, room]),
    })),

  openProject: (id) => set({ activeProject: id }),
  closeProject: () => set({ activeProject: null }),

  openAchievement: (id) => set({ activeAchievement: id }),
  closeAchievement: () => set({ activeAchievement: null }),

  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
}));
