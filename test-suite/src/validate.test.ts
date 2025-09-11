import { BASE_URL } from './env';

describe('Validate endpoint', () => {
  const endpoint = `${BASE_URL}/validate`;

  test('should return 406 with invalid Accept header', async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'invalid',
      },
    });

    expect(response.status).toBe(406);
  });
});
