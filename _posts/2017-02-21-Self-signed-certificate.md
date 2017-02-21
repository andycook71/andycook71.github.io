---
layout: post
title: Self Signed Certificate
author: Andy
categories: powershell
tags:
---

To create a self-signed certificate suitable for local HTTPS testing in PowerShell:

``` powershell
PS C:\Windows\system32> New-SelfSignedCertificate -DnsName dev-whatever.mydomain.com -CertStoreLocation cert:\LocalMachine\My
```

Then to use it from IIS just create the HTTPS binding and add the certificate in the drop down in the binding dialog.