import create from 'zustand';
import produce from 'immer';
import { Storage } from "@plasmohq/storage"

interface FieldState {
  screen: string;
  setScreen: (screen: string) => void;

  localStorageKey: string;
  setLocalStorageKey: (localStorageKey: string) => void;
  localStorageValue: string;
  setLocalStorageValue: (value: string) => void;
}

const storage = new Storage()

const useStore = create<FieldState>((set) => ({
  screen: 'home',
  setScreen: (screen: string) => set(() => ({ screen })),

  // LocalStorage Key
  localStorageKey: '',
  setLocalStorageKey: (value: string) => set(produce((state) => {
    state.localStorageKey = value;
    storage.set("localStorageKey", value);
  })),

  // LocalStorage Value
  localStorageValue: "",
  setLocalStorageValue: (value: string) => set(produce((state) => {
    state.localStorageValue = value;
    storage.set("localStorageValue", value);
  })),
}));

export default useStore;
