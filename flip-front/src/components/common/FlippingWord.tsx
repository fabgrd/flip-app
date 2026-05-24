import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, TextStyle } from 'react-native';

type Props = {
  text: string;
  style?: StyleProp<TextStyle>;
  intervalMs?: number;
  flipMs?: number;
};

export function FlippingWord({ text, style, intervalMs = 3000, flipMs = 700 }: Props) {
  const flipState = useRef(0);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const id = setInterval(() => {
      const next = flipState.current === 0 ? 1 : 0;
      flipState.current = next;
      Animated.timing(anim, {
        toValue: next,
        duration: flipMs,
        easing: Easing.inOut(Easing.back(1.4)),
        useNativeDriver: true,
      }).start();
    }, intervalMs);
    return () => clearInterval(id);
  }, [anim, intervalMs, flipMs]);

  const scaleY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, -1],
  });

  return (
    <Animated.Text style={[style, { transform: [{ perspective: 600 }, { scaleY }] }]}>
      {text}
    </Animated.Text>
  );
}
