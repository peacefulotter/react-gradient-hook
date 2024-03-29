import { useState, MouseEvent, FC, useCallback, useEffect } from "react";
import { ColorResult } from "react-color";

import Cursor from "./Cursor";
import Picker from "./Picker";
import useRefSize from "../hooks/useRefSize";
import useOptions from "../hooks/useOptions";

import { GradientOptions, GradientProps, TRGB } from "../types";
import { computeGradient, getColorOnGradient, sortColors } from "../utils";
import { _defaultColors, _gradientOptions, _cursorOptions, _pickerOptions } from "../constants";

import '../css/gradient.css'

const gradientStyle = (colors: TRGB[], options: GradientOptions) => ( {
    background: computeGradient(colors), 
    height: options.height + 'px'
} )

interface IGradient extends GradientProps {
    onChange?: (colors: TRGB[]) => void;
}

const Gradient: FC<IGradient> = ( { defaultColors, gradientOptions, cursorOptions, pickerOptions, onChange } ) => {

    const { ref, width } = useRefSize()
    const [colors, setColors] = useState<TRGB[]>(sortColors(defaultColors))
    const [selected, setSelected] = useState<number>(0)
    // used to prevent the onClick event getting triggered while a cursor is dragged
    const [dragging, setDragging] = useState<boolean>(false)
    // used to set the `selected` state to the last color that has been added 
    const [added, setAdded] = useState<number | undefined>()

    // resolve undefined option keys with default values
    const gradOpts = useOptions(gradientOptions, _gradientOptions)
    const cursOpts = useOptions(cursorOptions, _cursorOptions)
    const pickOpts = useOptions(pickerOptions, _pickerOptions)

    const cursorWidth = cursOpts.width + cursOpts.border * 2
    const offset = cursorWidth / 2

    useEffect( () => {
        if ( onChange ) onChange(colors)
        if ( added ) 
        {
            setAdded(undefined)
            setSelected( added )
        }
    }, [colors]) 

    const snapToGrid = (t: number) => {
        const { grid, samples } = cursOpts;
        return grid ? Math.round(t * samples) / samples : t
    }

    // FIXME: shouldnt be able to add a color if grid=true and two cursors are surrounding the new pos
    const addColor = useCallback( ({clientX, target}: MouseEvent<HTMLDivElement>) => {
        if ( dragging ) return;
        const pos = (clientX - (target as any).offsetLeft) / width
        const rgb = getColorOnGradient(colors, pos)
        const trgb = { ...rgb, t: snapToGrid(pos) }
        const update = sortColors([...colors, trgb])
        setColors( update )
        setAdded( update.findIndex( (c: TRGB) => c === trgb) )
    }, [colors, setColors, width, dragging] )

    const selectColor = useCallback( (i: number) => (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setSelected(i)
    }, [dragging, setDragging] )

    const removeColor = useCallback( (i: number) => (e: MouseEvent<HTMLDivElement>) => {
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

    const setX = useCallback( (i: number) => (t: number, min: number, max: number) => {
        // bound the translation to [min, max]
        // snap translation to grid if grid is set to true
        const mappedT = Math.min( max, Math.max( min, snapToGrid(t) ) )
        setColors( prev => {
            const temp = [...prev]
            temp[i].t = mappedT
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
            <div className="gradient" ref={ref} style={gradientStyle(colors, gradOpts)} onClick={addColor}>
                { width > 0 && colors.map( (c: TRGB, i: number) => {
                    const minX = i === 0 ? 0 : colors[i - 1].t  + cursorWidth / width
                    const maxX = ((i + 1) >= colors.length ? 1 : colors[i + 1].t - (cursorWidth / width))
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
                        options={cursOpts}
                    />
                } ) }
            </div>
            <Picker color={colors[selected]} pickColor={pickColor(selected)} options={pickOpts} />
        </div>
    )
}

Gradient.defaultProps = {
    defaultColors: _defaultColors,
    gradientOptions: _gradientOptions,
    cursorOptions: _cursorOptions,
    pickerOptions: _pickerOptions,
}

export default Gradient;