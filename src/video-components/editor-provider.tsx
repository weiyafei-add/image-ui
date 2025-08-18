"use client";
import { useEditorStore } from "@/stores/editor-store";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const { isInitializing, isPanelReady, initializeApp } = useEditorStore();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  if (isInitializing || !isPanelReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  //   App is ready, render children

  return <>{children}</>;
};
