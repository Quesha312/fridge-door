# The Fridge Door

A family chore, allowance, and chat app — chores with star rewards, a
redeemable prize store, family chat with video calling, and real push
notifications. Runs as a website, an installed home-screen app, and a
native Android app.

---

## What it does

- **Board** — parents post chores (with a star value and optional photo-proof
  requirement) or pull from a built-in bank of common ones; kids claim open
  chores or get assigned ones, mark them done, parents approve and pay out
- **Daily quota** — parents set a minimum chores-per-day target; missing it
  gives a warning, missing it again auto-deducts stars
- **Late penalty** — chores marked done after a parent-set cutoff time
  (default 8:30pm) earn half stars when approved
- **Stars** — a leaderboard, plus each kid's own PIN-protected profile
- **Store** — parents stock a rewards shelf (screen time, pick dinner, etc.);
  kids redeem stars, parent confirms fulfillment
- **Chat** — family group chat, with notifications (badge, best-effort
  browser alert, and real push through the Android app) whenever someone
  sends a message, suggests a chore, finishes a chore, or gets one approved
- **Video calling** — tap someone's name to start a face-to-face call,
  device to device, no third-party service
- **Multiple families** — one deployed link supports any number of separate
  families, each with their own private code — perfect for sharing this
  project with relatives without mixing data
- **Custom backgrounds** — every parent and kid can pick their own theme,
  visible only to them

---

## One-time setup

### 1. Firebase (the syncing backend — free, no Blaze plan needed)
1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. **Build → Realtime Database → Create Database** → start in **test mode**
3. **Project settings → General → Your apps → add a Web app** → copy the
   `firebaseConfig` object it gives you
4. Paste those values into `firebaseConfig` near the top of the `<script>`
   tag in `family-board.html`

### 2. Host the file
Upload `family-board.html` somewhere with a real `https://` URL — GitHub
Pages is what this project has been using:
1. Create a repo on [github.com](https://github.com), upload the file
2. **Settings → Pages** → set Source to your main branch
3. Your link appears as `https://yourusername.github.io/reponame/`

*(This has to be a real hosted link — opening the raw file locally,
or from a Bluetooth/AirDrop transfer, will not work. The app needs to reach
Firebase over the internet every time it loads.)*

### 3. Create your family
Open the hosted link → **"Create our family"** → set your name and PIN →
you'll get a private family link/code. Send that to your kids (or, for a
second family like a sibling's, they tap "I'm a kid with a code" or create
their own family the same way — completely separate data, same app).

Each kid picks their own PIN the first time they tap their tile, so
siblings can't get into each other's profile. Each parent can also have
their own separate PIN via "New parent? Set up your own PIN."

---

## Real push notifications (optional, free, no Blaze)

Regular browser notifications only work while the tab/app is open or
backgrounded — for real notifications even when the app is fully closed,
see `apps-script-notifications/SETUP.md`. Short version: a free Google
Apps Script checks for new messages once a minute and sends a push
through Firebase Cloud Messaging directly — no credit card, no paid plan.

The `firebase-functions/` folder is an alternate, instant version of the
same thing, but requires Firebase's Blaze plan (a card on file, though
realistically $0/month) — only needed if the one-minute delay of the free
route ever bothers you.

---

## Installing as an app

**iPhone:** open the link in **Safari** (must be Safari) → Share button →
**Add to Home Screen**. Gives a full-screen icon, no browser bars.

**Android — easiest:** open the link in **Chrome** → menu (⋮) →
**Add to Home Screen**. Same result, and supports real push notifications
through the browser itself.

**Android — native app:** the `android-webview-app/` folder is a full
Android Studio / AndroidIDE project that wraps the site with:
- Firebase Cloud Messaging for guaranteed push notifications even when
  fully closed (works with the Apps Script above)
- Native camera/mic permission handling for video calls
- A JS bridge (`window.AndroidBridge`) that the web app calls automatically
  to subscribe to the right family's notifications

See `android-webview-app/README.md` for build steps. You'll need to:
1. Register an Android app in the same Firebase project
   (package name: `com.family.fridgedoor`) and drop the downloaded
   `google-services.json` into `android-webview-app/app/`
2. Set `APP_URL` in `MainActivity.kt` to your hosted link
3. Build with `gradlew assembleDebug`

*Known limitation:* video calling has been unreliable specifically inside
the custom Android WebView wrapper on some devices (a `NotReadableError`
on the microphone that doesn't happen in real Chrome) — if you hit this,
just use the Chrome/Add-to-Home-Screen version for calls, and the native
app for its stronger notification support. Two install methods, each
better at a different thing.

---

## Settings a parent can adjust

All under the **Settings** gear (parent mode only):
- Add/remove parents and kids, reset a forgotten kid PIN
- Daily chore quota + star penalty amount
- Late cutoff time (default 8:30pm)

---

## File overview

```
family-board.html              The entire app - one self-contained file
app-icon-512.png / -1024.png   App icon (for AppGeyser, Android, etc.)
android-webview-app/           Native Android project (Android Studio/AndroidIDE)
apps-script-notifications/     Free push notification setup (recommended)
firebase-functions/            Alternate instant push setup (needs Blaze plan)
```

## Known limitations, honestly

- Firebase's free "test mode" database rules mean anyone with your exact
  link/database URL could technically read or write your data — fine for
  a private family tool, just don't publish the link or Firebase config
  anywhere public.
- Notifications are only instant with the Apps Script if you don't mind a
  ~1 minute delay; the Blaze/Cloud Functions route is instant but needs a
  card on file (free at this scale, but Google requires it regardless).
- Video calling depends on both devices getting a decent connection to
  each other (or the free TURN relay it falls back to) — it isn't 100%
  guaranteed across every network, same as any consumer video call app.
