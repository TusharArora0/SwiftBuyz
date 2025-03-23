import React, { useState, useEffect } from 'react';
import { Fab, Zoom, useScrollTrigger } from '@mui/material';
import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  
  // Use MUI's useScrollTrigger for better performance
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });
  
  // Update visibility based on scroll position
  useEffect(() => {
    setVisible(trigger);
  }, [trigger]);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <Zoom in={visible}>
      <Fab
        color="primary"
        size="medium"
        aria-label="scroll back to top"
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
          boxShadow: 3,
          '&:hover': {
            transform: 'translateY(-4px)',
            transition: 'transform 0.3s ease'
          }
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
};

export default BackToTop; 