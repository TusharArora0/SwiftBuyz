import { keyframes } from '@mui/material/styles';

// Fade in animation
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Fade in up animation
export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Fade in down animation
export const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Fade in left animation
export const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Fade in right animation
export const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Scale in animation
export const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Bounce animation
export const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
`;

// Pulse animation
export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Shimmer animation for loading states
export const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Rotate animation
export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Slide in from bottom animation
export const slideInBottom = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

// Slide in from top animation
export const slideInTop = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

// Floating animation
export const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// Apply animation with delay based on index
export const getStaggeredAnimation = (animation, index, baseDelay = 0.1) => ({
  animation: `${animation} 0.6s ease-out forwards`,
  animationDelay: `${baseDelay * index}s`,
  opacity: 0,
});

// Apply fade in up animation with staggered delay
export const getFadeInUpStaggered = (index, baseDelay = 0.1) => 
  getStaggeredAnimation(fadeInUp, index, baseDelay);

// Apply fade in animation with staggered delay
export const getFadeInStaggered = (index, baseDelay = 0.1) => 
  getStaggeredAnimation(fadeIn, index, baseDelay);

// Apply scale in animation with staggered delay
export const getScaleInStaggered = (index, baseDelay = 0.1) => 
  getStaggeredAnimation(scaleIn, index, baseDelay);

// Apply fade in left animation with staggered delay
export const getFadeInLeftStaggered = (index, baseDelay = 0.1) => 
  getStaggeredAnimation(fadeInLeft, index, baseDelay);

// Apply fade in right animation with staggered delay
export const getFadeInRightStaggered = (index, baseDelay = 0.1) => 
  getStaggeredAnimation(fadeInRight, index, baseDelay);

// Stagger delay helper
export const getStaggerDelay = (index, baseDelay = 0.1) => `${baseDelay * index}s`; 