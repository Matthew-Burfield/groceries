import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

type Request<TParams> = FastifyRequest<{
  Params: TParams;
}>;

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function () {
    return { message: 'Hello API' };
  });

  type ChannelParams = {
    channelId: string;
  };
  fastify.get(
    '/api/channels/:channelId',
    async function (request: Request<ChannelParams>, _reply: FastifyReply) {
      const { channelId } = request.params;
      return { message: `Hello ${channelId} - ${process.env.TEST}` };
    }
  );
}
