import { Icon } from '@iconify/react';
import { Group, Kbd, Text, UnstyledButton } from '@mantine/core';
import { CV } from '../../constants';

type SpotlightSearchBarProps = {
  opened: boolean;
};

export const SpotlightSearchBar = ({ opened }: SpotlightSearchBarProps) => {
  // ** global state ** //

  // ** local state ** //

  // ** local vars ** //

  // ** handlers ** //
  return (
    <UnstyledButton
      w="100%"
      px={`calc(${CV.padding} + 2px)`}
      py={4}
      h={40}
      style={{
        borderRadius: CV.borderRadius,
        border: `1px solid ${CV.border}`,
      }}
      sx={{
        '&:hover': {
          backgroundColor: CV.hover,
        },
        '&:active': {
          transform: 'translateY(1px)',
          transition: 'transform 100ms ease',
        },
      }}
    >
      <Group align="center" justify="space-between" h="100%">
        <Group align="center" h="100%">
          <Icon color={CV.dimmed} icon="tabler:search" height={20} width={20} />

          {opened && (
            <Text fz={18} c={CV.dimmed}>
              Search
            </Text>
          )}
        </Group>

        {opened && <Kbd size="sm">/</Kbd>}
      </Group>
    </UnstyledButton>
  );
};
