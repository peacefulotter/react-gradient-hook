import { useState, MouseEvent, FC } from "react";

import useRefSize from "../hooks/useRefSize";
import { RGB, TRGB } from "../types";
import { computeGradient, getRGBGradient } from "../utils";
import Cursor from "./Cursor";

import '../css/gradient.css'

const DEFAULT_COLORS: RGB[] = [ 
    { r: 255, g: 0,   b: 0 },
    { r: 255, g: 255, b: 0 },
    { r: 0,   g: 255, b: 0 },
]

const DEFAULT_XS: number[] = [0, 0.5, 1]


interface IGradient {
    baseColors?: TRGB[]
}

const Gradient: FC<IGradient> = ( { baseColors } ) => {

    const [colors, setColors] = useState<RGB[]>(baseColors || DEFAULT_COLORS)
    const [xs, setXs] = useState<number[]>(baseColors ? baseColors.map(c => c.t) : DEFAULT_XS)
    
    const { ref, width } = useRefSize()

    const addColor = (e: MouseEvent<HTMLDivElement>) => {
        console.log(e.target);
        const pos: number = e.clientX  / width // - e.target.offsetLeft // + COLOR_WIDTH / 2
        const rgb = getRGBGradient(colors, xs, pos)
        const update = [...colors, rgb] // .sort( (a: RGB, b: RGB) => a.t - b.t );
        setColors(update)
        // if ( onChange ) onChange(update)
    }

    const setShowPicker = (i: number) => (e: MouseEvent<HTMLDivElement>) => {
        // console.log(i);
        // e.preventDefault()
        // e.stopPropagation()
    }

    const setX = (i: number) => (t: number) => {
        console.log(i, t);
        const copy = [...xs]
        copy[i] = t
        setXs(copy)
    }

    console.log(xs);
    

    // onClick={addColor}

    return (
        <div className="gradient-wrapper" ref={ref} style={{background: computeGradient(colors, xs)}} >
            { colors.map( (c: TRGB, i: number) => {
                return <Cursor 
                    key={`cursor-${i}`} 
                    color={c} 
                    x={xs[i]}
                    width={width}
                    setX={setX(i)}
                    setShowPicker={setShowPicker(i)}
                />
            } ) }
            {/* { false ? <Picker /> : null } */}
        </div>
    )
}

export default Gradient;