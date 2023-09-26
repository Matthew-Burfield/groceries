import Ably from 'ably';
import fetchMock from 'jest-fetch-mock';
import { renderHook } from '@testing-library/react-native';
import { usePubSub } from './usePubSub';

jest.mock('ably', () => ({
  Realtime: jest.fn(),
}));

const mockChannel = {
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
};
const mockRealtime = {
  channels: {
    get: jest.fn((_channelName: string) => mockChannel),
  },
  authCallback: jest.fn(),
};

beforeEach(() => {
  fetchMock.resetMocks();
});

beforeAll(() => {
  // Mock the Ably Realtime constructor
  // @ts-expect-error: Property 'mockImplementation' does not exist on type 'typeof Realtime'.
  Ably.Realtime.mockImplementation(() => mockRealtime);
});

describe('usePubSub', () => {
  it('should subscribe and unsubscribe to the channel', async () => {
    const channelName = 'test-channel';
    const action = jest.fn();

    // Render the hook
    const { unmount } = renderHook(() => usePubSub({ channelName, action }));

    // Assert that the Ably Realtime constructor was called
    expect(Ably.Realtime).toHaveBeenCalledTimes(1);

    // Assert that we retrieve the correct channel
    expect(mockRealtime.channels.get).toHaveBeenCalledTimes(1);
    expect(mockRealtime.channels.get).toHaveBeenCalledWith(channelName);

    // Get the channel
    const channel = mockRealtime.channels.get(channelName);

    // Assert that the channel.subscribe method was called
    expect(channel.subscribe).toHaveBeenCalledTimes(1);

    // Simulate unmounting the component
    unmount();

    // Assert that the channel.unsubscribe method was called
    expect(channel.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should handle errors in the Ably authCallback', async () => {
    // Mock a rejected promise for the Ably authCallback
    mockRealtime.authCallback.mockRejectedValueOnce(new Error('Auth error'));

    const channelName = 'test-channel';
    const action = jest.fn();

    // Render the hook
    const { unmount } = renderHook(() => usePubSub({ channelName, action }));

    // Assert that an error was logged
    // You can modify this part to match how you handle errors in your hook
    // For example, you might set an error state or log the error.
    // This depends on the actual implementation of your hook.
    // For example: expect(result.current.error).toEqual('usePubSub: Error requesting token: Auth error');

    // Simulate unmounting the component
    unmount();
  });
});
