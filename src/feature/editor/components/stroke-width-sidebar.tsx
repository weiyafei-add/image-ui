import React from "react";
import { ActiveTool, Editor, STROKE_DASH_ARRAY, STROKE_WIDTH } from "../types";
import { cn } from "@/lib/utils";
import ToolSidebarHeader from "./tool-sidebar-header";
import ToolSidebarClose from "./tool-siderbar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface StrokeWidthSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const StrokeWidthSidebar = ({ activeTool, onChangeActiveTool, editor }: StrokeWidthSidebarProps) => {
  const width = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
  const typeValue = editor?.getActiveStrokeDashArray() || STROKE_DASH_ARRAY;

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "stroke-width" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader title="Stroke options" description="Modify the stroke of your  element" />
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">Stroke width</Label>
          <Slider
            value={[Number(width)]}
            onValueChange={(value) => {
              editor?.changeStrokeWidth(value[0]);
            }}
          />
        </div>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">Stroke Type</Label>
          <Button
            variant={"secondary"}
            size={"lg"}
            className={cn(
              "w-full h-16 justify-start text-left py-4 px-2",
              JSON.stringify(typeValue) === "[]" && "border border-blue-500"
            )}
            onClick={() => {
              editor?.changeStrokeDashArray([]);
            }}
          >
            <div className="w-full border-black rounded-full border-4"></div>
          </Button>
          <Button
            variant={"secondary"}
            size={"lg"}
            className={cn(
              "w-full h-16 justify-start text-left py-4 px-2",
              JSON.stringify(typeValue) === "[5,5]" && "border border-blue-500"
            )}
            onClick={() => {
              editor?.changeStrokeDashArray([5, 5]);
            }}
          >
            <div className="w-full border-black rounded-full border-4 border-dashed"></div>
          </Button>
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

export default StrokeWidthSidebar;
