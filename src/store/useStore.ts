import { Storage } from "@plasmohq/storage"
import create from 'zustand';
import produce from 'immer';

import type { HistoryItems, Screen } from '~/types/types';

interface FieldState {
  setOptimizelyProjectId: (optimizelyProjectId: string) => void;
  setHistoryItems: (historyItems: Array<HistoryItems>) => void;
  setLocalStorageKey: (localStorageKey: string) => void;
  setOptimizelyAccessToken: (token: string) => void;
  setLocalStorageValue: (value: string) => void;
  setDefaultScreen: (screen: Screen) => void;
  setScreen: (screen: Screen) => void;
  historyItems: Array<HistoryItems>;
  optimizelyAccessToken: string;
  optimizelyProjectId?: string;
  localStorageValue: string;
  localStorageKey: string;
  defaultScreen: Screen;
  screen: Screen;
}

const storage = new Storage()

const useStore = create<FieldState>((set) => ({
  defaultScreen: 'home',
  historyItems: [],
  localStorageKey: '',
  localStorageValue: '',
  optimizelyAccessToken: '',
  optimizelyProjectId: null,
  screen: 'home',

  setDefaultScreen: (screen) => set(produce((state) => {
    state.defaultScreen = screen;
    storage.set("defaultScreen", screen);
  })),
  setHistoryItems: (history) => set(produce((state) => {
    state.historyItems = history;
    storage.set("history", JSON.stringify(history));
  })),
  setLocalStorageKey: (localStorageKey) => set(produce((state) => {
    state.localStorageKey = localStorageKey;
    storage.set("localStorageKey", localStorageKey);
  })),
  setLocalStorageValue: (value) => set(produce((state) => {
    state.localStorageValue = value;
    storage.set("localStorageValue", value);
  })),
  setOptimizelyAccessToken: (token) => set(produce((state) => {
    state.optimizelyAccessToken = token;
    storage.set("optimizelyAccessToken", token);
  })),
  setOptimizelyProjectId: (projectId) => set(produce((state) => {
    state.optimizelyProjectId = projectId;
    storage.set("optimizelyProjectId", projectId);
  })),
  setScreen: (screen) => set(() => ({ screen })),
}));

export default useStore;
