import { useEffect } from "react";

interface UseCanvasEventsProps {
  canvas: fabric.Canvas | null;
  setSelectObjects: (object: fabric.Object[]) => void;
  onClearSelection: () => void;
}

export const useCanvasEvents = ({ canvas, setSelectObjects, onClearSelection }: UseCanvasEventsProps) => {
  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (e) => {
        setSelectObjects(e.selected || []);
      });
      canvas.on("selection:updated", (e) => {
        setSelectObjects(e.selected || []);
      });
      canvas.on("selection:cleared", () => {
        setSelectObjects([]);
        onClearSelection();
      });
    }

    return () => {
      if (canvas) {
        canvas.off("selection:created").off("selection:updated").off("selection:cleared");
      }
    };
  }, [canvas, setSelectObjects, onClearSelection]);
};
