import { render, screen, userEvent } from '@test-utils'; // imports the same navLinks array that NavContents uses

import { AppShell } from '@mantine/core';
import MainNavbar from './MainNavbar';
import { navLinks } from './MainNavbar.config';

const NavbarWrapper = ({
  opened,
  toggle,
}: {
  opened: boolean;
  toggle: () => void;
}) => (
  <AppShell
    padding="md"
    styles={{
      main: { marginLeft: 0 },
    }}
  >
    <AppShell.Navbar w={{ base: 300 }} p="xs">
      <MainNavbar opened={opened} toggle={toggle} />
    </AppShell.Navbar>
  </AppShell>
);

describe('MainNavbar component', () => {
  it('renders correctly when opened=false', async () => {
    const toggleFn = vi.fn();
    const { container } = await render(
      <NavbarWrapper opened={false} toggle={toggleFn} />
    );

    // 1) Burger button should be present (NavHeader)
    //    It has aria-label="Toggle navigation"
    const burgerBtn = screen.getByLabelText('Toggle navigation');
    expect(burgerBtn).toBeInTheDocument();

    // 2) "Navigation" header should NOT appear (NavContents collapsed)
    expect(screen.queryByText('Navigation')).toBeNull();

    // 4) There should be one <a> per navLinks entry
    const anchors = container.querySelectorAll('a');
    expect(anchors.length).toBe(navLinks.length);

    // 5) No link labels should be visible when collapsed
    navLinks.forEach((link) => {
      expect(screen.queryByText(link.label)).toBeNull();
    });

    // 6) Divider (role="separator") should be in the DOM
    expect(screen.getByRole('separator')).toBeInTheDocument();

    // 7) If we click the burger, toggleFn should fire
    await userEvent.click(burgerBtn);
    expect(toggleFn).toHaveBeenCalledTimes(1);
  });

  it('renders correctly when opened=true', async () => {
    const toggleFn = vi.fn();
    const { container } = await render(
      <NavbarWrapper opened toggle={toggleFn} />
    );

    // 1) Burger button still present
    const burgerBtn = screen.getByLabelText('Toggle navigation');
    expect(burgerBtn).toBeInTheDocument();

    // 2) "Navigation" header should be visible
    expect(screen.getByText('Navigation')).toBeInTheDocument();

    // 3) The <Space> (height: 24.8px) should NOT be present
    const spaceEl = container.querySelector('div[style*="height: 24.8px"]');
    expect(spaceEl).toBeNull();

    // 4) There should still be one <a> per navLinks entry
    const anchors = container.querySelectorAll('a');
    expect(anchors.length).toBe(navLinks.length);

    // 5) Every navLinks label should be visible now
    navLinks.forEach((link) => {
      expect(screen.getByText(link.label)).toBeInTheDocument();
    });

    // 6) Divider (role="separator") should still be present
    expect(screen.getByRole('separator')).toBeInTheDocument();

    // 7) Clicking burger toggles
    await userEvent.click(burgerBtn);
    expect(toggleFn).toHaveBeenCalledTimes(1);
  });
});
