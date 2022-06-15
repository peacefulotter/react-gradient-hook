import { FC } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

import { TRGB, RGB } from "../types";
import { getColorString } from "../utils";

import '../css/cursor.css'


const getCursorStyle = (color: RGB): object => {    
    return {
        background: getColorString(color)
    }
}

interface ICursor {
    color: TRGB;
    width: number;
    x: number;
    setX: (t: number) => void;
    setShowPicker: React.MouseEventHandler<HTMLDivElement>
}

const Cursor: FC<ICursor> = ( { color, x, width, setShowPicker, setX } ) => {

    const update = (data: DraggableData) => setX(data.x / width) 
    const onDrag = (_: DraggableEvent, data: DraggableData) => update(data)
    const onStop = (_: DraggableEvent, data: DraggableData) => update(data)

    return (
        <Draggable 
            axis="x" 
            handle=".cursor" 
            bounds={{left: 0, right: width}}
            defaultPosition={{x: x * width, y: 0}} 
            onStop={onStop} 
            onDrag={onDrag}
        >
            <div 
                className="cursor" 
                style={getCursorStyle(color)}
                onClick={setShowPicker}
            />
        </Draggable>
    )
}

export default Cursor;