import { TRGB, CursorOptions, GradientOptions, PickerOptions } from "./types"

export const _defaultColors: TRGB[] = [ 
    { r: 255, g: 0,   b: 0, t: 0.1 },
    { r: 255, g: 255, b: 0, t: 0.51 },
    { r: 0,   g: 255, b: 0, t: .9 },
]

export const _gradientOptions: Required<GradientOptions> = {
    height: 45,
}

export const _cursorOptions: Required<CursorOptions> = {
    width: 15,
    border: 4,
    shadow: 2,
    scale: 5,
    grid: false,
    samples: 0,
}

export const _pickerOptions: Required<PickerOptions> = {
    showHue: true,
    showChrome: true,
    showCircles: true
}

export const DRAGGING_TIMEOUT = 200
