import { keyframes } from '@emotion/react';
import { Center } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import { AppIcon } from '../components/AppIcon';

const glow = keyframes({
  '0%': { opacity: 0.5 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.5 },
});

const useStyles = createStyles({
  glow: {
    animation: `${glow} 3s ease-in-out infinite`,
  },
});

const LoadingPage = () => {
  const { classes } = useStyles();
  return (
    <Center h="100%" w="100%">
      <AppIcon className={classes.glow} size={150} />
    </Center>
  );
};

export default LoadingPage;
