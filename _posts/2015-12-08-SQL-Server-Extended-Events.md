---
layout: post
title: SQL Server Extended Events
tags:
- SQL
---

SQL Server Extended Events are a new feature meant to replace tracing through the old Profiler tool.

This blog post has a nice rundown of how you can use the events to record when errors occur:

http://billfellows.blogspot.com.au/2015/08/tracking-bad-queries-aka-finally.html

The problem we are trying to solve is where one of the columns used by an insert/update is being passed a value that is too big. SQL returns an error:

`String or binary data would be truncated`

but this doesn't tell us which column is the problem. How to use extended events to also capture the parameter values used by the statements?

The key is to capture the rpc_completed event, applying appropriate filters to limit the amount of data captured.

Turns out ELMAH was actually capturing the data for us anyway, but good to know SQL Server can do it natively.

