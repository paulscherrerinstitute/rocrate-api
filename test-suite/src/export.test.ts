import { API_KEY, BASE_URL, TestingEnv } from './env';

describe('Export endpoint', () => {
  const endpoint = `${BASE_URL}/export`;

  test('should return 404 with non-existing identifier (JSON-LD)', async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(['invalid-identifier']),
      headers: {
        Accept: 'application/ld+json',
        'Content-Type': 'application/json',
        'api-key': API_KEY,
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
        'api-key': API_KEY,
      },
    });
    expect(response.status).toBe(404);
  });

  test('should return 200 with a valid identifier (JSON-LD)', async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(getSystemIdentifiers(1)),
      headers: {
        Accept: 'application/ld+json',
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
    });

    expect(response.status).toBe(200);
  });

  test('should return 200 with a valid identifier (ZIP)', async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(getSystemIdentifiers(1)),
      headers: {
        Accept: 'application/ld+json',
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
    });

    expect(response.status).toBe(200);
  });

  test('should return 200 with multiple valid identifiers (JSON-LD)', async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(getSystemIdentifiers(2)),
      headers: {
        Accept: 'application/ld+json',
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
    });

    expect(response.status).toBe(200);
  });

  test('should return 200 with multiple valid identifiers (ZIP)', async () => {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(getSystemIdentifiers(2)),
      headers: {
        Accept: 'application/ld+json',
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
    });

    expect(response.status).toBe(200);
  });
});

function getSystemIdentifiers(size: number) {
  const identifiers: string[] = knownIdentifiers.get(BASE_URL)!;
  if (size > identifiers.length) {
    throw new Error('invalid number of identifers');
  }

  return identifiers.slice(0, size);
}

const knownIdentifiers = new Map<TestingEnv, string[]>([
  [
    TestingEnv.PSI,
    [
      '10.16907/eb75dfba-6c91-4276-8dd6-05f949307213',
      '10.16907/edfe4ad5-9448-4e38-91a1-0459c8713b9b',
    ],
  ],
  [
    TestingEnv.OPENBIS,
    [
      'https://doi.org/10.1038/s41586-020-03065-y',
      'https://doi.org/10.1038/s41586-020-3010-5',
      'DOI: 10.1126/science.abe8770',
    ],
  ],
]);
