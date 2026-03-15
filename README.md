# ClearDMs
A plugin for [Vencord](https://github.com/Vencord/Vencord) that lets you **delete all your sent messages** in a DM conversation with a single click.

---

## Features

* Adds a **Clear DM** button to the right-click context menu on any user.
* Automatically fetches **all your messages** in the conversation (no limit).
* Deletes them one by one with a **1.5 second delay** to avoid rate limits.
* Toast notifications to keep you informed of the progress.
* Option to only delete **your own messages** (enabled by default).
* Configurable delay between deletions.

---

## Installation

### Prerequisites

Before installing custom plugins, ensure:

* You have a working **Vencord development build**, including installing from source with `git`, `Node.js`, and `pnpm` installed.
* You've cloned the Vencord repository, installed dependencies via `pnpm install --frozen-lockfile`, then built (`pnpm build`) and injected (`pnpm inject`) it.

### Adding Custom ("User") Plugins

1. **Create the `userplugins` directory**:
   Inside your Vencord project folder, navigate to `src/` and create a new folder named `userplugins`.

2. **Add your plugin**:
   Copy the `ClearDMs` plugin into `src/userplugins/`. It can be either:
   * A single file:
     ```
     src/userplugins/ClearDMs.tsx
     ```
   * Or a folder with an `index.tsx` entry:
     ```
     src/userplugins/clearDMs/index.tsx
     ```

3. **Rebuild Vencord**:
   After placing the plugin file or folder, run:
   ```
   pnpm build
   ```
   Restart Discord afterward — your plugin should now appear under the Vencord Plugins list.

---

## Usage

* Open Discord with Vencord loaded.
* Navigate to **User Settings → Vencord → Plugins**.
* Find **ClearDMs** in the list and turn the toggle **on**.
* Right-click any user in your DMs list.
* Click **Clear DM** — the plugin will fetch and delete all your messages automatically.

---

## Settings

| Setting | Description | Default |
| ------- | ----------- | ------- |
| `deleteDelay` | Delay in milliseconds between each deletion | `1500` |
| `onlySelf` | Only delete your own messages | `true` |

---

## Disclaimer

This plugin is strictly for **personal use** only.
Deleting messages is irreversible. Use responsibly.

---

## Author

* **cuteskid**
