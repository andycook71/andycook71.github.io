---
layout: post
title: Missing Microsoft.Web.Infrastructure DLL after CI build
author: Andy
categories: .NET
tags:
---

I have a web application with several projects that has a dependency on Microsoft.Web.Infrastructure. It builds fine locally, and that DLL appears in the bin directory as required.

However when building on the TFS build server, that DLL is not present in the drop folder, therefore not deployed so the app crashes on startup:

```
Exception information: 
Exception type: InvalidOperationException 
Exception message: The pre-application start initialization method Start on type System.Web.Optimization.PreApplicationStartCode threw an exception with the following error message: Could not load file or assembly 'Microsoft.Web.Infrastructure, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35' or one of its dependencies. The system cannot find the file specified..
```

Based on this post: https://stackoverflow.com/a/44459015/820344
it appears that hacking the project file references as follows fixes the issue:

```
<Reference Include="Microsoft.Web.Infrastructure, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, processorArchitecture=MSIL">
    <HintPath>..\packages\Microsoft.Web.Infrastructure.1.0.0.0\lib\net40\Microsoft.Web.Infrastructure.dll</HintPath>
    <EmbedInteropTypes>False</EmbedInteropTypes> <!-- MAKE SURE THIS LINE IS PRESENT -->
    <Private>True</Private> <!-- MAKE SURE THIS LINE IS PRESENT -->
</Reference>
```
