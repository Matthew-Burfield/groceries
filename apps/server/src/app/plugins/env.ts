import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import env from '@fastify/env';

const options = {
  schema: {
    type: 'object',
    properties: {
      PUBSUB_KEY: {
        type: 'string',
        default: '',
      },
    },
  },
  dotenv: true,
};

/**
 * Fastify plugin to load environment variables
 *
 * @see https://github.com/fastify/fastify-env
 */
export default fp(async function (fastify: FastifyInstance) {
  fastify.register(env, options);
});
