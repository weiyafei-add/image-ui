import React from "react";
import { ActiveTool, Editor, FILL_COLOR } from "../types";
import { cn } from "@/lib/utils";
import ToolSidebarHeader from "./tool-sidebar-header";
import ToolSidebarClose from "./tool-siderbar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import ColorPicker from "./color-picker";

interface FillColorSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const FillColorSidebar = ({ activeTool, onChangeActiveTool, editor }: FillColorSidebarProps) => {
  const value = editor?.getActiveFillColor() || FILL_COLOR;

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "fill" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader title="Fill color" description="Add fill color to your component" />
      <ScrollArea>
        <div className="p-4">
          <ColorPicker
            value={value}
            onChange={(color) => {
              editor?.changeFillColor(color);
            }}
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

export default FillColorSidebar;
