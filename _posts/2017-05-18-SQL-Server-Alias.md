---
layout: post
title: SQL Server Alias
author: Andy
categories: sql
tags:
---

When working with SQL Server locally, it's often annoying when connection strings refer to a different instance name to the local instance:

``` xml
    <add name="CMSConnectionString" connectionString="Data Source=.\SOME_INSTANCE_NAME;Initial Catalog=DATABASE;Integrated Security=True" providerName="System.Data.SqlClient" />
```

We can make an alias from the instance name to whatever our local SQL Server is really called so we can not change the connection string.

Open SQL Server Configuration Manager:

```SQLServerManager13.msc``` for [SQL Server 2016] or<br/>
```SQLServerManager12.msc``` for [SQL Server 2014] or<br/>
```SQLServerManager11.msc``` for [SQL Server 2012] or<br/>
```SQLServerManager10.msc``` for [SQL Server 2008].

Add a new alias:

<img src="/images/2017-05-18-sql-alias1.png" />

The name of the server will be the name of the local machine.

<img src="/images/2017-05-18-sql-alias2.png" />

You should make the alias for the 32 bit and 64 bit configurations.

Make sure TCP protocol is enabled. Restarting the SQL service should make the change take effect.

Test this by connecting with SQL Server Management Studio as normal.

Or can be done with PowerShell:

``` powershell
$SQLAliasName = "ALIAS_NAME"
$sqlserver = "MACHINE_NAME\INSTANCE,1433" # Update as required. Change the port number if using a static custom port. If using a dynamic custom port, then remove the comma and port number - ,1433.
# This script creates a 64bit and 32bit SQL Alias on the server. Run this script on all servers in your SharePoint farm.
Write-Host “Creating x64 SQL Alias”
New-Item -path HKLM:SOFTWARE\Microsoft\MSSQLServer\Client\ConnectTo
New-ItemProperty HKLM:SOFTWARE\Microsoft\MSSQLServer\Client\ConnectTo -name $SQLAliasName -propertytype String -value "DBMSSOCN,$sqlserver"
Write-Host “Creating 32bit SQL Alias”
New-Item -path HKLM:SOFTWARE\Wow6432Node\Microsoft\MSSQLServer\Client\ConnectTo
Write-Host "Configured SQL Alias on the Server"
New-ItemProperty HKLM:SOFTWARE\Wow6432Node\Microsoft\MSSQLServer\Client\ConnectTo -name $SQLAliasName -propertytype String -value "DBMSSOCN,$sqlserver"
````
