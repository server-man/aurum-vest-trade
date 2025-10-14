import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Logo } from '../Logo';

describe('Logo Component', () => {
  const renderLogo = (props = {}) => {
    return render(
      <BrowserRouter>
        <Logo {...props} />
      </BrowserRouter>
    );
  };

  it('should render the logo with default size', () => {
    const { container } = renderLogo();
    const logo = container.querySelector('a');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('href', '/');
  });

  it('should render with custom size', () => {
    renderLogo({ size: 'lg' });
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('h-10', 'w-10');
  });

  it('should render with small size', () => {
    renderLogo({ size: 'sm' });
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('h-6', 'w-6');
  });

  it('should display the brand name', () => {
    const { container } = renderLogo();
    expect(container.textContent).toContain('Aurum Vest');
  });

  it('should have accessible link', () => {
    const { container } = renderLogo();
    const logo = container.querySelector('a');
    expect(logo).toBeInTheDocument();
  });
});
