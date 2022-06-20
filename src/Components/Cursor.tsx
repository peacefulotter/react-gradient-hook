import { FC, MouseEvent, useCallback, useEffect, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

import CursorTooltip from "./CursorTooltip";

import { TRGB, RGB, CursorOptions } from "../types";
import { DRAGGING_TIMEOUT } from "../constants";
import { getColorString } from "../utils";

import '../css/cursor.css'


const getCursorStyle = (color: RGB, { width, border, shadow }: CursorOptions, selected: boolean): React.CSSProperties => ( {    
    background: getColorString(color),
    width: width + 'px',
    borderWidth: border + 'px',
    boxShadow: `0 0 0 ${shadow}px black ${selected ? ', 0px 0px 1px 3px rgba(0, 0, 0, 0.3)': ''}`,
    transform: `translate(-${(width / 2 + border)}px, -${border}px)`,
} )

interface ICursor {
    color: TRGB;
    selected: boolean;
    width: number;
    minX: number;
    maxX: number;
    setX: (t: number) => void;
    removeColor: (event: MouseEvent<HTMLDivElement>) => void;
    selectColor: (event: MouseEvent<HTMLDivElement>) => void;
    setDragging: React.Dispatch<React.SetStateAction<boolean>>;
    options: Required<CursorOptions>;
}

const Cursor: FC<ICursor> = ( { color, selected, width, minX, maxX, setX, selectColor, removeColor, setDragging, options } ) => {

    const [style, setStyle] = useState<React.CSSProperties>();

    const { r, g, b } = color;
    const { border, shadow, scale, grid, samples } = options;

    const gridSpace = width / samples

    const snapToGrid = (x: number) => {
        if ( grid && samples )
        {
            const gridX = Math.round(x / gridSpace) * gridSpace;
            return gridX > minX && gridX < maxX ? gridX : x
        }
        return x
    }

    useEffect( () => {
        setStyle(getCursorStyle(color, options, selected))
    }, [r, g, b, options.width, border, shadow, selected])

    const preventProp = (e: DraggableEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onStart = preventProp
    
    const onDrag = useCallback( (e: DraggableEvent, data: DraggableData) => {
        preventProp(e)
        setX(snapToGrid(data.x) / width) 
        setDragging(true)
    }, [] )

    const onStop = (e: DraggableEvent, data: DraggableData) => {
        preventProp(e)
        setTimeout( () => setDragging(false), DRAGGING_TIMEOUT )
    }

    const snappedX = snapToGrid(color.t * width)

    return (
        <Draggable 
            axis="x" 
            handle=".cursor"
            position={{x: snappedX, y: 0}}
            bounds={{left: minX, right: maxX}}
            onStop={onStop} 
            onDrag={onDrag}
            onStart={onStart}
            grid={grid ? [gridSpace, 0] : undefined}
        >
            <div className="dummy" style={{width: 'fit-content'}}>
                <CursorTooltip pos={snappedX / width} scale={scale} onClick={removeColor}/>
                <div className="cursor" style={style} onClick={selectColor}></div> 
            </div>
        </Draggable>
    )
}

export default Cursor;