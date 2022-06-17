import { FC, MouseEvent, useCallback, useEffect, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

import { TRGB, RGB, CursorOptions } from "../types";
import { getColorString } from "../utils";

import '../css/cursor.css'
import { DRAGGING_TIMEOUT } from "../constants";


const getCursorStyle = (color: RGB, { width, border, shadow }: CursorOptions): React.CSSProperties => ( {    
    background: getColorString(color),
    width: width + 'px',
    borderWidth: border + 'px',
    boxShadow: `0 0 0 ${shadow}px black`,
    transform: `translate(-${(width / 2 + border)}px, -${border}px)`
} )

interface ICursor {
    color: TRGB;
    width: number;
    minX: number;
    maxX: number;
    setX: (t: number) => void;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    setDragging: React.Dispatch<React.SetStateAction<boolean>>;
    options: CursorOptions;
}

const Cursor: FC<ICursor> = ( { color, width, minX, maxX, setX, onClick, setDragging, options } ) => {

    const [style, setStyle] = useState<React.CSSProperties>();

    const { r, g, b } = color;

    useEffect( () => {
        setStyle(getCursorStyle(color, options))
    }, [r, g, b])

    const update = useCallback( (e: DraggableEvent, data: DraggableData) => {
        e.preventDefault()
        e.stopPropagation()
        setX(data.x / width) 
    }, [] )
    
    const onStart = update
    const onDrag = (e: DraggableEvent, data: DraggableData) => {
        update(e, data)
        setDragging(true)
    }
    const onStop = (e: DraggableEvent, data: DraggableData) => {
        update(e, data)
        setTimeout( () => setDragging(false), DRAGGING_TIMEOUT )
    }

    return (
        <Draggable 
            axis="x" 
            handle=".cursor"
            position={{x: color.t * width, y: 0}}
            bounds={{left: minX, right: maxX}}
            onStop={onStop} 
            onDrag={onDrag}
            onStart={onStart}
        >
            <div className="dummy">
                <div 
                    className="cursor" 
                    style={style}
                    onClick={onClick}
                />
            </div>
        </Draggable>
    )
}

export default Cursor;