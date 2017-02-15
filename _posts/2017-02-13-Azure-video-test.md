---
layout: post
title: Azure video test - Azure Media Player
author: Andy
categories: code
tags:
---

<link href="//amp.azure.net/libs/amp/1.8.1/skins/amp-default/azuremediaplayer.min.css" rel="stylesheet">
<script src="//amp.azure.net/libs/amp/1.8.1/azuremediaplayer.min.js"></script>
<!--Add the amp-ga plugin script-->
<script src="/js/amp-ga.min.js"></script>

<style>
	div > .azuremediaplayer {
		margin: 0 auto;
	}
</style>

This is using the Azure Media Player.

<div>
	<video id="azuremediaplayer" class="azuremediaplayer amp-default-skin amp-big-play-centered" tabindex="0"></video>
</div>

<script>
$(function() {
	var myOptions = {
		"nativeControlsForTouch": false,
		controls: true,
		autoplay: false,
		width: "640",
		height: "400",
		logo: { "enabled": false }, 
		techOrder: ["azureHtml5JS", "html5", "flashSS", "silverlightSS"],
		plugins: {
			ga: {
				'eventsToTrack': ['playerConfig', 'loaded', 'playTime', 'percentsPlayed', 'start', 'end', 'play', 'pause', 'error', 'buffering', 'fullscreen', 'seek', 'bitrate'],
				'debug': false
			}
		}
	}
	myPlayer = amp("azuremediaplayer", myOptions);
	myPlayer.src([
			{
					"src": "http://video.andycook.com/cd9b2438-f079-412c-b302-f50766d6a27f/Protest_videostabilization.ism/manifest",
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
