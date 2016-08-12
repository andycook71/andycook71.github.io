---
layout: post
title: Cannot delete node_modules
author: Andy
categories: code
tags:
- node
---

Node likes to install stuff inside node_modules with stupidly nested folder structures containing dependencies of dependencies of dependencies. When trying to clean out these folders, Windows fails saying the directory structure is too deep / path is too long.

I've seen suggestions to use 7-zip file manager, Total Commander, various command lines. None worked for me.

I came across this post: [How to delete node_modules folder on Windows machine?](http://www.nikola-breznjak.com/blog/javascript/nodejs/how-to-delete-node_modules-folder-on-windows-machine/) but when I tried it, the command just sat there and did nothing. Steps to make it work are:

1. Command prompt as administrator
2. ```npm install rimraf -g```
3. Change to the directory *containing* node_modules
4. Ensure that no processes have a hold of the node_modules directory. This is the important step - Windows Explorer or anything else can't have a window open or it will be locked.
5. ```rimraf node_modules```



