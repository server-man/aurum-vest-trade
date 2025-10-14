import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button Component', () => {
  it('should render button with text', () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button?.textContent).toBe('Click me');
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    const { container } = render(<Button onClick={handleClick}>Click me</Button>);
    const button = container.querySelector('button');
    
    if (button) await user.click(button);
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should render different variants', () => {
    const { container, rerender } = render(<Button variant="default">Default</Button>);
    let button = container.querySelector('button');
    expect(button).toHaveClass('bg-primary');

    rerender(<Button variant="destructive">Destructive</Button>);
    button = container.querySelector('button');
    expect(button).toHaveClass('bg-destructive');

    rerender(<Button variant="outline">Outline</Button>);
    button = container.querySelector('button');
    expect(button).toHaveClass('border');

    rerender(<Button variant="ghost">Ghost</Button>);
    button = container.querySelector('button');
    expect(button).toHaveClass('hover:bg-accent');
  });

  it('should render different sizes', () => {
    const { container, rerender } = render(<Button size="default">Default</Button>);
    let button = container.querySelector('button');
    expect(button).toHaveClass('h-10');

    rerender(<Button size="sm">Small</Button>);
    button = container.querySelector('button');
    expect(button).toHaveClass('h-9');

    rerender(<Button size="lg">Large</Button>);
    button = container.querySelector('button');
    expect(button).toHaveClass('h-11');

    rerender(<Button size="icon">Icon</Button>);
    button = container.querySelector('button');
    expect(button).toHaveClass('h-10', 'w-10');
  });

  it('should be disabled when disabled prop is true', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector('button');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    const { container } = render(<Button onClick={handleClick} disabled>Disabled</Button>);
    const button = container.querySelector('button');
    
    if (button) await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should accept custom className', () => {
    const { container } = render(<Button className="custom-class">Button</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should render as child component when asChild is true', () => {
    const { container } = render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });
});
