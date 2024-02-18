function Gradient({
  id = "Gradient",
  colors = [],
  ...props
}: {
  id: string;
  colors: string[];
} & React.SVGProps<SVGLinearGradientElement>) {
  return (
    <linearGradient
      id={id}
      gradientUnits="userSpaceOnUse"
      spreadMethod="pad"
      {...props}
    >
      {colors.map((color, i) => (
        <stop
          key={i}
          offset={`${(i * 100) / (colors.length - 1)}%`}
          stopColor={color}
        />
      ))}
    </linearGradient>
  );
}

export default Gradient;

/* Examople usage:


let lastId = 0
export const useUniqueId = (prefix = "") => {
    lastId++
    return [prefix, lastId].join("-")
}

return (
  <defs>
    <Gradient
      id={useUniqueId("Timeline-gradient")}
      colors={"#9980FA", "rgb(226, 222, 243)"]}
      x2="0"
      y2="100%"
    />
  </defs>
)


*/
