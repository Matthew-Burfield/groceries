import { FastifyInstance } from 'fastify';
import * as Ably from 'ably';

const pubsubClient = new Ably.Realtime(process.env.PUBSUB_KEY);

export default async function (fastify: FastifyInstance) {
  fastify.get('/pubsub/auth', async function () {
    const tokenRequest = await requestPubSubToken();
    return tokenRequest;
  });
}

async function requestPubSubToken() {
  const tokenParams = {
    // capability?: { [key: string]: capabilityOp[] } | string;
    // clientId?: string;
    // nonce?: string;
    // timestamp?: number;
    // ttl?: number;
  };
  return new Promise<Ably.Types.TokenRequest>((resolve, reject) => {
    pubsubClient.auth.createTokenRequest(
      tokenParams,
      function (
        error: Ably.Types.ErrorInfo,
        tokenRequest: Ably.Types.TokenRequest
      ) {
        if (error) {
          console.error('Error creating token request', error);
          return reject(error);
        } else {
          console.log('Token request successful', tokenRequest);
          return resolve(tokenRequest);
        }
      }
    );
  });
}
