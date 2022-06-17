import { TRGB, GradientOptions, CursorOptions } from "./types"

export const defaultColors: TRGB[] = [ 
    { r: 255, g: 0,   b: 0, t: 0.2 },
    { r: 255, g: 255, b: 0, t: 0.5 },
    { r: 0,   g: 255, b: 0, t: .08 },
]

export const gradientOptions: GradientOptions = {
    height: 45,
}

export const cursorOptions: CursorOptions = {
    width: 15,
    border: 4,
    shadow: 2,
}
