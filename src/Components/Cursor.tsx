import { FC, MouseEvent, useCallback, useEffect, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

import { TRGB, RGB, CursorOptions } from "../types";
import { getColorString } from "../utils";

import { DRAGGING_TIMEOUT } from "../constants";

import '../css/cursor.css'
import CursorTooltip from "./CursorTooltip";


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
    removeColor: (event: MouseEvent<SVGElement>) => void;
    selectColor: (event: MouseEvent<HTMLDivElement>) => void;
    setDragging: React.Dispatch<React.SetStateAction<boolean>>;
    options: CursorOptions;
}

const Cursor: FC<ICursor> = ( { color, selected, width, minX, maxX, setX, selectColor, removeColor, setDragging, options } ) => {

    const [style, setStyle] = useState<React.CSSProperties>();

    const { r, g, b } = color;

    const samples = 40;
    const gridSpace = width / samples

    const snapToGrid = (x: number) => {
        return samples ? Math.round(x / gridSpace) * gridSpace : x
    }

    useEffect( () => {
        setStyle(getCursorStyle(color, options, selected))
    }, [r, g, b, options, selected])

    const update = useCallback( (e: DraggableEvent, data: DraggableData) => {
        e.preventDefault()
        e.stopPropagation()
        setX(snapToGrid(data.x) / width) 
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

    const x = snapToGrid(color.t * width)

    return (
        <Draggable 
            axis="x" 
            handle=".cursor"
            position={{x: x, y: 0}}
            bounds={{left: minX, right: maxX}}
            onStop={onStop} 
            onDrag={onDrag}
            onStart={onStart}
            grid={[gridSpace, 0]}
        >
            <div className="dummy">
                <div 
                    className="cursor" 
                    style={style}
                    onClick={selectColor}
                >
                    <CursorTooltip pos={x / width} onClick={removeColor}/>
                </div>
            </div>
        </Draggable>
    )
}

export default Cursor;