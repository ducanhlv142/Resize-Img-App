const ipcRenderer = window.ipcRenderer;
const os         = window.os;
const path       = window.path;
const toastify   = window.toastify;

// DOM
const form        = document.querySelector('#img-form');
const img         = document.querySelector('#img');
const outputPath  = document.querySelector('#output-path');
const filenameEl  = document.querySelector('#file-name');
const heightInput = document.querySelector('#height');
const widthInput  = document.querySelector('#width');
const aboutLink   = document.getElementById('about-link');

// ===== Helpers =====
function isFileImage (file) {
  const ok = ['image/gif','image/jpeg','image/png','image/webp','image/bmp','image/svg+xml'];
  return file && ok.includes(file.type);
}
function alertError(message) {
  toastify.toast({
    text: message, duration: 4000, close: true,
    gravity: 'top', position: 'right', stopOnFocus: true,
    style: { background: 'linear-gradient(90deg,#ef4444,#f59e0b)', color:'#fff' }
  });
}
function alertSuccess(message) {
  toastify.toast({
    text: message, duration: 2500, close: false,
    gravity: 'top', position: 'right', stopOnFocus: true,
    style: { background: 'linear-gradient(90deg,#22c55e,#14b8a6)', color:'#fff' }
  });
}

// ===== Events =====
img.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!isFileImage(file)) {
    alertError('Please select an image file');
    img.value = '';
    return;
  }

  // Lấy kích thước gốc (dùng DataURL để không dính CSP)
  const image  = new Image();
  const reader = new FileReader();
  reader.onload = () => { image.src = reader.result; }; // data:...
  image.onload  = function () {
    widthInput.value  = this.width;
    heightInput.value = this.height;
  };
  reader.readAsDataURL(file);

  form.classList.remove('hidden');
  filenameEl.textContent  = file.name;
  outputPath.textContent  = path.join(os.homedir(), 'imageresizer');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!img.files[0]) return alertError('Please upload an image');

  const width  = (widthInput.value  || '').trim();
  const height = (heightInput.value || '').trim();
  if (!width || !height) return alertError('Please enter a width and height');

  ipcRenderer.send('image:resize', {
    imgPath: img.files[0].path,
    width, height,
  });
});

ipcRenderer.on('image:done', (saved) => {
  const where = saved?.path || path.join(os.homedir(), 'imageresizer');
  outputPath.textContent = where;
  alertSuccess(`Saved → ${where}`);
});

ipcRenderer.on('image:error', (msg) => {
  alertError(msg || 'Resize failed');
});

aboutLink.addEventListener('click', (e) => {
  e.preventDefault();
  // Dùng API đã expose; nếu không có thì fallback IPC trực tiếp
  if (window.app?.openAbout) window.app.openAbout();
  else ipcRenderer.send('app:open-about');
});
