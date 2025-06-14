import { ReactNode } from 'react';

export interface PageLayoutProps {
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  children?: ReactNode;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
}
