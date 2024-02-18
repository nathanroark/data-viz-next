import { useState, useRef, useEffect } from "react"
import type { Dimensions, BoundedDimensions } from "../types"

export const combineChartDimensions = (dimensions: Dimensions): BoundedDimensions => {
    const parsedDimensions = {
        marginTop: 90,
        marginRight: 90,
        marginBottom: 50,
        marginLeft: 60,
        ...dimensions,
    }

    return {
        ...parsedDimensions,
        boundedHeight: Math.max(parsedDimensions.height! 
            - parsedDimensions.marginTop - parsedDimensions.marginBottom, 0),
        boundedWidth: Math.max(parsedDimensions.width! 
            - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0),
    }
}

export const useChartDimensions = (passedSettings: Dimensions)
    : [React.RefObject<HTMLDivElement>, BoundedDimensions] => {
    const ref = useRef<HTMLDivElement>(null);
    const dimensions = combineChartDimensions(passedSettings);

    const [width, changeWidth] = useState(0);
    const [height, changeHeight] = useState(0);
    // const MAX_HEIGHT = 700;

    useEffect(() => {
        if (dimensions.width && dimensions.height) return ;

        const element = ref.current;

        function handleResize() {
            if (!element) return;
//   window.innerHeight * 0.75,
            // changeWidth(window.innerWidth * 0.75);
            changeHeight(window.innerHeight * 0.75);
            changeWidth(element.offsetWidth);
            // changeHeight(element.offsetHeight > MAX_HEIGHT ? MAX_HEIGHT : element.offsetHeight);
        }

        handleResize();

        window.addEventListener("resize", handleResize);

        return () =>  window.removeEventListener("resize", handleResize)
    
    }, [passedSettings, dimensions]);

    const newDimensions: BoundedDimensions = combineChartDimensions({
        ...dimensions,
        width: dimensions.width ?? width,
        height: dimensions.height ?? height,
    });

    return [ref, newDimensions];
};

// let lastId = 0
// export const useUniqueId = (prefix = "") => {
//     lastId++
//     return [prefix, lastId].join("-")
// }
