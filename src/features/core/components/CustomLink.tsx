import { forwardRef } from 'react';
import { createLink, LinkComponent } from '@tanstack/react-router';
import { Anchor, AnchorProps, darken, lighten } from '@mantine/core';
import { CV } from '../constants';

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
