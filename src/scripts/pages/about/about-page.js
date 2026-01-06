export default class AboutPage {
  async render() {
    return `
      <section class="container">
        <article>
          <h2 tabindex="0">Tentang Story App</h2>
          <p>Aplikasi ini adalah platform berbagi cerita yang memungkinkan pengguna untuk:</p>
          <ul>
            <li>Melihat cerita dari berbagai lokasi melalui peta interaktif.</li>
            <li>Mengunggah foto dan menyertakan koordinat lokasi.</li>
            <li>Menjelajahi konten dengan aksesibilitas yang optimal.</li>
          </ul>

          <div class="form-group">
            <p>Notifikasi:</p>
            <button id="subscribe-push" class="btn-secondary">Aktifkan Notifikasi</button>
          </div>
          
          <img src="images/logo.png" alt="Logo resmi Story App" style="width: 150px; margin-top: 1rem;">
        </article>
      </section>
    `;
  }

  async afterRender() {
    const subscribeButton = document.querySelector('#subscribe-push');
    
    await this._initialButtonState(subscribeButton);

    subscribeButton.addEventListener('click', async () => {
      const isSubscribed = subscribeButton.getAttribute('data-subscribed') === 'true';
      
      if (isSubscribed) {
        await this._unsubscribe(subscribeButton);
      } else {
        await this._subscribe(subscribeButton);
      }
    });

    const btnSubscribe = document.querySelector('#btn-subscribe');
    
    btnSubscribe.addEventListener('click', async () => {
      const status = await Notification.requestPermission();
  
      if (status === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'ISI_VAPID_PUBLIC_KEY_DISINI', 
        });

        await subscribePushNotification(subscription);
        alert('Notifikasi berhasil diaktifkan!');
      }
    });

    const btnNotification = document.querySelector('#btn-notification');

    if (Notification.permission === 'granted') {
      btnNotification.innerText = 'Matikan Notifikasi';
      btnNotification.style.backgroundColor = '#ff4d4d';
    } else {
      btnNotification.innerText = 'Aktifkan Notifikasi';
      btnNotification.style.backgroundColor = '#007bff';
    }

    btnNotification.addEventListener('click', async () => {
      if (Notification.permission !== 'granted') {
        const result = await Notification.requestPermission();
        if (result === 'granted') {
          location.reload();
        }
      } else {
        alert('Notifikasi sudah aktif. Untuk mematikan, silakan ubah pengaturan izin di browser Anda.');
      }
    });
  }

  async _initialButtonState(button) {
    if (Notification.permission === 'granted') {
      this._setButtonState(button, true);
    } else {
      this._setButtonState(button, false);
    }
  }

  _setButtonState(button, isSubscribed) {
    if (isSubscribed) {
      button.innerText = 'Matikan Notifikasi';
      button.style.backgroundColor = '#ff4d4d';
      button.style.color = 'white';
      button.setAttribute('data-subscribed', 'true');
    } else {
      button.innerText = 'Aktifkan Notifikasi';
      button.style.backgroundColor = '#f0f0f0';
      button.style.color = 'black';
      button.setAttribute('data-subscribed', 'false');
    }
  }

  async _subscribe(button) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      this._setButtonState(button, true);
      alert('Notifikasi berhasil diaktifkan!');
    } else {
      alert('Izin notifikasi ditolak oleh pengguna.');
    }
  }

  async _unsubscribe(button) {
    this._setButtonState(button, false);
    alert('Notifikasi telah dimatikan.');
  }
}