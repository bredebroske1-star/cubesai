# LazyCat

Minimal, privacy-minded desktop browser built on Electron. Features:

- Minimal UI with single address bar
- Blocking of common ad/tracker domains
- Uses Google search when a query is entered

Run locally:

```bash
cd lazycat
npm install
npm start
```

Notes:
- This is a minimal prototype. For production use, audit Electron security settings and use a more complete blocklist.

Android packaging (overview):

1. Build the web UI into `dist/`:

```bash
cd lazycat
npm run build-web
```

2. Use Capacitor to wrap `dist/` as an Android app:

```bash
npm install @capacitor/cli @capacitor/core --save-dev
npx cap init lazycat com.example.lazycat
npx cap add android
# copy web assets
cp -r dist/* android/app/src/main/assets/public/
npx cap copy android
npx cap open android
```

Notes:
- Capacitor uses the system WebView; to extend blocking you'll need to implement an Android WebViewClient that blocks requests by host.
- For a hardened Android browser, consider writing a small native WebView wrapper that references the same blocklist and enforces HTTPS-only navigation.
