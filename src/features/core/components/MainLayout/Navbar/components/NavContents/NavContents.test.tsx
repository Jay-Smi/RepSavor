import { render, screen } from '@test-utils';
import { navLinks } from '../../MainNavbar/MainNavbar.config'; // adjust path if needed
import { NavContents } from './NavContents';

describe('NavContents component', () => {
  it('renders no header text when opened=false', async () => {
    const { container } = await render(<NavContents opened={false} />);

    expect(screen.queryByText('Navigation')).toBeNull();

    const anchors = container.querySelectorAll('a');
    expect(anchors.length).toBe(navLinks.length);

    navLinks.forEach((link) => {
      expect(screen.queryByText(link.label)).toBeNull();
    });
  });

  it('renders header text and link labels when opened=true', async () => {
    const { container } = await render(<NavContents opened />);

    // 1) "Navigation" header should appear
    expect(screen.getByText('Navigation')).toBeInTheDocument();

    // 2) It should NOT render a <Space> in this branch
    const spaceEl = container.querySelector('div[style*="height: 24.8px"]');
    expect(spaceEl).toBeNull();

    // 3) It should still render exactly one <NavLink> per navLinks entry
    const anchors = container.querySelectorAll('a');
    expect(anchors.length).toBe(navLinks.length);

    // 4) When expanded, each link’s label SHOULD be visible
    navLinks.forEach((link) => {
      expect(screen.getByText(link.label)).toBeInTheDocument();
    });
  });
});
