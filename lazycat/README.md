
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

CI: automated build & Play upload

If you want to automate building and uploading AABs via GitHub Actions, I added a workflow at `.github/workflows/android-upload.yml` that:

- Builds the web UI (`npm run build-web` in `lazycat`)
- Runs `npx cap copy android` to copy web assets into the Android project
- Restores a keystore from the `KEYSTORE_BASE64` secret (base64 of the keystore file)
- Builds a signed AAB via Gradle using secrets for signing
- Uploads the AAB to the Play Console using `PLAY_SERVICE_ACCOUNT_JSON`

Secrets you must add to your repository (do NOT commit these files):

- `PLAY_SERVICE_ACCOUNT_JSON` — contents of the Google Play service account JSON (string)
- `KEYSTORE_BASE64` — base64 encoded keystore file (`lazycat.keystore`) or omit and place keystore manually
- `KEYSTORE_PASSWORD` — keystore password
- `KEY_ALIAS` — key alias (example: `lazycat`)
- `KEY_PASSWORD` — key password

Example: add secrets from your machine using the GitHub CLI:

```bash
gh secret set PLAY_SERVICE_ACCOUNT_JSON --body "$(cat service-account.json)"
base64 -w0 lazycat.keystore | gh secret set KEYSTORE_BASE64
gh secret set KEYSTORE_PASSWORD --body "your_store_password"
gh secret set KEY_ALIAS --body "lazycat"
gh secret set KEY_PASSWORD --body "your_key_password"
```

Notes:

- The workflow uploads to the `internal` track by default. Change `track` in the workflow if you want `alpha`/`beta`/`production`.
- Do NOT commit your keystore or the Play service JSON to the repo.
- If you prefer to manage the keystore manually, skip `KEYSTORE_BASE64` and ensure `lazycat/lazycat.keystore` exists before running the workflow.

If you want, I can also add a `signingConfigs` snippet to `lazycat/android/app/build.gradle`. Tell me if you want me to patch that file now.
