---
layout: post
title: PowerShell Octopus Deploy Snippets
author: Andy
categories: code
tags:
- PowerShell
- Octopus Deploy
---

Some useful snippets to execute in the Octopus Deploy script console.

``` powershell
# List files in a directory

Get-ChildItem -Path "C:\Temp\SomeDirectory" -File
```

``` powershell
# Display contents of a file

Get-Content "D:\Applications\Server\Application\Version\web.config"
```

``` powershell
# Update contents of web.config AppSetting

$webConfig = "D:\Applications\Server\Application\Version\web.config"
$doc = (Get-Content $webConfig) -as [Xml]
$obj = $doc.configuration.appSettings.add | where {$_.Key -eq 'SomeAppSettingKey'}
Write-Output $obj
#$obj.value = 'SomeNewValue'
#$doc.Save($webConfig)
```

``` powershell
# Show all the IIS bindings on a machine

Import-Module Webadministration
Get-ChildItem -Path IIS:\Sites
```

``` powershell
# Get DLL version info

Get-Item "D:\Applications\Server\Application\bin\SOME-DLL.dll" | Format-List -Property *version*
```

``` powershell
# Replace text in a file

$path = "D:\Applications\Server\Application\SOME-FILE.TXT"
(Get-Content $path) -replace 'GOOD', 'EVIL' | out-file $path 

```