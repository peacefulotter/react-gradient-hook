import { FC, MouseEvent, useEffect, useState } from "react";
import { FiTrash2 } from 'react-icons/fi'


interface ICursortTooltip {
    pos: number;
    onClick: (event: MouseEvent<SVGElement>) => void;
}


const CursorTooltip: FC<ICursortTooltip> = ( { pos, onClick } ) => {

    const [text, setText] = useState<any>()
    const [isHover, setIsHover] = useState<boolean>(false)

    useEffect( () => {
        setText( isHover ? <FiTrash2 onClick={onClick}/> : pos )
    }, [isHover, pos, onClick])

    return (
        <div 
            className="cursor-text"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {text}
        </div>
    )
}

export default CursorTooltip;