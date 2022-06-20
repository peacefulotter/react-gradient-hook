

import Gradient from '../Components/Gradient';
import { IGradient } from '../types';


const useGradient = ( props: IGradient ) => {
    return <Gradient {...props} />
}

export default useGradient;