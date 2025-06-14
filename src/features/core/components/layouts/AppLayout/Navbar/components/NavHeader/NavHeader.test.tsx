import { render, screen, userEvent } from '@test-utils';
import { NavHeader } from './NavHeader';

vi.mock('../../../../AppLogo', () => ({
  AppLogo: () => <div data-testid="app-logo">MockedLogo</div>,
}));

describe('NavHeader component', () => {
  const toggleFn = vi.fn(); // If you’re using Jest, replace `vi.fn()` with `jest.fn()`

  beforeEach(() => {
    toggleFn.mockClear();
  });

  it('renders the container with data-opened="false" when opened=false, and does NOT render <AppLogo>', async () => {
    const { container } = await render(
      <NavHeader opened={false} onToggle={toggleFn} />
    );
    // The wrapping <Group> should have data-opened="false":
    const wrapper = container.querySelector('[data-opened="false"]');
    expect(wrapper).toBeInTheDocument();

    // AppLogo should not be in the DOM
    expect(screen.queryByTestId('app-logo')).toBeNull();

    // The Burger button (aria-label = "Toggle navigation") should be present
    const burgerBtn = screen.getByLabelText('Toggle navigation');
    expect(burgerBtn).toBeInTheDocument();
  });

  it('renders the container with data-opened="true" when opened=true, and DOES render <AppLogo>', async () => {
    const { container } = await render(
      <NavHeader opened onToggle={toggleFn} />
    );
    // The wrapping <Group> should have data-opened="true":
    const wrapper = container.querySelector('[data-opened="true"]');
    expect(wrapper).toBeInTheDocument();

    // AppLogo should now be in the DOM
    expect(screen.getByTestId('app-logo')).toBeInTheDocument();

    // The Burger button (aria-label = "Toggle navigation") should still be present
    const burgerBtn = screen.getByLabelText('Toggle navigation');
    expect(burgerBtn).toBeInTheDocument();
  });

  it('calls onToggle when the Burger button is clicked', async () => {
    await render(<NavHeader opened={false} onToggle={toggleFn} />);
    const burgerBtn = screen.getByLabelText('Toggle navigation');

    await userEvent.click(burgerBtn);
    expect(toggleFn).toHaveBeenCalledTimes(1);

    // Clicking again toggles a second time
    await userEvent.click(burgerBtn);
    expect(toggleFn).toHaveBeenCalledTimes(2);
  });
});
