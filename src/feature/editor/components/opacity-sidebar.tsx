import React, { useState } from "react";
import { ActiveTool, Editor, OPACITY, STROKE_DASH_ARRAY, STROKE_WIDTH } from "../types";
import { cn } from "@/lib/utils";
import ToolSidebarHeader from "./tool-sidebar-header";
import ToolSidebarClose from "./tool-siderbar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface OpacitySidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const OpacitySidebar = ({ activeTool, onChangeActiveTool, editor }: OpacitySidebarProps) => {
  const initialOpacity = editor?.getActiveOpacity() || OPACITY;

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "opacity" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader title="Stroke options" description="Modify the stroke of your  element" />
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">Stroke width</Label>
          <Slider
            value={[Number(initialOpacity)]}
            onValueChange={(value) => {
              editor?.changeOpacity(value[0]);
            }}
            max={1}
            min={0}
            step={0.01}
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose
        onClick={() => {
          onChangeActiveTool("select");
        }}
      />
    </aside>
  );
};

export default OpacitySidebar;
