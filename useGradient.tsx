import { useEffect, useRef, useState } from 'react';
import { ChromePicker } from 'react-color';

import useOutsideAlerter from './useOutsideAlerter';
import useWindowSize from './useWindowSize';

import './gradient.css';


interface Props {
    baseColors: Color[];
    onChange: (colors: Color[]) => void;
}

export type Color = {
    r: number;
    g: number;
    b: number;
    translate: number;
}

const COLOR_WIDTH = 15;

const computeGradient = ( colors: Color[], gradientWidth: number ): string => {
    let gradient: string = 'linear-gradient(90deg, ';
    for (let i = 0; i < colors.length; i++) 
    {
        const color = colors[i];
        let rgb = getColor(color)
        gradient += rgb + ` ${color.translate * 100}%`

        if ( i < colors.length - 1 )
            gradient += ', '
        else 
            gradient += ')'
    }    

    return gradient;
}

const getColor = (color: Color) => {
    return `rgb(${color.r}, ${color.g}, ${color.b})`
}

const getColorStyle = (color: Color, gradientWidth: number): object => {    
    return {
        width: `${COLOR_WIDTH}px`,
        background: getColor(color),
        transform: `translateX(${color.translate * gradientWidth - COLOR_WIDTH / 2}px)`
    }
}

const interpolateColors = (c1: Color, c2: Color, w: number): number[] => {
    var diffW = 1 - w;
    var rgb = [
        Math.round(c1.r * diffW + c2.r * w),
        Math.round(c1.g * diffW + c2.g * w),
        Math.round(c1.b * diffW + c2.b * w)
    ];
    return rgb;
}

const getRGBGradient = (colors: Color[], pos: number): number[] => {
    let c1: Color = colors[0];
    let c2: Color | undefined = undefined; 
    let x: number = 0;

    for (let i = 0; i < colors.length; i++) 
    {
        const w = colors[i].translate
        if ( w > pos ) 
        {            
            c2 = colors[i];
            if ( i === 0 )
                x = pos / c1.translate
            else
                x = (pos - c1.translate) / (c2.translate - c1.translate) 
            break;
        }
        c1 = colors[i]
    }

    if ( c2 === undefined )
    {
        c2 = colors[colors.length - 1]
        x = (pos - c1.translate);
    }    
       
    return interpolateColors(c1, c2, x);
}

const useGradient = ( props: Props ) => {
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
    const [ colors, setColors ] = useState<Color[]>(props.baseColors) // set of colors on the gradient

    useOutsideAlerter(colorsRef, colorPickerRef, () => {
        setShowPicker(false); 
        setDragging(false);
    })

    const triggerChange = props.onChange;

    useEffect(() => { triggerChange(colors); }, [])

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
                
        const newColor: Color = { r: rgb[0], g: rgb[1], b: rgb[2], translate: pos / gradientWidth }
        const update = [...colors, newColor].sort( (a: Color, b: Color) => a.translate - b.translate );
        
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

        triggerChange(colors)
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
        target.translate = tX;
        setColors(copy);
        triggerChange(colors)
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
        const target = copy[currentColor]
        const rgb = e.rgb
        target.r = rgb.r; 
        target.g = rgb.g
        target.b = rgb.b;
        setColors(copy);
        triggerChange(colors)
    }

    const removeColor = (i: number) => {
        if ( colors.length === 2 ) return;
        const filtered = colors.filter((c: Color, j: number) => i !== j )
        setCurrentColor(Math.max(currentColor - 1, 0))
        setColors(filtered);
        triggerChange(filtered)
    }

    return (
        <div className="gradient-handler" ref={gradientRef}>
            <div className="gradient-wrapper" style={{background: computeGradient(colors, gradientWidth)}} onClick={addColor} onMouseMove={mouseMove}>
                { colors.map( (c: Color, i: number) => {
                    return <div 
                        tabIndex={1}
                        ref={el => (colorsRef as any).current[i] = el}
                        className='gradient-color' 
                        style={getColorStyle(c, gradientWidth)} 
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