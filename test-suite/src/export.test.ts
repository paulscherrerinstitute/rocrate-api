import { BASE_URL } from './env';

describe('Export endpoint', () => {
  const endpoint = `${BASE_URL}/export`;

  test('should return 404 with non-existing identifier (JSON-LD)', async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(['invalid-identifier']),
      headers: {
        Accept: 'application/ld+json',
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(404);
  });

  test('should return 404 with non-existing identifier (ZIP)', async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(['invalid-identifier']),
      headers: {
        Accept: 'application/zip',
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(404);
  });
});
