import { useCallback, useMemo, useState } from "react";
import { fabric } from "fabric";
import { useAutoSize } from "./use-auto-size";
import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  Editor,
  FILL_COLOR,
  OPACITY,
  RECTANGLE_OPTIONS,
  SOFT_RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TEXT_OPTIONS,
  TRIANGLE_OPTIONS,
} from "../types";
import { useCanvasEvents } from "./use-canvas-events";
import { isTextType } from "../utils";

const buildEditor = ({
  canvas,
  setFillColor,
  setStrokeColor,
  setStrokeWidth,
  strokeColor,
  strokeWidth,
  fillColor,
  selectObject,
  strokeDashArray,
  setStrokeDashArray,
  opacity,
  setOpacity,
}: BuildEditorProps): Editor => {
  const getWorkspace = () => {
    return canvas.getObjects().find((object) => object.name === "clip");
  };

  const centerToCanvas = (object: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();

    // @ts-expect-error abcd
    canvas._centerObject(object, center);

    canvas.add(object);
    canvas.setActiveObject(object);
  };

  return {
    addText: (value, options) => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        ...options,
      });
      centerToCanvas(object);
    },
    changeOpacity: (opacity) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity });
      });
      setOpacity(opacity);
      canvas.renderAll();
    },
    bringForwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        object.bringForward();
      });
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        object.sendBackwards();
      });
      getWorkspace()?.sendBackwards();
    },
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },
    changeStrokeWidth: (width: number) => {
      setStrokeWidth(width);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: width });
      });
      canvas.renderAll();
    },
    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });
      canvas.renderAll();
    },
    changeStrokeColor: (color: string) => {
      setStrokeColor(color);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type!)) {
          object.set({ fill: color });
          return;
        }
        object.set({ stroke: color });
      });
      canvas.renderAll();
    },
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        strokeWidth,
        stroke: strokeColor,
      });
      centerToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...SOFT_RECTANGLE_OPTIONS,
        rx: 10,
        ry: 10,
        fill: fillColor,
        strokeWidth,
        stroke: strokeColor,
      });
      centerToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        strokeWidth,
        stroke: strokeColor,
      });
      centerToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        strokeWidth,
        stroke: strokeColor,
      });
      centerToCanvas(object);
    },
    addInverseTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        strokeWidth,
        stroke: strokeColor,
        angle: 180,
      });
      centerToCanvas(object);
    },
    addDiamond: () => {
      const width = 100;
      const height = 100;
      const object = new fabric.Polygon(
        [
          { x: width / 2, y: 0 },
          { x: width, y: height / 2 },
          { x: width / 2, y: height },
          { x: 0, y: height / 2 },
        ],
        {
          ...RECTANGLE_OPTIONS,
          fill: fillColor,
          strokeWidth,
          stroke: strokeColor,
        }
      );
      centerToCanvas(object);
    },
    strokeColor,
    getActiveStrokeWidth: () => {
      const selectedObject = selectObject[0];
      if (!selectedObject) {
        return strokeWidth;
      }

      return selectedObject.get("strokeWidth") || strokeWidth;
    },
    fillColor,
    canvas,
    selectObject,
    getActiveFillColor: () => {
      const selectedObject = selectObject[0];
      if (!selectedObject) {
        return fillColor;
      }

      return (selectedObject.get("fill") as string) || fillColor;
    },
    getActiveOpacity: () => {
      const selectedObject = selectObject[0];
      if (!selectedObject) {
        return opacity;
      }

      return selectedObject.get("opacity") || opacity;
    },
    getActiveStrokeColor: () => {
      const selectedObject = selectObject[0];
      if (!selectedObject) {
        return strokeColor;
      }

      return (selectedObject.get("stroke") as string) || strokeColor;
    },
    getActiveStrokeDashArray: () => {
      const selectedObject = selectObject[0];
      if (!selectedObject) {
        return strokeDashArray;
      }

      return selectedObject.get("strokeDashArray") || strokeDashArray;
    },
  };
};

export const useEditor = (props: { onClearSelection: () => void }) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectObject, setSelectObjects] = useState<Array<fabric.Object>>([]);

  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] = useState<Array<number>>(STROKE_DASH_ARRAY);
  const [opacity, setOpacity] = useState(OPACITY);

  useAutoSize({
    canvas,
    container,
  });

  useCanvasEvents({
    canvas,
    setSelectObjects,
    onClearSelection: props.onClearSelection,
  });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canvas,
        fillColor,
        strokeColor,
        strokeWidth,
        setStrokeColor,
        setStrokeWidth,
        setFillColor,
        selectObject,
        setStrokeDashArray,
        strokeDashArray,
        opacity,
        setOpacity,
      });
    }
    return undefined;
  }, [canvas, fillColor, strokeColor, strokeWidth, selectObject]);

  const init = useCallback(
    ({ initialCanvas, initialContainer }: { initialCanvas: fabric.Canvas; initialContainer: HTMLDivElement }) => {
      fabric.Object.prototype.set({
        cornerColor: "#fff",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      });
      const initialWorkspace = new fabric.Rect({
        width: 500,
        height: 500,
        fill: "white",
        name: "clip",
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: "rgba(0,0,0,0.8)",
          blur: 5,
        }),
      });
      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);
    },
    []
  );

  return { init, editor };
};
