---
layout: post
title: TFS - Undo Unchanged Files
author: Andy
categories: tfs
tags:
---

Annoyingly, TFS has a habit of checking out a bunch of files that may have no changes to them. For example .aspx.designer.cs files when the only change is to the .aspx file.

TFS Power Tools has a command that lets you undo the checkout on all these files.

This solution won't help with reverting whitespace only changes (all the parenthesis have moved by one character - let's make a horrible diff).

Download the appropriate version of TFS Power Tools for your version of TFS. eg:

[TFS Power Tools 2015](https://marketplace.visualstudio.com/items?itemName=TFSPowerToolsTeam.MicrosoftVisualStudioTeamFoundationServer2015Power)

Then run the command:

```tfpt uu . /noget /recursive```

You should run this command inside the TFS checkout directory otherwise TFPT won't know which repository to connect to.

This post shows how to configure Visual Studio to have this as an easy menu command:

<http://stackoverflow.com/a/12294334/820344>

