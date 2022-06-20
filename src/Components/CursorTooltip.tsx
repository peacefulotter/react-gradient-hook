import { FC, MouseEvent, useEffect, useState } from "react";
import { FiTrash2 } from 'react-icons/fi'


interface ICursortTooltip {
    pos: number;
    scale: number;
    onClick: (event: MouseEvent<HTMLDivElement>) => void;
}

const accuracy = 1000;

const CursorTooltip: FC<ICursortTooltip> = ( { pos, scale, onClick } ) => {

    const [text, setText] = useState<any>()
    const [isHover, setIsHover] = useState<boolean>(false)

    const getText = () => Math.round(pos * scale * accuracy) / accuracy

    useEffect( () => {
        setText( isHover ? <FiTrash2 /> : getText() )
    }, [isHover, pos, onClick])

    return (
        <div 
            className="cursor-text"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={onClick}
        >
            {text}
        </div>
    )
}

export default CursorTooltip;