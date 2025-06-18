export async function loginUser(username: string, password: string) {
  const url = 'http://13.201.137.219:8080/krss/auth/login';

  const base64 = btoa(`${username}:${password}`); 

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${base64}`,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.text(); 
    return { success: true, data };
  } catch (error) {
    const err = error as Error;
    return { success: false, message: err.message };
  }
}