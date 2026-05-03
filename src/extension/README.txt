Copie Past-e Extension v1.3.1
================================

Thank you for using Copie Past-e - the cross-listing tool for online resellers.


INSTALLATION INSTRUCTIONS
--------------------------

1. DOWNLOAD
   Download the copie-paste-extension-v1.3.1.zip file from the Copie Past-e
   web app at /extension.

2. EXTRACT
   Extract / unzip the downloaded file.
   You will see a folder named "copie-paste-extension".

3. OPEN CHROME EXTENSIONS
   Open Google Chrome and navigate to:
   chrome://extensions

4. ENABLE DEVELOPER MODE
   In the top-right corner of the Extensions page,
   toggle ON "Developer mode".

5. LOAD UNPACKED
   Click the "Load unpacked" button that appears in the top-left.

6. SELECT FOLDER
   Browse to and select the extracted "copie-paste-extension" folder
   (the folder that contains manifest.json).

7. DONE!
   The Copie Past-e icon will appear in your Chrome toolbar.
   Click the pin icon to keep it visible.


HOW IT WORKS
------------

The extension autofills marketplace listing forms using your saved drafts.
You always click Submit yourself - the extension NEVER auto-submits forms.


SUPPORTED PLATFORMS
-------------------

  * Facebook Marketplace  (facebook.com/marketplace)
  * Mercari               (mercari.com)
  * eBay                  (ebay.com)
  * Poshmark              (poshmark.com)
  * Depop                 (depop.com)
  * Etsy                  (etsy.com)


USAGE
-----

1. Create a listing draft in the Copie Past-e web app.
2. Open the marketplace website where you want to list.
3. Navigate to the "Create Listing" or "Sell" page on that marketplace.
4. Click the Copie Past-e extension icon in your Chrome toolbar.
5. Your saved draft will be loaded automatically.
6. Click "Inject Data" to autofill the listing form fields.
7. Review the filled fields, make any adjustments, then submit.


TROUBLESHOOTING
---------------

- If fields are not filled:
    Refresh the marketplace page and try the injection again.
    Some platforms load content dynamically - wait a moment after page load.

- If the extension is not detected by the web app:
    Reload the Copie Past-e web app tab.
    Make sure the extension is enabled in chrome://extensions.

- If you see "Extension not found" errors:
    Try disabling and re-enabling the extension.
    Then reload the unpacked extension from chrome://extensions.

- For support: visit the Copie Past-e web app and use the Help/Support option.


VERSION HISTORY
---------------

v1.3.1  - Production release with all 6 platform support
          Updated detection handshake (EXTENSION_READY postMessage)
          window.__COPIE_PASTE_VERSION__ = '1.3.1'
          Event-driven DOM filling with retry logic
          Fixed icon paths to icons/ subdirectory for Chrome validation
          Added popup.css retro terminal UI

v1.3.0  - Added eBay, Poshmark, Depop, Etsy support
v1.2.0  - Added Mercari support
v1.1.0  - Initial Facebook Marketplace support


Built with Copie Past-e - cross-listing made simple.
Copyright 2026 Copie Past-e. All rights reserved.
