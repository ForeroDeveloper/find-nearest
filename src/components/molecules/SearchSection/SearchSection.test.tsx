import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchSection } from './SearchSection';

describe('SearchSection component', () => {
  test('Renders initial state correctly', () => {
    render(<SearchSection />);

    const searchSection = screen.getByTestId('search-section');
    expect(searchSection).toBeDefined();

    const inputElement = screen.getByTestId('search-input') as any;
    expect(inputElement['value']).toBe('');

    const selectedOption = screen.queryByText('Selected Option');
    expect(selectedOption).toBeNull();

    const filteredOptions = screen.queryAllByRole('option');
    expect(filteredOptions).toHaveLength(0);
  });

  test('Opens dropdown when clicking on input', async () => {
    render(<SearchSection />);

    const inputElement = screen.getByTestId('search-input') as any;

    fireEvent.click(inputElement);

    await waitFor(() => {
      const dropdownOptions = screen.getAllByTestId(/option-city-\d+/);
      expect(dropdownOptions).toHaveLength(10);
    });
  });

});
