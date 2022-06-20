

import { FC, ReactNode, useCallback, useEffect, useState } from "react";

type Bounds = {
    min: number, max: number
}

interface IDraggable {
    x: number;
    bounds: Bounds,
    scale: number;
    grid?: number;
    onStart: (e: any, x: number) => void;
    onDrag: (e: any, x: number) => void;
    onStop: (e: any, x: number) => void;
    children: ReactNode;
}

const fitBounds = (x: number, bounds: Bounds) => 
    Math.max(bounds.min, Math.min(bounds.max, x))


const Draggable: FC<IDraggable> = ( { x, bounds, scale, grid, onStart, onDrag, onStop, children } ) => {
    
    
    const [drag, setDrag] = useState<boolean>(false);
    const [pos, setPos] = useState<number>(fitBounds(x, bounds));

    const onMouseMove = useCallback( (e: MouseEvent) => {
        if ( !drag ) return;
        // console.log(pos, e.clientX);
        setPos(fitBounds(e.clientX, bounds))
        onDrag(e, pos)
    }, [drag, setPos] )

    useEffect( () => {
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', _onStop)
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', _onStop)
        }
    }, [drag])
    
    const _onStart = (e: any) => {
        // console.log('start');
        setDrag(true)
        onStart(e, pos)
    } 

    const _onStop = (e: any) => {
        // console.log('stop');
        setDrag(false)
        onStop(e, pos)
    } 

    const eventHandlers = {
        onMouseDown: _onStart,
        onMouseUp: _onStop
    }

    return (
        <div {...eventHandlers} style={{transform: `translate(${pos}px)`, position: "absolute"}} >
            {children}
        </div>
    )
}

export default Draggable;