import { API_URL } from '../../globals.mjs';

export async function updateCall(identifier: string, portraitId: string, nodeAddress: string, update: object) {
  try {
    const url = `${API_URL}/node/update`;
    const body = {
      identifier,
      portraitId,
      nodeAddress,
      update,
    };

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // if not 200 throw
    if (response.status !== 200) {
      throw new Error(data.message);
    }

    return data;
  } catch (e) {
    console.log(e);
    return e;
  }
}
