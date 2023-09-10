import React from 'react';
import { render } from '@testing-library/react-native';

import BottomTabs from './bottom-tabs';

describe('BottomTabs', () => {
  it('should render successfully', () => {
    const { root } = render(< BottomTabs />);
    expect(root).toBeTruthy();
  });
});
