import React from 'react';
import { render } from '@testing-library/react-native';

import ShoppingList from './shopping-list';

describe('ShoppingList', () => {
  it('should render successfully', () => {
    const { root } = render(< ShoppingList />);
    expect(root).toBeTruthy();
  });
});
