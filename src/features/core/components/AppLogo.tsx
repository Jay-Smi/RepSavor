import { Group, GroupProps, Title, TitleProps } from '@mantine/core';
import { APP } from '../constants';
import { AppIcon, AppIconProps } from './AppIcon';

export type AppLogoProps = {
  iconProps?: AppIconProps;
  titleProps?: TitleProps;
  groupProps?: GroupProps;
};

export const AppLogo = ({
  iconProps,
  titleProps,
  groupProps,
}: AppLogoProps) => (
  <Group gap="0.75rem" wrap="nowrap" align="center" {...groupProps}>
    <AppIcon size="2.5rem" {...iconProps} />

    <Title order={1} fz="h5" {...titleProps}>
      {APP.NAME}
    </Title>
  </Group>
);
