# Toggle Optimizely Experiments - Chrome Extension

With this extension you can toggle Optimizely experiments on and off.
Also, you can inject custom values into the LocalStorage of the current page.
Build with [Plasmo](https://docs.plasmo.com/).

![image](./screenshot-extension.png)

## Installation

1. Download the latest [toggle-experiments-extension.zip](https://github.com/aaron5670/toggle-experiments-extension/releases) here.
2. Unzip the file and store it somewhere on your computer.
3Go in your (Chrome) browser to **chrome://extensions/**, enable **enable Developer Mode** and click on **Load unpacked**.
3. Upload the **toggle-experiments-extension** folder you just unzipped.
4. Enjoy! 🙂🧪

### Search for experiments
If you want to search for Optimizely experiments, you need a Personal Access Token from Optimizely.
You can find it in your [Optimizely account](https://app.optimizely.com/v2/profile/api).


---


## Development

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the Chrome browser,
using manifest v3, use: `build/chrome-mv3-dev`.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

### Load the Extension for Chrome (Chromium)
We plan to automate this in the future, but for the time being, these are the steps you need to take to load your extension in Chrome.

Head over to `chrome://extensions` and enable Developer Mode.

![](https://docs.plasmo.com/screenshots/developer_mode.png)

Click on "Load Unpacked" and navigate to your extension's `build/chrome-mv3-dev` (or `build/chrome-mv3-prod`) directory.

To see your popup, click on the puzzle piece icon on the Chrome toolbar, and click on your extension.

**Pro-tip:** pin your extension to the Chrome toolbar for easy access by clicking the pin button.

![](https://docs.plasmo.com/screenshots/popup_example.png)
