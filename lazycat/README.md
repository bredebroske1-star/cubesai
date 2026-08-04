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

Windows packaging (Electron):

1. Install dev deps and build the web UI:

```bash
cd lazycat
npm install
npm run dist
```

2. Create a Windows installer (NSIS):

```bash
npm run package-win
```

Artifacts will be created in `dist_electron/`. Test installers on a Windows VM.

Play Store & account limitations:

- I cannot create Google Play developer accounts or publish apps on your behalf. Publishing requires an active Google Play developer account and manual verification.
- I can prepare an Android build (AAB) and guide you through signing and publishing. You must sign in to your account and upload the package, set the store listing, content rating, and privacy policy.

Preparing an Android build (Capacitor) — quick steps recap:

```bash
cd lazycat
npm install @capacitor/cli @capacitor/core --save-dev
npm run build-web
npx cap init lazycat com.example.lazycat
npx cap add android
# Copy generated web assets
cp -r dist/* android/app/src/main/assets/public/
npx cap copy android
npx cap open android
```

Generating a signed AAB in Android Studio:

- Open the Android project in Android Studio (`npx cap open android`).
- Build > Generate Signed Bundle / APK > Android App Bundle.
- Create (or reuse) a keystore, keep its credentials private, and save the signed AAB for upload.

If you'd like, I can generate helper Gradle snippets and a sample Android `WebViewClient` blocking implementation to integrate the `blocklist.json` hosts into a native WebView, and prepare a script to produce an unsigned AAB that you can sign locally.
