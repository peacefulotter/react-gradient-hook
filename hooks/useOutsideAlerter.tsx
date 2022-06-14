
import { useEffect } from 'react'


const useOutsideAlerter = (ref1: any, ref2: any, callback: () => void) => {
    useEffect( () => {
        
        const handleClickOutside = (event: any) => {
            ref1.current.forEach( (r: any) => {                                
                if (
                    r && !r.contains(event.target) && 
                    ref2.current && !ref2.current.contains(event.target)
                ) {
                    callback()
                }
            } )
            
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref1, ref2, callback] );
}

export default useOutsideAlerter