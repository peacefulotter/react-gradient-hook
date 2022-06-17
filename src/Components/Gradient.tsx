import { useState, MouseEvent, FC, useCallback } from "react";

import Cursor from "./Cursor";
import useRefSize from "../hooks/useRefSize";
import { CursorOptions, GradientOptions, TRGB } from "../types";
import { computeGradient, getRGBGradient, sortColors } from "../utils";
import { defaultColors, gradientOptions, cursorOptions } from "../constants";

import '../css/gradient.css'
import Picker from "./Picker";
import { ColorResult } from "react-color";

const gradientStyle = (colors: TRGB[], options: GradientOptions) => ( {
    background: computeGradient(colors), 
    height: options.height + 'px'
} )


interface IGradient {
    defaultColors?: TRGB[]
    gradientOptions?: GradientOptions;
    cursorOptions?: CursorOptions;
}

const Gradient: FC<IGradient> = ( { defaultColors, gradientOptions, cursorOptions } ) => {

    const { ref, width, left } = useRefSize()
    const [colors, setColors] = useState<TRGB[]>(sortColors(defaultColors))
    const [selected, setSelected] = useState<number>(0)
    // used to prevent the onClick event getting triggered while a cursor is dragged
    const [dragging, setDragging] = useState<boolean>(false)

    const cursorWidth = cursorOptions.width + cursorOptions.border * 2
    const offset = cursorWidth / 2

    const addColor = useCallback( ({clientX, target}: MouseEvent<HTMLDivElement>) => {
        if ( dragging ) return;
        const pos = (clientX - (target as any).offsetLeft) / width
        const rgb = getRGBGradient(colors, pos)
        const trgb = { ...rgb, t: pos }
        setColors( prev => sortColors([...prev, trgb]) )
        // if ( onChange ) onChange(update)
    }, [colors, setColors, width, dragging] )

    const onClick = useCallback( (i: number) => (e: MouseEvent<HTMLDivElement>) => {
        console.log(i, dragging);
        
        if ( dragging ) return;
        e.preventDefault()
        e.stopPropagation()
        setSelected(i)
    }, [dragging, setDragging] )

    const setX = useCallback( (i: number) => (t: number) => {
        setColors( prev => {
            const temp = [...prev]
            temp[i].t = t
            return temp
        } );
    }, [colors, setColors] )
    

    const pickColor = useCallback( (i: number) => ({ rgb }: ColorResult) => {
        setColors( prev => {
            const temp = [...prev]
            temp[i].r = rgb.r
            temp[i].g = rgb.g
            temp[i].b = rgb.b
            return temp
        } );
    }, [colors, setColors])

    return (
        <div className="gradient-wrapper" style={{padding: `0px ${offset}px`}}>
            <div className="gradient" ref={ref} style={gradientStyle(colors, gradientOptions)} onClick={addColor}>
                { width > 0 && colors.map( (c: TRGB, i: number) => {
                    const minX = i == 0 ? 0 : colors[i - 1].t * width + cursorWidth
                    const maxX = ((i + 1) >= colors.length ? 1 : colors[i + 1].t - (cursorWidth * 2 / 2) / width) * width
                    return <Cursor 
                        key={`cursor-${i}`} 
                        color={c} 
                        selected={i === selected}                        
                        width={width}
                        minX={minX}
                        maxX={maxX}
                        setX={setX(i)}
                        onClick={t => onClick(i)(t)}
                        setDragging={setDragging}
                        options={cursorOptions}
                    />
                } ) }
            </div>
            { selected !== undefined && <Picker color={colors[selected]} pickColor={pickColor(selected)} />  }
        </div>
    )
}

Gradient.defaultProps = {
    defaultColors,
    gradientOptions,
    cursorOptions
}

export default Gradient;