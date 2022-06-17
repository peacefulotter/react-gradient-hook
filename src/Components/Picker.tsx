import { FC } from "react";
import { ChromePicker, CirclePicker, ColorChangeHandler, SliderPicker } from "react-color";

import { RGB } from "../types";

import '../css/picker.css'

interface IPicker {
    color: RGB;
    pickColor: ColorChangeHandler;
}

const Picker: FC<IPicker> = ( { color, pickColor } ) => {
    return (
        <div className="picker-wrapper"> 
            <SliderPicker color={color} onChange={pickColor}/>
            <ChromePicker 
                color={color} 
                onChange={pickColor} 
                disableAlpha={true}/>
            <CirclePicker color={color} onChange={pickColor} />
        </div>
        
    )
}

export default Picker;