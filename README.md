#iOS Simulator#

###A 100% JS based iOS simulator for Cordova apps or mobile HTML pages.###

Completely client side code that can be placed on ANY website running with ANY framework on ANY server using ANY server side language.

***Need support? Create an issue, we will help!***

##Current Version##

**1.0.0 (beta)**

* Simulator is now functional, though very limited. 
* Cordova commands are not yet supported - Recommend to refactor app code to use non-cordova versions where possible. (ex. change `navigator.notification.alert();` to `alert();`) Future plans are to create a simulator version of cordova.js to map these commands for the simulator. Is currently necessary to change `document.addEventListener('deviceready', function ()[], false);` to `document.addEventListener("DOMContentLoaded", function () {}, false);` or the jquery `$(document).ready(function () {});`.
* A maximum of 20 apps are supported at the moment.
* Read the HowTo below for instructions on using the mobile simulator
* See the list of requested features and contribute

##How To##

1. Create a folder in the *apps* folder and move your project/app/mobile site files into that folder.
2. Customize **config.xml** with your configuration settings
 
		<simulator version="1.0.0">
			<background>
				<color>red</color> <!-- The color you want the background of the home page to be -->
				<image>/img/bg.png</image> <!-- A background image for the home page, setting this will overrite the color setting above-->
			</background>
			<apps>
				<app>
					<title>My App 1</title> <!-- The text you would like to show up under the app icon -->
					<icon>/apps/MyApp1/icon.png</icon> <!-- relative url to the icon for the app -->
					<index>/apps/MyApp1/index.html</index> <!-- relative url to the index or home page for the app -->
				</app>
				<app>
					<title>My App 2</title>
					<icon>/apps/MyApp2/icon.png</icon>
					<index>/apps/MyApp2/index.html</index>
				</app>
			</apps>
		</simulator>


3. If using cordova change `document.addEventListener('deviceready', function (){}, false);` to `document.addEventListener("DOMContentLoaded", function () {}, false);` or the jquery `$(document).ready(function () {});`.

##Feature Requests##

* Top bar for home screen showing current time and other simulated data.
* Scrolling or paging for home screen
* General animations to mimic iPhone behavior and appearance.
* Installer app embedded in the simulator (but optional through config settings) to open a 'settings' like page that will allow setting up of the config.xml file through a simple UI.
* More customization items in the config.xml
* Creation of a cordova.js for the simulator that maps the cordova functions to browser native functions, or trigger an iPhone simulation of the function (Ex: using `navigator.notification.alert()` shows an iPhone simulated and styled popup in the simulator screen.) *This file would replace the cordova-x.x.x.js files in the individual projects*
* Feedback app embedded in the simulator (but optional through config settings) to provide feedback about the apps to the developer.

**PLEASE contribute by helping with these features or any others improvements by using pull requests**

*Note to developers:*

Please use the simulator.less file for all css changes, then regenerate the simulator.css file. DO NOT make any manual changes to the simulator.css file, they will be rejected and overritten. If you are unfamiliar with LESS check out [lesscss.org](http://lesscss.org). (It is very easy to learn, and helps a lot with team development)

##Project Mission##
 
The mission of this project is to create an iPhone looking and feeling home screen with automatically populated icons that open to a simulated version of the app. *This app should NOT be used for testing your products, but as an interactive display to demo your app for customers, clients, friends, or other developers.*
