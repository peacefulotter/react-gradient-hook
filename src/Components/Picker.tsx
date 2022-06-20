import { FC } from "react";
import { ChromePicker, CirclePicker, ColorChangeHandler, SliderPicker } from "react-color";

import { PickerOptions, RGB } from "../types";

import '../css/picker.css'

interface IPicker {
    color: RGB;
    pickColor: ColorChangeHandler;
    options: Required<PickerOptions>;
}

const Picker: FC<IPicker> = ( { color, pickColor, options } ) => {
    return (
        <div className="picker-wrapper"> 
            { options.showHue ? <SliderPicker color={color} onChange={pickColor}/> : null }
            { options.showChrome ? <ChromePicker color={color} onChange={pickColor} disableAlpha={true}/> : null }
            { options.showCircles ? <CirclePicker color={color} onChange={pickColor} /> : null }
        </div>
        
    )
}

export default Picker;