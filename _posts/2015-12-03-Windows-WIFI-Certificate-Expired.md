---
layout: post
title: Windows 8 or 10 can't connect to WIFI with expired certificate
tags:
- Windows
---

Got burned again by an internal WIFI network with a self-signed certificate that had expired.

Like Windows 8, Windows 10 just gives you a stupid message that doesn't help:

In Windows 7 and previous you could change these settings from the GUI but apparently has been removed.

The fix is with command line. To how all wireless profiles on the PC:

`netsh wlan show profiles`
 
Then to delete a profile:

`netsh wlan delete profile name="ProfileName"`

Then re-add the profile again through the normal means.

