import { render, screen } from '@test-utils';
import { NavLink } from './NavLink';

describe('NavLink component', () => {
  const defaultProps = {
    href: '/profile',
    label: 'Profile',
    icon: 'tabler:user',
  };

  it('renders a div', async () => {
    const res = await render(<div />);
    // The root element should be a <div>
    expect(res.baseElement).toBeInstanceOf(HTMLBodyElement);
  });

  it('renders an anchor (<a>) with the correct href and an SVG inside', async () => {
    const { container } = await render(
      <NavLink {...defaultProps} opened={false} />
    );

    // Find the first <a> element
    const anchor = container.querySelector('a');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute('href', '/profile');

    await new Promise((resolve) => setTimeout(resolve, 400)); // Wait for icon to be fetched
    // Inside that <a>, there should be an <svg> (Iconify icon)
    const svg = anchor!.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('does not display the text label when opened=false', async () => {
    await render(<NavLink {...defaultProps} opened={false} />);
    // The label string "Profile" should NOT be in the DOM
    expect(screen.queryByText('Profile')).toBeNull();
  });

  it('does display the text label when opened=true', async () => {
    await render(<NavLink {...defaultProps} opened />);
    // Now the label should be visible
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});
