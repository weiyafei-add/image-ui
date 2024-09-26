import React, { useState } from "react";
import { Editor } from "../types";
import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BsBorderWidth } from "react-icons/bs";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: string;
  onChangeActiveTool: any;
}

const Toolbar = ({ editor, activeTool, onChangeActiveTool }: ToolbarProps) => {
  const fillColor = editor?.getActiveFillColor();
  const strokeColor = editor?.getActiveStrokeColor();

  if (editor?.selectObject?.length === 0) {
    return (
      <aside className="bg-white shrink-0 border-b w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2 h-[53px]" />
    );
  }

  return (
    <div className="bg-white shrink-0 border-b w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
      <div className="flex items-center h-full justify-center">
        <Hint label="Color">
          <Button
            onClick={() => {
              onChangeActiveTool("fill");
            }}
            size={"icon"}
            variant={"ghost"}
            className={cn(activeTool === "fill" && "bg-gray-100")}
          >
            <div className="rounded-sm size-4 border" style={{ backgroundColor: fillColor }} />
          </Button>
        </Hint>
        <Hint label="Border Color">
          <Button
            onClick={() => {
              onChangeActiveTool("stroke-color");
            }}
            size={"icon"}
            variant={"ghost"}
            className={cn(activeTool === "stroke-color" && "bg-gray-100")}
          >
            <div className="rounded-sm size-4 border" style={{ borderColor: strokeColor }} />
          </Button>
        </Hint>
        <Hint label="Stroke Color">
          <Button
            onClick={() => {
              onChangeActiveTool("stroke-width");
            }}
            size={"icon"}
            variant={"ghost"}
            className={cn(activeTool === "stroke-width" && "bg-gray-100")}
          >
            <BsBorderWidth />
          </Button>
        </Hint>
      </div>
    </div>
  );
};

export default Toolbar;
