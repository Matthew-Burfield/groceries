import { useEffect, useState } from 'react';
import { useAsyncEffect } from './useAsyncEffect';

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
  const [channel, setChannel] = useState<Channel | null>(null);
  useAsyncEffect(
    async () => {
      const channel = await fetch(`/channel/${channelName}`).then((response) =>
        response.json()
      );
      setChannel(channel);
    },
    async () => {
      return void 0;
    },
    [channelName]
  );

  useEffect(() => {
    if (channel !== null) {
      channel.subscribe(action);
    }

    return () => {
      if (channel !== null) {
        channel.unsubscribe();
      }
    };
  }, [channel, action]);

  return null;
}

export { usePubSub };
