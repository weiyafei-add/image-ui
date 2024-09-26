import React from "react";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

interface ShapeToolProps {
  onClick: () => void;
  icon: LucideIcon | IconType;
  iconClassName?: string;
}

const ShapeTool = ({ onClick, icon: Icon, iconClassName }: ShapeToolProps) => {
  return (
    <button onClick={onClick} className="aspect-square border">
      <Icon className={cn("w-full h-full", iconClassName)} />
    </button>
  );
};

export default ShapeTool;
