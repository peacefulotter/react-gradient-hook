import { FC } from "react";
import { ChromePicker, ColorChangeHandler } from "react-color";

import { RGB } from "../types";

import '../css/picker.css'

interface IPicker {
    color: RGB;
    removeCursor: () => void;
    pickColor: ColorChangeHandler;
}

const Picker: FC<IPicker> = ( { color, removeCursor, pickColor } ) => {
    return (
        <ChromePicker 
            color={color} 
            onChange={pickColor} />
    )
}

export default Picker;