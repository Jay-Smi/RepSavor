import { ComponentProps, forwardRef } from 'react';
import { createLink, LinkComponent } from '@tanstack/react-router';
import { Anchor, AnchorProps } from '@mantine/core';

interface MantineAnchorProps extends Omit<AnchorProps, 'href'> {
  // Add any additional props you want to pass to the anchor
}

const MantineLinkComponent = forwardRef<HTMLAnchorElement, MantineAnchorProps>(
  (props, ref) => {
    return <Anchor ref={ref} {...props} />;
  }
);

const CreatedLinkComponent = createLink(MantineLinkComponent);

export const CustomLink: LinkComponent<typeof MantineLinkComponent> = (
  props
) => {
  return <CreatedLinkComponent preload="intent" {...props} />;
};

export type CustomLinkProps = ComponentProps<typeof CustomLink>;
