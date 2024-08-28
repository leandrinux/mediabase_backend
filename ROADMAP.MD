## To do

### Bugs 
* Photo DSC00074.JPG is dated 2008-5-28 but it should be March, not May

### Features
* Return photos by coordinate and zoom level
* Support for authentication using Javascript web tokens (JWTs)
    * Users table
* Add owner attribute to media, assigned with the current user id when media is uploaded
    * Users can only see the media they own
* Add hidden attribute (default is false)
    * Can only be changed by the owner
    * if true then this media is treated differently by the client, requiring a passcode or biometric authentication to become visible
* Add public attribute (default is false) 
    * if true then all users can see this media
    * if a user is not logged in, they can see all the public media

# Done

* 3GPP video format support
* Much improved messages and initialization
* Delete uploaded files that happened to be invalid
* Improve exiftool library to correctly extract the info in it.
* Add automatic year and month tags to media
* QR code detection support
* Uses proper mimetype with HEIC images
* Animated previews as mp4 (3 seconds long max, 5 fps) instead of gif
* When a tag count reaches zero it should be removed
* Delete tag
* Get animated preview for media
* Update routes to the form /media/id and /media/id/preview
* WEBP photo support
* HEIC photo support
* Support for video previews
* Identify photos from videos or others with a new field for media
* Rename thumbnails to previews
* Get media by tag names
* Migrate common.js to es6 modules
* When removing tag from media make sure that both the media and the tag exists
* Decrement tags when deleting media