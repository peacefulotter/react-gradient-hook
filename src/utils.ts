import { TColor } from "./types";

export const computeGradient = ( colors: TColor[], gradientWidth: number ): string => {
    let gradient: string = 'linear-gradient(90deg, ';
    for (let i = 0; i < colors.length; i++) 
    {
        const color = colors[i];
        let rgb = getColor(color)
        gradient += rgb + ` ${color.t * 100}%`

        if ( i < colors.length - 1 )
            gradient += ', '
        else 
            gradient += ')'
    }    

    return gradient;
}

export const getColor = (color: TColor) => {
    return `rgb(${color.r}, ${color.g}, ${color.b})`
}

export const getColorStyle = (color: TColor, gradientWidth: number, width: number): object => {    
    return {
        width: `${width}px`,
        background: getColor(color),
        transform: `translateX(${color.t * gradientWidth - width / 2}px)`
    }
}

export const interpolateColors = (c1: TColor, c2: TColor, w: number): number[] => {
    var diffW = 1 - w;
    var rgb = [
        Math.round(c1.r * diffW + c2.r * w),
        Math.round(c1.g * diffW + c2.g * w),
        Math.round(c1.b * diffW + c2.b * w)
    ];
    return rgb;
}

export const getRGBGradient = (colors: TColor[], pos: number): number[] => {
    let c1: TColor = colors[0];
    let c2: TColor | undefined = undefined; 
    let x: number = 0;

    for (let i = 0; i < colors.length; i++) 
    {
        const w = colors[i].t
        if ( w > pos ) 
        {            
            c2 = colors[i];
            if ( i === 0 )
                x = pos / c1.t
            else
                x = (pos - c1.t) / (c2.t - c1.t) 
            break;
        }
        c1 = colors[i]
    }

    if ( c2 === undefined )
    {
        c2 = colors[colors.length - 1]
        x = (pos - c1.t);
    }    
       
    return interpolateColors(c1, c2, x);
}
