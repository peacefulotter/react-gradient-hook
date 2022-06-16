
import { TRGB } from '../types';

import Gradient from '../Components/Gradient';


interface Props {
    defaultColors?: TRGB[];
    onChange?: (colors: TRGB[]) => void;
}

const useGradient = ( { defaultColors, onChange }: Props ) => {

    return <Gradient defaultColors={defaultColors} />
}

export default useGradient;