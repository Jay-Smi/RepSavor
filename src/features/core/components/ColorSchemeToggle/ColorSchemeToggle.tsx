import { Icon } from '@iconify/react';
import {
  ActionIcon,
  Group,
  Switch,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { CV } from '../../constants';

type ColorSchemeToggleProps = {
  opened: boolean;
};

export function ColorSchemeToggle({ opened }: ColorSchemeToggleProps) {
  const { setColorScheme } = useMantineColorScheme();
  const currentColorScheme = useComputedColorScheme('dark', {
    getInitialValueInEffect: false,
  });

  const isLightMode = currentColorScheme === 'light';

  return (
    <Group justify="center" gap="xs">
      {(opened || (!opened && isLightMode)) && (
        <ActionIcon
          variant="subtle"
          size="lg"
          onClick={() => setColorScheme('dark')}
          color={CV.text}
          aria-label="Switch to dark mode"
        >
          <Icon height={24} icon="tabler:moon" />
        </ActionIcon>
      )}

      {opened && (
        <Switch
          size="lg"
          color="yellow"
          checked={isLightMode}
          onChange={(e) => {
            setColorScheme(e.currentTarget.checked ? 'light' : 'dark');
          }}
          aria-label="Toggle light/dark mode"
        />
      )}

      {(opened || (!opened && !isLightMode)) && (
        <ActionIcon
          variant="subtle"
          size="lg"
          onClick={() => setColorScheme('light')}
          color={CV.text}
          aria-label="Switch to light mode"
        >
          <Icon height={24} icon="tabler:sun" />
        </ActionIcon>
      )}
    </Group>
  );
}
