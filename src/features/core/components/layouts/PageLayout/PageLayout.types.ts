import { ReactNode } from 'react';

export interface PageLayoutProps {
  headerRight?: ReactNode;
  children?: ReactNode;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
}
