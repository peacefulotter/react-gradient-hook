
export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface TRGB extends RGB {
    t: number;
}

export interface CursorOptions {
    width?: number;
    border?: number;
    shadow?: number;
}

export interface GradientOptions {
    height: number;
}