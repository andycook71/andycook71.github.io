---
layout: post
title: Microsoft Edge can't see localhost addresses
author: Andy
categories: code
tags:
---

Microsoft Edge is a universal app, and these are blocked from localhost (loopback) addresses. So 127.0.0.1 mapped addresses fail to read. Unfortunately this is how I always test web apps. To remove the restriction I launched a PowerShell console and used:

``` powershell 
CheckNetIsolation LoopbackExempt -a -n=Microsoft.MicrosoftEdge_8wekyb3d8bbwe
```

This is likely to be different in different builds, but got around the problem.

