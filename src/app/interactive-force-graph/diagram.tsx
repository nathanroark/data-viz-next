import { useChartDimensions } from "./utils/useChartDimensions";
// import useHasMounted from './utils/useHasMounted';

export default function Diagram() {
  const [ref, dimensions] = useChartDimensions({ height: 500 });
  return (
    <div className="content" ref={ref}>
      <svg
        id="diagram"
        width={dimensions.width}
        height={dimensions.height}
      ></svg>
    </div>
  );
}
