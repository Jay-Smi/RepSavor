import { Image, ImageProps, MantineStyleProps } from '@mantine/core';
import { APP } from '../constants';

export type AppIconProps = {
  size?: MantineStyleProps['h'];
} & Omit<ImageProps, 'h' | 'w' | 'src'>;

export const AppIcon = ({
  size = APP.HEADER_HEIGHT,
  ...rest
}: AppIconProps) => (
  <Image {...rest} src="/apple-touch-icon.png" h={size} w={size} />
);
