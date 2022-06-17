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
    transform: `translate(-${(width / 2 + border)}px)`
} )

interface ICursor {
    color: TRGB;
    width: number;
    minX: number;
    maxX: number;
    setX: (t: number) => void;
    onClick: React.MouseEventHandler<HTMLDivElement>
    options: CursorOptions;
}

const Cursor: FC<ICursor> = ( { color, width, minX, maxX, setX, onClick, options } ) => {

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
    const onDrag = update
    const onStop = update

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