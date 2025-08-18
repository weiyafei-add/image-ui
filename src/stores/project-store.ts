import { storageService } from "@/lib/storage/storage-service";
import { generateUUID } from "@/lib/utils";
import { CanvasMode, CanvasSize } from "@/types/editor";
import { TProject } from "@/types/project";
import { toast } from "sonner";
import { create } from "zustand";
import { useMediaStore } from "./media-store";

export const DEFAULT_CANVAS_SIZE: CanvasSize = { width: 1920, height: 1080 };
export const DEFAULT_FPS = 30;

const DEFAULT_PROJECT: TProject = {
  id: generateUUID(),
  name: "Untitled",
  thumbnail: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  backgroundColor: "#000000",
  backgroundType: "color",
  blurIntensity: 8,
  bookmarks: [],
  fps: DEFAULT_FPS,
  canvasSize: DEFAULT_CANVAS_SIZE,
  canvasMode: "preset",
};

interface ProjectStore {
  activeProject: TProject | null;
  savedProjects: TProject[];
  isLoading: boolean;
  isInitialized: boolean;
  invalidProjectIds?: Set<string>;

  // Actions
  createNewProject: (name: string) => Promise<string>;
  loadProject: (id: string) => Promise<void>;
  saveCurrentProject: () => Promise<void>;
  loadAllProjects: () => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  closeProject: () => void;
  renameProject: (projectId: string, name: string) => Promise<void>;
  duplicateProject: (projectId: string) => Promise<string>;
  updateProjectBackground: (backgroundColor: string) => Promise<void>;
  updateBackgroundType: (
    type: "color" | "blur",
    options?: { backgroundColor?: string; blurIntensity?: number }
  ) => Promise<void>;
  updateProjectFps: (fps: number) => Promise<void>;
  updateCanvasSize: (size: CanvasSize, mode: CanvasMode) => Promise<void>;

  // Bookmark methods
  // toggleBookmark: (time: number) => Promise<void>;
  // isBookmarked: (time: number) => boolean;
  // removeBookmark: (time: number) => Promise<void>;

  getFilteredAndSortedProjects: (
    searchQuery: string,
    sortOption: string
  ) => TProject[];

  // Global invalid project ID tracking
  // isInvalidProjectId: (id: string) => boolean;
  // markProjectIdAsInvalid: (id: string) => void;
  // clearInvalidProjectIds: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  activeProject: null,
  savedProjects: [],
  isLoading: true,
  isInitialized: false,
  invalidProjectIds: new Set<string>(),

  createNewProject: async (name: string) => {
    const newProject: TProject = { ...DEFAULT_PROJECT, name };

    set({ activeProject: newProject });

    try {
      await storageService.saveProject(newProject);
      await get().loadAllProjects();
      return newProject.id;
    } catch (error) {
      toast.error("Failed to save new project");
      throw error;
    }
  },

  loadAllProjects: async () => {
    if (!get().invalidProjectIds) {
      set({ isLoading: true });
    }

    try {
      const projects = await storageService.loadAllProjects();
      set({ savedProjects: projects });
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  loadProject: async (id: string) => {
    if (!get().isInitialized) {
      set({ isLoading: true });
    }

    const mediaStore = useMediaStore.getState();
    mediaStore.clearAllMedia();
    // todo

    try {
      const project = await storageService.loadProject(id);

      if (project) {
        set({ activeProject: project });
        // todo
        await Promise.all([mediaStore.loadProjectMedia(id)]);
      } else {
        throw new Error(`Project with id ${id} not found`);
      }
    } catch (error) {
      console.error("Failed to load project:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProject: () => {},
}));
