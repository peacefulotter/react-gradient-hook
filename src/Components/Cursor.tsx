import { FC, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import Draggable, { DraggableBounds, DraggableData, DraggableEvent } from "react-draggable";

import CursorTooltip from "./CursorTooltip";

import { TRGB, RGB, CursorOptions } from "../types";
import { DRAGGING_TIMEOUT } from "../constants";
import { getColorString } from "../utils";

import '../css/cursor.css'


const getCursorStyle = (color: RGB, { width, border, shadow }: CursorOptions, selected: boolean): React.CSSProperties => ( {    
    background: getColorString(color),
    width: width + 'px',
    borderWidth: border + 'px',
    boxShadow: `0 0 0 ${shadow}px black ${selected ? ', 0px 0px 2px 3px rgba(0, 0, 0, 0.6)': ''}`,
    transform: `translate(-${(width / 2 + border)}px, -${border}px)`,
} )

const preventProp = (e: DraggableEvent) => {
    e.preventDefault()
    e.stopPropagation()
}

interface ICursor {
    color: TRGB;
    selected: boolean;
    width: number;
    minX: number;
    maxX: number;
    setX: (t: number, min: number, max: number) => void;
    removeColor: (event: MouseEvent<HTMLDivElement>) => void;
    selectColor: (event: MouseEvent<HTMLDivElement>) => void;
    setDragging: React.Dispatch<React.SetStateAction<boolean>>;
    options: Required<CursorOptions>;
}

const Cursor: FC<ICursor> = ( { color, selected, width, minX, maxX, setX, selectColor, removeColor, setDragging, options } ) => {

    const handleRef = useRef(null);
    const [style, setStyle] = useState<React.CSSProperties>();
    const [startX, setStartX] = useState<number>(0); // used when grid is true

    const { r, g, b } = color;
    const { height, border, shadow, scale, grid, samples } = options;
    
    useEffect( () => {
        setStyle(getCursorStyle(color, options, selected))
    }, [r, g, b, options.width, border, shadow, selected])

    useEffect( () => {
        setX( color.t, minX, maxX ) 
    }, [grid, samples])

    const onStart = (e: DraggableEvent, data: DraggableData) => {
        preventProp(e);
        setStartX( data.x )
    }
    
    const onDrag = (e: DraggableEvent, data: DraggableData) => {
        preventProp(e)

        if ( grid && Math.abs(data.x - startX) > (width / samples) )
        {
            const x = color.t + Math.sign(data.x - startX) / samples;
            setX( x, minX, maxX )
            setStartX( data.x )
        }
        else if ( !grid )
        {
            const delta = data.deltaX;
            const t = color.t + (delta / width)
            setX( t, minX, maxX ) 
        }

        setDragging(true)
    }

    const onStop = (e: DraggableEvent) => {
        preventProp(e)
        setTimeout( () => setDragging(false), DRAGGING_TIMEOUT )
    }

    return (
        <Draggable 
            axis="none" 
            nodeRef={handleRef}
            position={null}
            onStop={onStop} 
            onDrag={onDrag}
            onStart={onStart}
        >
            <div ref={handleRef} className="dummy" style={{left: `${color.t * 100}%`, height: `${height}%`}}>
                <CursorTooltip t={color.t} scale={scale} onClick={removeColor}/>
                <div className="cursor" style={style} onClick={selectColor}></div> 
            </div>
        </Draggable>
    )
}

export default Cursor;