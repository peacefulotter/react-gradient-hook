import { useState, MouseEvent, FC, useCallback } from "react";

import Cursor from "./Cursor";
import useRefSize from "../hooks/useRefSize";
import { CursorOptions, GradientOptions, TRGB } from "../types";
import { computeGradient, getRGBGradient } from "../utils";
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
    const [colors, setColors] = useState<TRGB[]>(defaultColors)
    const [selected, setSelected] = useState<number>()

    const cursorWidth = cursorOptions.width + cursorOptions.border  + cursorOptions.shadow
    const offset = (cursorWidth) / 2
    const rightX = width - left - offset * 3 / 2
    const boundX = rightX - offset

    const addColor = useCallback( ({clientX, target}: MouseEvent<HTMLDivElement>) => {
        // rgb on the gradient (color)
        const pos = (clientX - (target as any).offsetLeft) / width
        const rgb = getRGBGradient(colors, pos)
        // color translation, minus the offset added by react-draggable
        const dragOffset = (colors.length * cursorWidth) / width
        const dragRgb = { ...rgb, t: pos - dragOffset }
        const update = [...colors, dragRgb].sort();
        setColors(update)
        // if ( onChange ) onChange(update)
    }, [colors, setColors, width] )

    const onClick = useCallback( (i: number) => (e: MouseEvent<HTMLDivElement>) => {
        setSelected(i)
        e.preventDefault()
        e.stopPropagation()
    }, [] )

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
                    console.log((i + 1) >= colors.length);
                    return <Cursor 
                        key={`cursor-${i}`} 
                        color={c} 
                        left={offset}
                        right={width}
                        minX={i == 0 ? 0 : colors[i - 1].t}
                        maxX={(i + 1) >= colors.length ? 1 : colors[i + 1].t}
                        setX={setX(i)}
                        onClick={onClick(i)}
                        options={cursorOptions}
                    />
                } ) }
            </div>
            { selected ? <Picker color={colors[selected]} pickColor={pickColor(selected)} /> : null }
        </div>
    )
}

Gradient.defaultProps = {
    defaultColors,
    gradientOptions,
    cursorOptions
}

export default Gradient;