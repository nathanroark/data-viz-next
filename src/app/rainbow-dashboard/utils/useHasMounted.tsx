/**
 * Custom hook to check if the component has mounted
 * @returns {boolean} hasMounted
 * 
 * usefull for D3 and other libraries that need to be rendered on the client
 */

import { useEffect, useState } from "react"

const useHasMounted = () => {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    return hasMounted
}

export default useHasMounted
