import CONFIG from '../config';

export async function getAllStories() {
  const token = localStorage.getItem('token'); 
  const response = await fetch(`${CONFIG.BASE_URL}/stories?location=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}

export async function addStory(formData) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  return await response.json();
}

export async function register(name, email, password) {
  const response = await fetch(`${CONFIG.BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return await response.json();
}

export async function login(email, password) {
  const response = await fetch(`${CONFIG.BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const responseJson = await response.json();

  if (!responseJson.error) {
    localStorage.setItem('token', responseJson.loginResult.token);
  }
  
  return responseJson;
}

export const sendSubscriptionToServer = async (subscription) => {
  const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(subscription),
  });
  return response.json();
};

export const deleteSubscriptionFromServer = async (endpoint) => {
  const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ endpoint }),
  });
  return response.json();
};