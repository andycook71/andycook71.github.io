---
layout: post
title: Network switching with Powershell
author: Andy
categories: powershell
tags:
---

Faced with a super-annoying network configuration where some tasks require being connected to a LAN with proxy configured, but most internet based tasks fail through the proxy. I have never met a proxy that made my life easier... PowerShell to the rescue!

### Disable wifi when the LAN is connected:

Save the following file as Disable-wifi.ps1:

``` powershell
# This will list the names of all your adapters:
# Get-NetAdapter | Format-Table Name, InterfaceDescription -Auto

$regKey="HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings"

if ((Get-NetAdapter -Name 'Local Area Connection').Status -ne 'Disconnected') 
{
    # Enable LAN
    Disable-NetAdapter -Name 'Wireless Network Connection' -confirm:$False -AsJob | Wait-Job
    # Enable proxy
    Set-ItemProperty -path $regKey ProxyEnable -value 1
}
```

Create a new scheduled task as follows:

<img src="/images/2018-03-20_wifi1.png" />

The key is to set the task to be triggered by a Windows event, in this case essentially "WLAN becoming operational". 

<img src="/images/2018-03-20_wifi2.png" />

And set the task to run our PowerShell script.

<img src="/images/2018-03-20_wifi3.png" />

### To enable wifi when the LAN is disconnected

Save the following file as Enable-wifi.ps1:

```
$regKey="HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings"

# Enable Wifi
Enable-NetAdapter -Name 'Wireless Network Connection' -confirm:$False
Set-ItemProperty -path $regKey ProxyEnable -value 0
```

Now create another scheduled task running the enable script.

<img src="/images/2018-03-20_wifi4.png" />

In this case the event code to trigger the script is different:

<img src="/images/2018-03-20_wifi5.png" />

And we have an additional condition before running to ensure the network adapter is available. Maybe this isn't always needed but seemed to make it more reliable:

<img src="/images/2018-03-20_wifi6.png" />

Less annoying mucking around with network connections = win!

