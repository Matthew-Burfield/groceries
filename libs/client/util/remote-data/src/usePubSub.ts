import { useEffect } from 'react';

type Message<TData> = {
  type: 'added' | 'updated' | 'deleted';
  data: TData;
};

function usePubSub<TData>({
  channelName,
  action,
}: {
  channelName: string;
  action: (message: Message<TData>) => void;
}) {
  // useEffect(() => {
  //   channel.subscribe(channelName, action);
  //
  //   return () => channel.unsubscribe(channelName);
  // }, [channelName, action]);
  return null;
}

export { usePubSub };
