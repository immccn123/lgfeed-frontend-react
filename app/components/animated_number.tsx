import { animated, useSpring } from "@react-spring/web";

interface AnimatedNumberProps {
  value: number;
}

export default function AnimatedNumber({ value }: AnimatedNumberProps) {
  const props = useSpring({
    number: value,
    from: { number: 0 },
  });

  return (
    <animated.span>{props.number.to((val) => Math.floor(val))}</animated.span>
  );
}
