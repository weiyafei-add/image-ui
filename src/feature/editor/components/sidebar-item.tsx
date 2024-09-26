import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SideBarItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

export const SideBarItem = ({ icon: Icon, label, isActive, onClick }: SideBarItemProps) => {
  return (
    <Button
      variant={"ghost"}
      onClick={onClick}
      className={cn(
        "w-full h-full aspect-video p-3 py-4 flex flex-col rounded-none",
        isActive && "bg-muted text-primary"
      )}
    >
      <Icon className="size-5 stroke-2 shrink-0" />
      <span className=" mt-2 text-xs">{label}</span>
    </Button>
  );
};
