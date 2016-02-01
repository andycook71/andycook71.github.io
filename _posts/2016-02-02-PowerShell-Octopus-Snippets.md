---
layout: post
title: PowerShell Octopus Deploy Snippets
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
