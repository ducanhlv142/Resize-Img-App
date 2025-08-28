# Resize-Img-App
This app for image resize by Electron.js

Ứng dụng desktop giúp **resize ảnh nhanh** (PNG/JPG/WEBP/GIF/BMP/SVG/AVIF…) với UI gọn nhẹ. Xây dựng bằng **Electron** + **HTML/CSS/JS**, không cần backend.

## ✨ Tính năng
- Chọn ảnh từ máy, tự động **đọc kích thước gốc** (width/height).
- Nhập kích thước mới và **resize** bằng thư viện `resize-img`.
- Lưu ảnh đã resize vào `~/imageresizer` (mở Explorer/Finder trỏ đến file vừa lưu).
- **Toast** thông báo thành công/thất bại (Toastify).
- Cửa sổ **About** (modal).
- Cấu hình CSP + Preload an toàn: `contextIsolation: true`, `nodeIntegration: false`.

## 🗂️ Cấu trúc thư mục
.
├── build/ # icon build (png/ico/icns)
│ └── icon.png # khuyên dùng PNG 256x256, builder tự convert
├── dist/ # output khi build (tự sinh)
├── renderer/
│ ├── index.html
│ ├── about.html
│ ├── css/
│ │ ├── styles.css
│ │ └── toastify.css # copy từ node_modules/toastify-js/src/toastify.css
│ ├── images/
│ │ └── logo.png
│ └── js/
│ ├── preload.js
│ └── renderer.js
├── main.js
├── package.json
└── README.md

## 🧰 Yêu cầu
- Node.js LTS (≥ 18) & npm
- Windows/macOS/Linux

## 🚀 Bắt đầu

```bash
# cài dependencies
npm install

# copy CSS của toastify vào folder renderer (nếu chưa có)
mkdir -p renderer/css
cp node_modules/toastify-js/src/toastify.css renderer/css/toastify.css

# chạy dev (auto-reload với electronmon)
npm run dev

Dev tip:

Ctrl+R: reload cửa sổ renderer

Ctrl+Shift+I: mở DevTools

🧱 Build / Đóng gói

Sử dụng electron-builder để tạo installer: npm run dist

Windows → file cài đặt dist/Image Resizer-<version>-Setup.exe
macOS → .dmg (chỉ build được trên máy mac)
Linux → .AppImage

📜 License
MIT

👤 Tác giả
KolfLDA