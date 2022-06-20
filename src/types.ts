
export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface TRGB extends RGB {
    t: number;
}

export interface GradientProps {
    defaultColors?: TRGB[]
    gradientOptions?: GradientOptions;
    cursorOptions?: CursorOptions;
    pickerOptions?: PickerOptions;
}

export interface CursorOptions {
    width?: number;
    border?: number;
    shadow?: number;
    scale?: number;
    grid?: boolean;
    samples?: number;
}

export interface GradientOptions {
    height?: number;
}

export interface PickerOptions {
    showHue?: boolean;
    showChrome?: boolean;
    showCircles?: boolean;
}