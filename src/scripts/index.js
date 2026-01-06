import '../styles/styles.css';
import App from './pages/app';


function updateNav() {
  const authNav = document.querySelector('#auth-nav');
  if (!authNav) return;

  const token = localStorage.getItem('token'); 
  
  if (token) {
    authNav.innerHTML = `<a href="javascript:void(0)" id="logout-btn" class="nav-link">Logout</a>`;
    
    const logoutBtn = document.querySelector('#logout-btn');
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token'); 
      alert('Berhasil Logout');
      window.location.hash = '#/login';
      updateNav();
    });
  } else {
    authNav.innerHTML = `<a href="#/login" class="nav-link">Login / Register</a>`;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  updateNav(); 
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    updateNav(); 
    await app.renderPage();
  });
});

const PUBLIC_VAPID_KEY = 'MASUKKAN_PUBLIC_KEY_DARI_API_DI_SINI';

async function subscribeUser() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
  });
}

import { StoryDb } from './utils/db';
import { addStory } from './data/api';

window.addEventListener('online', async () => {
  const pendingStories = await StoryDb.getAllStories();
  
  if (pendingStories.length > 0) {
    for (const story of pendingStories) {
      const formData = new FormData();
      formData.append('description', story.description);
      formData.append('photo', story.photo);
      if (story.lat) formData.append('lat', story.lat);
      if (story.lon) formData.append('lon', story.lon);

      try {
        const response = await addStory(formData);
        if (!response.error) {
          await StoryDb.deleteStory(story.id);
        }
      } catch (err) {
        console.error('Gagal sinkronisasi otomatis:', err);
      }
    }
    alert('Koneksi kembali! Cerita offline kamu telah berhasil di-upload.');
    window.location.reload();
  }
});