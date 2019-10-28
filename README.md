# WayFarer+
A Chromium extension to add more functionality to NianticLab's Wayfarer

Changelog
---
1.8:
- Added S2 Cell support to Nominations and Review (new and edit)
- Compact Card View (for low-res devices or better overview on high-res) by @GoncaloCdM
- Current location is marked during location edit review
- Map buttons are always present during edit review (including edits with no location edit)
- Made translation buttons clearer and smaller
- First option in duplicates is autoselected
- Duplicates can now be done with keyboard (if it's the autoselected one)
- Made settings more understandable by adding addition info where possibly needed
- Duplicate strip can now be scrolled through using the scroll wheel
- Extended Nomination stats are now more accurate, taking withdrawls into account (which according to niantic should grant you a nomination back if you withdraw it in the 13 day period)
- Improvements and fixes to Dark Mode

1.7.2
- Map buttons are now an option for the review page as well
- Edit agreements on profile has been changed to Other agreements as my assumtions seem to have been wrong, and there is no clear origin for these agreements.

1.7.1:
- More advanced Nominations stat widget. Now displays upcomming dates on which new Nominations will unlock.
- Google Maps and Itel Map buttons added to Nominations page
- Progress percentage next to user icon in header added
- Description in a review can be clicked to google it like the title is by default
- Lat Long coordinates now displayed above the map on Nominations page
- Small fixes to the Dark Theme on the Nominations page

1.7:
- Added reviewing with the keyboard (including numpad). Press the number corresponding to the star rating. Use the arrow keys to naviaget manually between the options. Press enter to submit and to continue to the next review. Use backspace to go back in rejction menus or go home after finishing a review.
- 20m and 40m circles are now also available for the nominations page
- Default zoom level for the "Location Accuracy" map now configurable in settings. A more zoomed in map can be useful when using the keyboard to review to avoid having to use the mouse to zoom in, which is often needed.
- Improved settings backend, should solve a bug in previous versions when updating to a version with new settings.

1.6.1
- Fixes #6 #7 and #8
- Removes any libary from being required (result: smaller file size, possibly better performace but only extremly slight)
- Further improvements to the Dark Mode

1.6:
- Ctrl-less zooming on maps (review, nominations)
- Made translation buttons less ambiguous. Should no longer be confused with emoji in description or title! Fixes #5
- Settings pop-up now looks in style with settings from Wayfarer (Dark Mode)
- Map circles improvements. Map resets now retain the circles!
- Small general code improvements

1.5:
- Added 20m and 40m circles to both map views on the review page. These allow you to see if other portals are too close, and from what area players of Ingress, Wizards Unite and Pokemon Go can access the PoI (if it were to appear in those games)
- Extended profile stats have been added. Now adds total agreement count and edit agreement count.
- Added translation buttons to review page. Allows you to quickly go to Google Translate and translate the Title, Description or supporting statement of a nomination.
- Some more Dark Theme fixes were implemented.

1.4:
- Added nomination page stats widget. See how many nominations you have accepted, rejected, in queue, in voting etc. This widget also allows you to see how many nominations you can still make (in Ingress Prime ONLY currently) and how many days until new nominations become available to you.
- Fixed Dark Theme issue in nominations page (sort order arrow was invisable)

1.3:
- Added customizability, any WayFarer+ function or modification can now be turned on or off!
- Minor tweaks and improvements to the Dark Theme

1.2:
- Added warning when reviewing when a Wayspot candidate is too close to an already existing Wayspot to ever go live in any current Niantic game.
- Minor tweaks and improvements to the Dark Theme

1.1.1:
- Added review timer to review page. Let's the user know how much time they have left before Wayfarer no longer allows you to review the nomination.

1.1:
- Added StreetView review preview to Nominations page. 

1.0 - 1.0.2:
- Initial releases. 
- Basic Dark Theme was implemented.
