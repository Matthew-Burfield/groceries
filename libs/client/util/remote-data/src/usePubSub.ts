import { useEffect, useMemo } from 'react';
import * as Ably from 'ably';
// import Constants from 'expo-constants';

// const baseUri = Constants.expoConfig?.hostUri
//   ? Constants.expoConfig?.hostUri.split(':').shift().concat(`:3000`)
//   : `yourapi.com`;

type Message<TData> = {
  type: 'added' | 'updated' | 'deleted';
  data: TData;
};

type Channel = {
  subscribe: <TData>(action: (message: Message<TData>) => void) => void;
  unsubscribe: () => void;
};

async function usePubSub<TData>({
  channelName,
  action,
}: {
  channelName: string;
  action: (message: Message<TData>) => void;
}) {
  const pubsub = useMemo(
    () =>
      new Ably.Realtime({
        async authCallback(_data, callback) {
          try {
            const tokenRequest = await fetch(
              'http://localhost:3000/pubsub/auth'
            )
              .then((response) => response.json())
              .then((tokenRequest) => tokenRequest);
            callback(null, tokenRequest);
          } catch (error) {
            const errorMessage = `usePubSub: Error requesting token: ${JSON.stringify(
              error
            )}`;
            callback(errorMessage, null);
          }
        },
      }),
    []
  );

  const channel = useMemo(
    () => pubsub.channels.get(channelName),
    [pubsub, channelName]
  );

  useEffect(() => {
    channel.subscribe(() => {
      console.log('subscribed');
    });

    return () => {
      channel.unsubscribe(() => {
        console.log('unsubscribed');
      });
    };
  }, [channel, action]);

  return null;
}

export { usePubSub };
