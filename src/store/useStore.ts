import create from 'zustand';
import produce from 'immer';
import { Storage } from "@plasmohq/storage"
import type { Screen, HistoryItems } from '~/types/types';

interface FieldState {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  localStorageKey: string;
  setLocalStorageKey: (localStorageKey: string) => void;
  localStorageValue: string;
  setLocalStorageValue: (value: string) => void;
  setOptimizelyProjectId: (optimizelyProjectId: string) => void;
  optimizelyProjectId?: string;
  defaultScreen: Screen;
  setDefaultScreen: (screen: Screen) => void;
  optimizelyAccessToken: string;
  setOptimizelyAccessToken: (token: string) => void;
  historyItems: Array<HistoryItems>;
  setHistoryItems: (historyItems: Array<HistoryItems>) => void;
}

const storage = new Storage()

const useStore = create<FieldState>((set) => ({
  screen: 'home',
  defaultScreen: 'home',
  localStorageKey: '',
  localStorageValue: '',
  optimizelyAccessToken: '',
  optimizelyProjectId: null,
  historyItems: [],

  setScreen: (screen) => set(() => ({ screen })),
  setDefaultScreen: (screen) => set(produce((state) => {
    state.defaultScreen = screen;
    storage.set("defaultScreen", screen);
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
  setHistoryItems: (history) => set(produce((state) => {
    state.historyItems = history;
    storage.set("history", JSON.stringify(history));
  })),
}));

export default useStore;
