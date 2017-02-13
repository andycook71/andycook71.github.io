---
layout: post
title: Azure video test - Azure Media Player
author: Andy
categories: code
tags:
---

<link href="//amp.azure.net/libs/amp/1.8.0/skins/amp-default/azuremediaplayer.min.css" rel="stylesheet">
<script src="//amp.azure.net/libs/amp/1.8.0/azuremediaplayer.min.js"></script>

This is using the Azure Media Player.

<video id="azuremediaplayer" class="azuremediaplayer amp-default-skin amp-big-play-centered" tabindex="0"></video>

<script>
$(function() {
	var myOptions = {
		"nativeControlsForTouch": false,
		controls: true,
		autoplay: false,
		width: "640",
		height: "400",
		poster: "https://andycookreadify.blob.core.windows.net/asset-9898b21b-c000-4267-b74f-4ef8b6627d2c/Protest_000001.jpg?sv=2015-07-08&sr=c&si=9fbc2787-afe5-47a2-a5f2-23a48f14fc45&sig=uVOcPdAmOyntNpmV4A%2BMCRSZAQ0Hfy93ybLrsGoxQYk%3D&st=2017-02-13T04%3A14%3A07Z&se=2117-02-13T04%3A14%3A07Z"
	}
	myPlayer = amp("azuremediaplayer", myOptions);
	myPlayer.src([
			{
					"src": "http://andycookreadify.streaming.mediaservices.windows.net/cd9b2438-f079-412c-b302-f50766d6a27f/Protest_videostabilization.ism/manifest",
					"type": "application/vnd.ms-sstr+xml",
					"protectionInfo": [
							{
									"type": "PlayReady"
							},
							{
									"type": "Widevine"
							}
					]
			}
	]);
});

</script>