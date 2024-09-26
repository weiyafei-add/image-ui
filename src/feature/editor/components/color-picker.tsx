import React from "react";
import { ChromePicker, CirclePicker } from "react-color";
import { colors } from "../types";
import { rgbaObjectToString } from "../utils";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <div className="w-full space-y-4">
      <ChromePicker
        color={value}
        onChange={(color) => {
          onChange(rgbaObjectToString(color.rgb));
        }}
        className="border rounded-lg"
      />
      <CirclePicker
        colors={colors}
        color={value}
        onChangeComplete={(color) => {
          onChange(rgbaObjectToString(color.rgb));
        }}
      />
    </div>
  );
};

export default ColorPicker;
