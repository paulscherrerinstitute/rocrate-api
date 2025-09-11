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

  test('should return 400 with invalid JSON-LD payload', async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: '{',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/ld+json',
      },
    });

    expect(response.status).toBe(400);
  });

  test('should return 400 with invalid Zip payload', async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: 'not a valid zip file',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/zip',
      },
    });

    expect(response.status).toBe(400);
  });
});
