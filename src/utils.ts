import { RGB, TRGB } from "./types";

export const computeGradient = ( colors: RGB[], xs: number[] ): string => {
    let gradient: string = 'linear-gradient(90deg, ';
    for (let i = 0; i < colors.length; i++) 
    {
        const color = colors[i];
        const rgb = getColorString(color)
        gradient += rgb + ` ${xs[i] * 100}%`

        if ( i < colors.length - 1 )
            gradient += ', '
        else 
            gradient += ')'
    }    

    return gradient;
}

export const getColorString = (color: RGB) => {
    return `rgb(${color.r}, ${color.g}, ${color.b})`
}



export const interpolateColors = (c1: RGB, c2: RGB, x: number): RGB => {
    return {
        r: Math.round(c1.r * (1 - x) + c2.r * x),
        g: Math.round(c1.g * (1 - x) + c2.g * x),
        b: Math.round(c1.b * (1 - x) + c2.b * x),
    };
}

export const getRGBGradient = (colors: RGB[], xs: number[], pos: number): RGB => {
    let i1: number = 0;
    let i2: number | undefined; 
    let x: number = 0;

    for (let i = 0; i < colors.length; i++) 
    {
        const w = xs[i]
        if ( w > pos ) 
        {            
            i2 = i;
            if ( i === 0 )
                x = pos / xs[i1]
            else
                x = (pos - xs[i1]) / (xs[i2] - xs[i1]) 
            break;
        }
        i1 = i
    }

    if ( i2 === undefined )
    {
        i2 = colors.length - 1
        x = (pos - xs[i1]);
    }    
       
    return interpolateColors(colors[i1], colors[i2], x);
}
