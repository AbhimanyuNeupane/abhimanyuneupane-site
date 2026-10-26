To use Microsoft Edge with CyberArk PSM, we need **Microsoft Edge (32-bit), version 103 or later**, which can be downloaded [here](https://www.microsoft.com/en-us/edge/business/download). The matching Edge WebDriver must also be up to date; download it [here](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/).

## 1. Add the Edge driver

Copy the downloaded `msedgedriver.exe` into the PSM Components folder:

```
C:\Program Files (x86)\CyberArk\PSM\Components
```

## 2. Update the Web App Dispatcher

Update the WebAppDispatcher to the latest version, which can be downloaded from the [CyberArk Marketplace](https://cyberark-customers.force.com/mplace/s/#a3550000000EiCMAA0-a3950000000jjUwAAI), and copy everything inside its `Components` folder to `C:\Program Files (x86)\CyberArk\PSM\Components`.

After updating the dispatcher, check that the browser driver versions inside that Components folder have been updated to the latest version.

## 3. Update AppLocker

Check the browser executable path in `PSMConfigureAppLocker.xml`, found in:

```
C:\Program Files (x86)\CyberArk\PSM\Hardening
```

*If the path is incorrect, insert the correct location of the executable.* Then run the `PSMConfigureAppLocker.ps1` script. After the script runs, all AppLocker rules are set to Enforce, so we need to change the AppLocker rule to Audit only.

## 4. Create the connection component

Create a new connection component for MS Edge and change the following parameters:

- **Target Settings → ClientApp →** `Edge`
- Create a new parameter under **Target Settings → Client Specific**:
  - **Name:** `BrowserPath`
  - **Value:** the location of the browser executable

We can now use Edge instead of Chrome.

> **Note:** On PSM version 12.2.0 the connection will fail because of a session-hijacking vulnerability fix, so update to 12.2.5. More information is in [CyberArk Security Bulletin CA22-03](https://cyberark-customers.force.com/s/article/Cyberark-Security-Bulletin-CA22-03).

Thank you.
