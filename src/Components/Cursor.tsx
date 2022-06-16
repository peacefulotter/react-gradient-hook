import { FC, useCallback, useEffect, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

import { TRGB, RGB, CursorOptions } from "../types";
import { getColorString } from "../utils";

import '../css/cursor.css'


const getCursorStyle = (color: RGB, { width, border, shadow }: CursorOptions): React.CSSProperties => ( {    
    background: getColorString(color),
    width: width + 'px',
    borderWidth: border + 'px',
    boxShadow: `0 0 0 ${shadow}px black`,
} )

interface ICursor {
    color: TRGB;
    left: number;
    right: number;
    minX: number;
    maxX: number;
    setX: (t: number) => void;
    onClick: React.MouseEventHandler<HTMLDivElement>
    options: CursorOptions;
}

const Cursor: FC<ICursor> = ( { color, left, right, minX, maxX, setX, onClick, options } ) => {

    const [style, setStyle] = useState<React.CSSProperties>();

    const { r, g, b } = color;

    const scale = right - left;

    console.log(left, right, minX, maxX);
    

    useEffect( () => {
        setStyle(getCursorStyle(color, options))
    }, [r, g, b])

    const update = useCallback( (e: DraggableEvent, data: DraggableData) => {
        e.preventDefault()
        e.stopPropagation()
        setX(data.x) 
    }, [] )
    
    const onStart = update
    const onDrag = update
    const onStop = update

    return (
        <Draggable 
            axis="x" 
            handle=".cursor"
            position={{x: color.t * scale, y: 0}}
            bounds={{left: minX, right: maxX}}
            onStop={onStop} 
            onDrag={onDrag}
            onStart={onStart}
            // scale={right - left}
        >
            <div 
                className="cursor" 
                style={style}
                onClick={onClick}
            />
        </Draggable>
    )
}

export default Cursor;