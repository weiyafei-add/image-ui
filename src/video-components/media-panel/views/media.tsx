"use client";

import { Button } from "@/components/ui/button";
import { processMediaFiles } from "@/lib/medio-processing";
import { CloudUpload, Loader2, Video } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { MediaItem, useMediaStore } from "@/stores/media-store";
import { useProjectStore } from "@/stores/project-store";

export function MediaView() {
  const { addMediaItem, mediaItems } = useMediaStore();
  const { activeProject } = useProjectStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filteredMediaItems, setFilteredMediaItems] = useState(mediaItems);

  const handleFileSelect = () => fileInputRef.current?.click(); // Open file picker
  console.log("filteredMediaItems", filteredMediaItems, activeProject);
  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    if (!activeProject) {
      toast.error("No active project");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    try {
      const processedItems = await processMediaFiles(files, (p) =>
        setProgress(p)
      );
      // Add each processed media item to the store
      for (const item of processedItems) {
        console.log(item);
        await addMediaItem(activeProject.id, item);
      }
    } catch (error) {
      toast.error("Failed to process files");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // When files are selected via file picker, process them
    if (e.target.files) processFiles(e.target.files);
    e.target.value = ""; // Reset input
  };

  const previewComponents = useMemo(() => {
    const previews = new Map<string, React.ReactNode>();

    filteredMediaItems.forEach((item) => {
      let preview: React.ReactNode;

      if (item.type === "image") {
        preview = (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={item.url}
              alt={item.name}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
            />
          </div>
        );
      } else if (item.type === "video") {
        if (item.thumbnailUrl) {
          preview = (
            <div className="relative size-full">
              <img
                src={item.thumbnailUrl}
                alt={item.name}
                className="size-full object-cover rounded"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                <Video className="size-6 text-white drop-shadow-md" />
              </div>
            </div>
          );
        }
      } else if (item.type === "audio") {
      } else {
      }

      previews.set(item.id, preview);
    });

    return previews;
  }, [filteredMediaItems]);

  const renderPreview = (item: MediaItem) => previewComponents.get(item.id);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*, video/*, audio/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="h-full flex flex-col gap-1 transition-colors relative">
        <div className="p-3 pb-2 bg-panel">
          {/* search and filter controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={"outline"}
              size={"lg"}
              onClick={handleFileSelect}
              disabled={isProcessing}
              className="!bg-background px-4 flex-1 justify-center items-center h-9 hover:opacity-75 transition-opacity"
            >
              {isProcessing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CloudUpload className="size-4" />
              )}
              <span>upload</span>
            </Button>
          </div>
        </div>

        <div className="h-full w-full overflow-y-auto scrollbar-thin">
          <div className="flex-1 p-3 pt-0 w-full">
            <GridView
              filteredMediaItems={filteredMediaItems}
              renderPreview={renderPreview}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function GridView({
  filteredMediaItems,
  renderPreview,
  handleRemove,
}: {
  filteredMediaItems: MediaItem[];
  renderPreview: (item: MediaItem) => React.ReactNode;
  handleRemove?: (e: React.MouseEvent, id: string) => Promise<void>;
}) {
  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: "repeat(auto-fill, 160px)",
      }}
    >
      {filteredMediaItems.map((item) => {
        return <div key={item.id}>{renderPreview(item)}</div>;
      })}
    </div>
  );
}
