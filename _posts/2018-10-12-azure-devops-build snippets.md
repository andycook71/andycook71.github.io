---
layout: post
title: Azure DevOps Build Snippets
author: Andy
categories: Azure
tags: azure,tfs
---

In starting to work with builds on Azure DevOps (the new incarnation of VSTS) I have found some snippets that have helped diagnose what is happening on the server of hosted builds.

```powershell
# List all the files in a directory
Get-ChildItem -Path . -File -Recurse -ErrorAction SilentlyContinue | Select-Object FullName
```

```powershell
# Print all the environment variables
Get-ChildItem Env: | Select-Object Key,Value
```
