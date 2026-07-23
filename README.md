# The Fridge Door

A family chore, allowance, and chat app — chores with star rewards, a
redeemable prize store, family chat with video calling, and real push
notifications.

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
- **Chat** — family group chat with notifications for new messages, chore
  suggestions, completions, and approvals
- **Video calling** — tap someone's name to start a face-to-face call
- **Multiple families** — one link supports any number of totally separate
  families, each with their own private code
- **Custom backgrounds** — every parent and kid can pick their own theme

---

## Using it (this is all 99% of people ever need to read)

1. Open the link you were sent
2. Tap **"Create our family"** if this is a brand new, separate family
   (like a sibling wanting their own independent version), or **"I'm a kid
   with a code"** if someone gave you a code to join their family
3. Pick your name, set a PIN — that's it

**Want it as an app instead of a browser tab?**
- **iPhone:** open the link in **Safari** → Share button → **Add to Home
  Screen**
- **Android:** open the link in **Chrome** → menu (⋮) → **Add to Home
  Screen**
- **Android, alternative:** if a `.apk` file was built for this app, just
  install that file directly — nothing to set up, it's a finished app

Nothing past this point applies to you unless you're the one maintaining
the deployment itself.

---

## Everything below is one-time, deployer-only, and already done

This is reference material for whoever set this up (or future-you, six
months from now, wondering how any of this works) — not instructions
anyone joining a family needs to follow.

### Firebase (the syncing backend — free, no Blaze plan needed)
1. Create a project at console.firebase.google.com
2. **Build → Realtime Database → Create Database** → test mode
3. **Project settings → Your apps → add a Web app** → copy the
   `firebaseConfig` object
4. Paste those values into `firebaseConfig` near the top of
   `family-board.html`

### Hosting
Upload `family-board.html` somewhere with a real `https://` URL (this
project uses GitHub Pages: create a repo, upload the file, **Settings →
Pages** → set Source to main branch). Has to be a real hosted link —
a local file or one sent via Bluetooth/AirDrop won't work, since the app
needs to reach Firebase over the internet every time it loads.

### Real push notifications (optional, free, no Blaze)
Regular browser notifications only work while the app is open or
backgrounded. For real notifications even when fully closed, see
`apps-script-notifications/SETUP.md` — a free Google Apps Script checks
for new messages once a minute and pushes through Firebase Cloud
Messaging, no card needed. This is set up **once** and automatically
covers every family using this deployment, not just one.

`firebase-functions/` is an alternate, instant version of the same thing,
but requires Firebase's Blaze plan (a card on file, though realistically
$0/month at this scale) — only worth it if the Apps Script's ~1 minute
delay bothers you.

### Building the native Android app
`android-webview-app/` is a full Android Studio / AndroidIDE project that
wraps the site with real push notifications (even fully closed) and
native camera/mic permission handling for calls. See
`android-webview-app/README.md` for the build steps. Once built, the
resulting `.apk` file is what gets shared with family members to install
— they never touch the project itself.

*Known limitation:* video calling has been unreliable specifically inside
the custom Android WebView wrapper on some devices (a `NotReadableError`
on the microphone that doesn't happen in real Chrome). If that happens,
use the Chrome/Add-to-Home-Screen install for calls, and the native app
for its stronger notification support — two install methods, each better
at a different thing.

### Settings a parent can adjust
Under the Settings gear (parent mode only): add/remove parents and kids,
reset a forgotten kid PIN, daily chore quota + star penalty, late cutoff
time.

### File overview
```
family-board.html              The entire app - one self-contained file
app-icon-512.png / -1024.png   App icon
android-webview-app/           Native Android project
apps-script-notifications/     Free push notification setup (recommended)
firebase-functions/            Alternate instant push setup (needs Blaze)
```

### Known limitations, honestly
- Firebase's free test-mode database rules mean anyone with the exact
  link/database URL could technically read or write the data — fine for
  a private family tool, just don't publish the link or Firebase config
  publicly.
- The free notification route has a ~1 minute delay; the instant route
  needs a card on file (still free at this scale).
- Video calling depends on both devices reaching each other (or the free
  relay it falls back to) — not 100% guaranteed on every network, same as
  any consumer video call app.
