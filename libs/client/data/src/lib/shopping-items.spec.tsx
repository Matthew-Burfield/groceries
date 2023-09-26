import React from 'react';
import { render } from '@testing-library/react-native';

import ShoppingItems from './shopping-items';

describe('ShoppingItems', () => {
  it('should render successfully', () => {
    const { root } = render(< ShoppingItems />);
    expect(root).toBeTruthy();
  });
});
