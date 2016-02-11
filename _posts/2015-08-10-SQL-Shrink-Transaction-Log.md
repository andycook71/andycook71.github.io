---
layout: post
title: SQL 2014 Shrink Transaction Log
author: Andy
categories: work
tags:
- SQL
---

To quickly get rid of a large SQL transaction log typically when loading up a large production database for local use. Don't do this on a production server...

Substitute *MyDatabase* for the name of the database, and make sure *MyDatabase_Log* is the name of the log file.

``` sql 
USE MyDatabase;
GO
-- Truncate the log by changing the database recovery model to SIMPLE.
ALTER DATABASE MyDatabase
SET RECOVERY SIMPLE;
GO
-- Shrink the truncated log file to 1 MB.
DBCC SHRINKFILE (MyDatabase_Log, 1);
GO
-- Reset the database recovery model.
ALTER DATABASE MyDatabase
SET RECOVERY FULL;
GO
```