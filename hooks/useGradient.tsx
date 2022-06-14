import { useEffect, useRef, useState } from 'react';
import { ChromePicker } from 'react-color';

import useOutsideAlerter from './useOutsideAlerter';
import useWindowSize from './useWindowSize';

import { computeGradient, getColorStyle, getRGBGradient } from '../utils';
import { TColor } from '../types';

import '../css/gradient.css';


interface Props {
    baseColors?: TColor[];
    onChange?: (colors: TColor[]) => void;
}

const COLOR_WIDTH = 15;
const DEFAULT_COLORS: TColor[] = [ 
    {r: 255, g: 0,   b: 0, t: 0},
    {r: 255, g: 255, b: 0, t: 0.5},
    {r: 0,   g: 255, b: 0, t: 1.0},
]


const useGradient = ( { baseColors, onChange }: Props ) => {
    const windowWidth = useWindowSize()

    const gradientRef = useRef(null)
    const colorsRef = useRef([])
    const colorPickerRef = useRef(null);

    const [ gradientWidth, setGradientWidth ] = useState<number>(1);
    const [ currentColor, setCurrentColor ] = useState<number>(0) // the color we are editing
    const [ showPicker, setShowPicker ] = useState<boolean>(false)
    const [ disableAdding, setDisable ] = useState<boolean>(false)
    const [ pickerPos, setPickerPos ] = useState<number[]>([0, 0])
    const [ dragging, setDragging ] = useState<boolean>(false)
    const [ colors, setColors ] = useState<TColor[]>(baseColors || DEFAULT_COLORS) // set of colors on the gradient

    useOutsideAlerter(colorsRef, colorPickerRef, () => {
        setShowPicker(false); 
        setDragging(false);
    })


    useEffect(() => { if (onChange) onChange(colors); }, [])

    useEffect(() => {
        if ( gradientRef.current === null ) 
            return;            
        setGradientWidth((gradientRef.current as any).clientWidth)
    }, [windowWidth])

    useEffect(() => {
        colorsRef.current = colorsRef.current.slice(0, colors.length);
     }, [colors]);

    const addColor = (e: any) => {
        if ( disableAdding ) return;        
        const pos: number = e.clientX - e.target.offsetLeft + COLOR_WIDTH / 2
        const mappedPos = pos / gradientWidth;
        const rgb = getRGBGradient(colors, mappedPos)
                
        const newColor: TColor = { r: rgb[0], g: rgb[1], b: rgb[2], t: pos / gradientWidth }
        const update = [...colors, newColor].sort( (a: TColor, b: TColor) => a.t - b.t );
        
        let index = 0;
        for (let i = 0; i < update.length; i++) 
        {
            if ( newColor === update[i] )
            {
                index = i;
                break;
            }
        }
        
        setColors(update)
        setCurrentColor(index)

        if ( onChange ) onChange(update)
    }

    const selectColor = (e: any, i: number) => {           
        e.preventDefault()
        e.stopPropagation()
        
        const x = Math.min(Math.max(0, e.clientX - 112.5), window.innerWidth)
        setPickerPos([x, (gradientRef.current as any).offsetTop - 300])
        setShowPicker(true)
           
        setCurrentColor(i)
        setDragging(true);        
    }

    const dragColor = (tX: number, i: number) => {
        const copy = [...colors]
        const target = copy[i];
        target.t = tX;
        setColors(copy);
        if ( onChange ) onChange(copy)
    }

    const mouseMove = (e: any) => {
        e.preventDefault()
        e.stopPropagation()

        let pos = e.clientX - e.target.offsetLeft
        if ( dragging && pos <= gradientWidth && pos >= 0 )         
            dragColor(pos / gradientWidth, currentColor)
    }

    const stopDragging = (e: any) => {               
        e.preventDefault()
        e.stopPropagation()
        setDragging(false);
        setDisable(true)
        setTimeout(() => setDisable(false), 300)
    }

    const pickColor = (e: any) => {                
        const copy = [...colors];
        const { t } = copy[currentColor]
        const { r, g, b } = e.rgb
        copy[currentColor] = { r, g, b, t }
        setColors(copy);
        if ( onChange ) onChange(copy)
    }

    const removeColor = (i: number) => {
        if ( colors.length === 2 ) return;
        const filtered = colors.filter((c: TColor, j: number) => i !== j )
        setCurrentColor(Math.max(currentColor - 1, 0))
        setColors(filtered);
        if ( onChange ) onChange(filtered)
    }

    return (
        <div className="gradient-handler" ref={gradientRef}>
            <div className="gradient-wrapper" style={{background: computeGradient(colors, gradientWidth)}} onClick={addColor} onMouseMove={mouseMove}>
                { colors.map( (c: TColor, i: number) => {
                    return <div 
                        tabIndex={1}
                        ref={el => (colorsRef as any).current[i] = el}
                        className='gradient-color' 
                        style={getColorStyle(c, gradientWidth, COLOR_WIDTH)} 
                        onMouseDown={(e) => selectColor(e, i)} 
                        onMouseUp={stopDragging} 
                        key={`gradient-${i}`}>
                        </div>
                })}
            </div>
            <div className="colorpicker-wrapper">
                <div ref={colorPickerRef} style={{position: 'absolute', left: `${pickerPos[0]}px`, top: `${pickerPos[1]}px`, display: `${showPicker ? 'block' : 'none'}`}}>
                    <div className="color-details"> 
                        <div className="color-rgb">
                            <div className="color-rgb-value">{colors[currentColor].r}</div>
                            <div className="color-rgb-name">R</div>
                        </div>
                        <div className="color-rgb">
                            <div className="color-rgb-value">{colors[currentColor].g}</div>
                            <div className="color-rgb-name">G</div>
                        </div>
                        <div className="color-rgb">
                            <div className="color-rgb-value">{colors[currentColor].b}</div>
                            <div className="color-rgb-name">B</div>
                        </div>
                        <div className="color-remove" onClick={() => removeColor(currentColor)}>X</div>
                    </div>
                    <ChromePicker 
                        color={ {
                            r: colors[currentColor].r,
                            g: colors[currentColor].g,
                            b: colors[currentColor].b,
                            a: 1
                        }} 
                        onChange={(e: any) => pickColor(e)} />
                </div>
            </div>
        </div>
    );
}

export default useGradient;