import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function () {
    return { message: 'Hello API' };
  });
  fastify.get('/api/shopping-list', async function () {
    return shoppingList;
  });
}

const shoppingList = [
  {
    id: 1,
    name: 'Carrots',
    type: 'fruit_and_vegetables',
    isComplete: false,
    quantity: '1 kg',
  },
  {
    id: 2,
    name: 'Apples',
    type: 'fruit_and_vegetables',
    isComplete: false,
    quantity: '5',
  },
  {
    id: 3,
    name: 'Lettuce',
    type: 'fruit_and_vegetables',
    isComplete: false,
  },
  {
    id: 1,
    name: 'Zucchini',
    type: 'fruit_and_vegetables',
    isComplete: false,
    quantity: '2',
  },
  {
    id: 1,
    name: 'Chicken',
    type: 'meat_and_seafood',
    isComplete: false,
    quantity: '2 kg',
  },
];
