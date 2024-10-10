import React from "react";
import { ActiveTool, Editor } from "../types";
import { cn } from "@/lib/utils";
import ToolSidebarHeader from "./tool-sidebar-header";
import ToolSidebarClose from "./tool-siderbar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface TextSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const TextSidebar = ({ activeTool, onChangeActiveTool, editor }: TextSidebarProps) => {
  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "text" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader title="Text" description="Add text to your canvas" />
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Button
            className="w-full"
            onClick={() => {
              editor?.addText("hello");
            }}
          >
            Add a textbox
          </Button>
          <Button
            className="w-full h-16"
            variant={"secondary"}
            size={"lg"}
            onClick={() => {
              editor?.addText("Heading", {
                fontSize: 80,
                fontWeight: 700,
              });
            }}
          >
            <span className="text-3xl font-bold">Add a heading</span>
          </Button>
          <Button
            className="w-full h-16"
            variant={"secondary"}
            size={"lg"}
            onClick={() => {
              editor?.addText("subheading", {
                fontSize: 44,
                fontWeight: 500,
              });
            }}
          >
            <span className="text-xl font-bold">Add a subheading</span>
          </Button>
          <Button
            className="w-full h-16"
            variant={"secondary"}
            size={"lg"}
            onClick={() => {
              editor?.addText("Paragraph", {
                fontSize: 32,
              });
            }}
          >
            <span className="text-3xl font-medium">Add a paragraph</span>
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

export default TextSidebar;
