import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { fadeInUp, fadeInDown, fadeInLeft, fadeInRight, scaleIn } from '../utils/animations';

// Map animation types to keyframes
const animationMap = {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
};

// Styled component with dynamic animation
const AnimatedBox = styled(Box, {
  shouldForwardProp: (prop) => 
    !['isVisible', 'animation', 'delay', 'duration'].includes(prop),
})(({ theme, isVisible, animation, delay = 0, duration = 0.6 }) => ({
  opacity: 0,
  animation: isVisible 
    ? `${animationMap[animation]} ${duration}s ${delay}s forwards ease-out` 
    : 'none',
  animationFillMode: 'both',
}));

/**
 * AnimatedSection - A component that animates when scrolled into view
 * 
 * @param {Object} props - Component props
 * @param {string} props.animation - Animation type (fadeInUp, fadeInDown, fadeInLeft, fadeInRight, scaleIn)
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.duration - Animation duration in seconds
 * @param {number} props.threshold - Intersection observer threshold (0-1)
 * @param {string} props.rootMargin - Intersection observer root margin
 * @param {React.ReactNode} props.children - Child components
 * @param {Object} props.sx - Additional MUI sx props
 */
const AnimatedSection = ({ 
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  rootMargin = '0px',
  children,
  sx = {},
  ...props
}) => {
  const { ref, isVisible } = useScrollAnimation({ threshold, rootMargin });

  return (
    <AnimatedBox
      ref={ref}
      isVisible={isVisible}
      animation={animation}
      delay={delay}
      duration={duration}
      sx={sx}
      {...props}
    >
      {children}
    </AnimatedBox>
  );
};

export default AnimatedSection; 