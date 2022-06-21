import { TRGB, CursorOptions, GradientOptions, PickerOptions } from "./types"

export const _defaultColors: TRGB[] = [ 
    { r: 255, g: 0,   b: 0,   t: 0 },
    { r: 150, g: 0,   b: 200, t: 0.2 },
    { r: 70, g: 100, b: 255, t: 0.5 },
    { r: 40, g: 255, b: 80, t: 1 },
]

export const _gradientOptions: Required<GradientOptions> = {
    height: 45,
}

export const _cursorOptions: Required<CursorOptions> = {
    width: 15,
    height: 110,
    border: 4,
    shadow: 2,
    scale: 1,
    grid: false,
    samples: 20,
}

export const _pickerOptions: Required<PickerOptions> = {
    showHue: true,
    showChrome: true,
    showCircles: true
}

export const DRAGGING_TIMEOUT = 200
