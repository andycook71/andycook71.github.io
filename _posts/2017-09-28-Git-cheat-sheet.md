---
layout: post
title: Git cheat sheet
author: Andy
categories: git
tags:
---

### Move uncommitted changes to a new branch:
```
git stash
git stash branch new-branch
```

### Add a previously committed file to .gitignore
- Add the file to .gitignore then:
```
git rm --cached file1 file2 dir/file3
```

   
