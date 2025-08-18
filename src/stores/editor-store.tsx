import { create } from "zustand";
import { CanvasPreset } from "@/types/editor";
type CanvasMode = "preset" | "original" | "custom";

interface EditorState {
  // loading states
  isInitializing: boolean;
  isPanelReady: boolean;

  // canvas states
  canvasSize: {
    width: number;
    height: number;
  };
  canvasMode: CanvasMode;

  //   actions
  setInitializing: (isInitializing: boolean) => void;
  setPanelReady: (isPanelReady: boolean) => void;
  setCanvasSize: (
    canvasSize: { width: number; height: number },
    canvasMode: CanvasMode
  ) => void;
  setCanvasSizeToOriginal: (aspectRatio: number) => void;
  setCanvasSizeFromAspectRatio: (aspectRatio: number) => void;
  initializeApp: () => Promise<void>;
}

const DEFAULT_CANVAS_PRESETS: CanvasPreset[] = [
  { name: "16:9", width: 1920, height: 1080 },
  { name: "9:16", width: 1080, height: 1920 },
  { name: "1:1", width: 1080, height: 1080 },
  { name: "4:3", width: 1440, height: 1080 },
];

// Helper function to find the best matching canvas preset for an aspect ratio
const findBestCanvasSize = (aspectRatio: number) => {
  // Calculate aspect ratio for each preset and find the closest match
  const bestMatch = DEFAULT_CANVAS_PRESETS[0]; // Default to 16:9 HD
  const smallestDifference = Math.abs(
    aspectRatio - bestMatch.width / bestMatch.height
  );

  return { width: bestMatch.width, height: bestMatch.height };
};

export const useEditorStore = create<EditorState>((set) => ({
  isInitializing: true,
  isPanelReady: false,
  canvasSize: {
    width: 1920,
    height: 1080,
  },
  canvasMode: "preset" as CanvasMode, // why?

  //   actions
  setInitializing: (isInitializing: boolean) => set({ isInitializing }),

  setPanelReady: (isPanelReady: boolean) => set({ isPanelReady }),

  initializeApp: async () => {
    console.log("initializing app");
    set({ isInitializing: true, isPanelReady: false });
    set({ isInitializing: false, isPanelReady: true });
    console.log("app initialized");
  },

  setCanvasSize: (canvasSize) => set({ canvasSize, canvasMode: "preset" }),

  setCanvasSizeToOriginal: (aspectRatio) => {
    const newCanvasSize = findBestCanvasSize(aspectRatio);
    set({ canvasSize: newCanvasSize, canvasMode: "original" });
  },

  setCanvasSizeFromAspectRatio: (aspectRatio) => {
    const newCanvasSize = findBestCanvasSize(aspectRatio);
    set({ canvasSize: newCanvasSize, canvasMode: "custom" });
  },
}));
