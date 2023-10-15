const SERVER_URL = 'https://muskox-generous-scarcely.ngrok-free.app';

type FetchArgs = Parameters<typeof fetch>;
function fetchWrapper(...[input, init]: FetchArgs) {
  return fetch(SERVER_URL + input, init);
}

export { fetchWrapper as fetch };
