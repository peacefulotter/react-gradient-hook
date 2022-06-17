import { FC } from "react";
import { ChromePicker, ColorChangeHandler } from "react-color";

import { RGB } from "../types";

import '../css/picker.css'

interface IPicker {
    color: RGB;
    pickColor: ColorChangeHandler;
}

const Picker: FC<IPicker> = ( { color, pickColor } ) => {
    return (
        <ChromePicker 
            color={color} 
            onChange={pickColor} 
            disableAlpha={true}/>
    )
}

export default Picker;