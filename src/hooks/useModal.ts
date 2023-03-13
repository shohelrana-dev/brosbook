import { useState } from 'react'

export default function useModal(){
    const [isVisible, setVisible] = useState<boolean>( false )

    function toggle(){
        setVisible( ! isVisible )
    }

    return { toggle, isVisible }
}