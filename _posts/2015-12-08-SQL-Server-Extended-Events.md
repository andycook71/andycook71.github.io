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

The key is to capture the rpc_completed event, applying appropriate filters to limit the amount of data captured:

``` sql
-- Create the Session

CREATE EVENT SESSION [StatementLogger] ON SERVER
ADD EVENT sqlserver.rpc_completed (
    ACTION ( package0.last_error, sqlserver.database_id,
    sqlserver.database_name, sqlserver.sql_text, sqlserver.username )
    WHERE ( [sqlserver].[database_name] = 'DATABASE NAME' 
        AND [statement] LIKE '%SOME FILTER VALUE%' ) )
WITH ( MAX_MEMORY = 4096 KB ,
        EVENT_RETENTION_MODE = ALLOW_SINGLE_EVENT_LOSS ,
        MAX_DISPATCH_LATENCY = 30 SECONDS ,
        MAX_EVENT_SIZE = 0 KB ,
        MEMORY_PARTITION_MODE = NONE ,
        TRACK_CAUSALITY = OFF ,
        STARTUP_STATE = OFF )
GO

ALTER EVENT SESSION [StatementLogger] ON SERVER STATE = START;

-- Drop the session

-- DROP EVENT SESSION [StatementLogger] ON SERVER 
```

You can watch the events happen in SSMS:

<img src="/images/2015-12-08-sql-extended-events.png" />

or save them to an XML file like Bill Fellows does in his blog post link above.

Turns out ELMAH was actually capturing the data for us anyway, but good to know SQL Server can do it natively.

