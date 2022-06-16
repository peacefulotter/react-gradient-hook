import { RGB, TRGB } from "./types";

const gradColor = (color: TRGB) => getColorString(color) + ` ${color.t * 100}%`

export const computeGradient = ( colors: TRGB[] ): string => {
    return [...colors]
        .sort( (a: TRGB, b: TRGB) => a.t - b.t )
        .reduce( (acc, cur, i) =>  
            acc + gradColor(cur) + (i === colors.length - 1 ? '' : ','), 
            'linear-gradient(90deg, '
        ) + ')'
}

export const getColorString = (color: RGB) => {
    return `rgb(${color.r}, ${color.g}, ${color.b})`
}

export const interpolateColors = (colors: TRGB[], i: number, x: number): TRGB => {
    if ( i === 0 ) return { ...colors[0], t: x }
    if ( i === colors.length ) return { ...colors[i - 1], t: x }
    const c1 = colors[i - 1]
    const c2 = colors[i]
    return {
        r: Math.round(c1.r * (1 - x) + c2.r * x),
        g: Math.round(c1.g * (1 - x) + c2.g * x),
        b: Math.round(c1.b * (1 - x) + c2.b * x),
        t: x
    };
}

export const getRGBGradient = (colors: TRGB[], pos: number): TRGB => {
    let i: number = 0;
    while ( colors[i].t < pos && ++i < colors.length ) {}
    return interpolateColors(colors, i, pos);
}
