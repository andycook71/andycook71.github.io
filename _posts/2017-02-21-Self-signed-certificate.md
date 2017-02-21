---
layout: post
title: Self Signed Certificate
author: Andy
categories: powershell
tags:
---

To create a self-signed certificate suitable for local HTTPS testing in PowerShell:

``` powershell
PS C:\Windows\system32> New-SelfSignedCertificate -DnsName dev-whatever.mydomain.com -CertStoreLocation cer
t:\LocalMachine\My
```