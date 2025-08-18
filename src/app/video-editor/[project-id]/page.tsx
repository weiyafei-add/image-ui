"use client";

import React, { useEffect, useRef } from "react";
import { usePanelStore } from "@/stores/panel-store";
import { EditorProvider } from "@/video-components/editor-provider";
import { MediaPanel } from "@/video-components/media-panel/index";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/video-components/ui/resizable";
import { useParams, useRouter } from "next/navigation";
import { useProjectStore } from "@/stores/project-store";

const VideoEditorPage = () => {
  const {
    toolsPanel,
    previewPanel,
    mainContent,
    timeline,
    propertiesPanel,
    setMainContent,
    setPreviewPanel,
    setPropertiesPanel,
    setTimeline,
    setToolsPanel,
  } = usePanelStore();

  const { activeProject, loadProject } = useProjectStore();

  const params = useParams();
  const router = useRouter();
  const projectId = params["project-id"] as string;
  const isInitializingRef = useRef<boolean>(false);
  const handledProjectIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    let isCancelled = false;

    const initProject = async () => {
      if (!projectId) {
        return null;
      }
      // Prevent duplicate initialization
      if (isInitializingRef.current) {
        return;
      }

      // Check if project is already loaded
      if (activeProject?.id === projectId) {
        return;
      }

      if (handledProjectIds.current.has(projectId)) {
        return;
      }

      isInitializingRef.current = true;
      handledProjectIds.current.add(projectId);

      try {
        await loadProject(projectId);

        isInitializingRef.current = false;
      } catch (error) {}
    };

    initProject();

    return () => {
      isCancelled = true;
      isInitializingRef.current = false;
    };
  }, [projectId, activeProject]);

  return (
    <EditorProvider>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
        <header>editor header</header>
        <div className="min-h-0 min-w-0 flex-1">
          <ResizablePanelGroup
            className="size-full gap-[0.18rem]"
            direction="vertical"
          >
            <ResizablePanel
              className="min-h-0"
              defaultSize={mainContent}
              maxSize={85}
              minSize={30}
              onResize={setMainContent}
            >
              {/* main content area */}
              <ResizablePanelGroup
                className="size-full gap-[0.19rem] px-3"
                direction="horizontal"
              >
                {/* tools panel */}
                <ResizablePanel
                  className="min-h-0"
                  defaultSize={toolsPanel}
                  maxSize={40}
                  minSize={15}
                  onResize={setToolsPanel}
                >
                  <MediaPanel />
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* preview area */}
                <ResizablePanel
                  defaultSize={previewPanel}
                  minSize={30}
                  onResize={setPreviewPanel}
                >
                  preview
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* properties panel */}
                <ResizablePanel
                  defaultSize={propertiesPanel}
                  maxSize={40}
                  minSize={15}
                  onResize={setPropertiesPanel}
                >
                  preview
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel
              className="min-h-0 px-3 pb-3"
              defaultSize={timeline}
              maxSize={70}
              minSize={15}
              onResize={setTimeline}
            >
              {/* timeline */}x timeline
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </EditorProvider>
  );
};

export default VideoEditorPage;
