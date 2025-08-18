"use client";

import { Separator } from "@/components/ui/separator";
import { TabBar } from "./tabbar";
import { useMediaPanelStore } from "./store";
import { MediaView } from "./views/media";

export function MediaPanel() {
  const { activeTab } = useMediaPanelStore();

  const viewMap = {
    media: <MediaView />,
    audio: (
      <div className="p-4 text-muted-foreground">audio view coming soon...</div>
    ),
    text: (
      <div className="p-4 text-muted-foreground">text view coming soon...</div>
    ),
    stickers: (
      <div className="p-4 text-muted-foreground">
        Stickers view coming soon...
      </div>
    ),
    effects: (
      <div className="p-4 text-muted-foreground">
        Effects view coming soon...
      </div>
    ),
    transitions: (
      <div className="p-4 text-muted-foreground">
        Transitions view coming soon...
      </div>
    ),
    captions: (
      <div className="p-4 text-muted-foreground">
        Captions view coming soon...
      </div>
    ),
    filters: (
      <div className="p-4 text-muted-foreground">
        Filters view coming soon...
      </div>
    ),
    adjustment: (
      <div className="p-4 text-muted-foreground">
        Adjustment view coming soon...
      </div>
    ),
    settings: (
      <div className="p-4 text-muted-foreground">
        settings view coming soon...
      </div>
    ),
  };
  return (
    <div className="h-full flex bg-panel">
      <TabBar />
      <Separator orientation="vertical" />
      <div className="flex-1 overflow-hidden">{viewMap[activeTab]}</div>
    </div>
  );
}
