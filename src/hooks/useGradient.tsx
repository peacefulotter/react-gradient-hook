
import { TRGB } from '../types';

import Gradient from '../Components/Gradient';


interface Props {
    baseColors?: TRGB[];
    onChange?: (colors: TRGB[]) => void;
}

const useGradient = ( { baseColors, onChange }: Props ) => {

    return <Gradient baseColors={baseColors} />
}

export default useGradient;