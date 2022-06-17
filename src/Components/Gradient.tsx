import { useState, MouseEvent, FC, useCallback, useEffect } from "react";

import Cursor from "./Cursor";
import useRefSize from "../hooks/useRefSize";
import { CursorOptions, GradientOptions, TRGB } from "../types";
import { computeGradient, getColorOnGradient, sortColors } from "../utils";
import { _defaultColors, _gradientOptions, _cursorOptions } from "../constants";

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
    // used to set the `selected` state to the last color that has been added 
    const [added, setAdded] = useState<number | undefined>()

    const cursorWidth = cursorOptions.width + cursorOptions.border * 2
    const offset = cursorWidth / 2

    useEffect( () => {
        if ( added ) 
        {
            setAdded(undefined)
            setSelected( added )
        }
    }, [colors])

    const addColor = useCallback( ({clientX, target}: MouseEvent<HTMLDivElement>) => {
        if ( dragging ) return;
        const pos = (clientX - (target as any).offsetLeft) / width
        const rgb = getColorOnGradient(colors, pos)
        const trgb = { ...rgb, t: pos }
        const update = sortColors([...colors, trgb])
        setColors( update )
        setAdded( update.findIndex( (c: TRGB) => c === trgb) )
        // if ( onChange ) onChange(update)
    }, [colors, setColors, width, dragging] )

    const selectColor = useCallback( (i: number) => (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setSelected(i)
    }, [dragging, setDragging] )

    const removeColor = useCallback( (i: number) => (e: MouseEvent<SVGElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if ( colors.length === 1 ) return;
        setColors( prev => {
            const temp = [...prev]
            temp.splice(i, 1); 
            return temp;
        } );
        setSelected( Math.max(0, selected - 1) )
    }, [colors, setColors] )

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
                    const minX = i === 0 ? 0 : colors[i - 1].t * width + cursorWidth
                    const maxX = ((i + 1) >= colors.length ? 1 : colors[i + 1].t - (cursorWidth * 2 / 2) / width) * width
                    return <Cursor 
                        key={`cursor-${i}`} 
                        color={c} 
                        selected={i === selected}                        
                        width={width}
                        minX={minX}
                        maxX={maxX}
                        setX={setX(i)}
                        selectColor={selectColor(i)}
                        removeColor={removeColor(i)}
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
    defaultColors: _defaultColors,
    gradientOptions: _gradientOptions,
    cursorOptions: _cursorOptions
}

export default Gradient;