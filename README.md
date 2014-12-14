=======================
multi-user-file-manager Version 1.0.0 12/14/2014
=======================
**Description**

A simple API that will allow you to upload and retrieve files from a specified location.  It uses media type Collection+JSON in order to send the appropriate information back through the HTTP response.  It supports, uploading, retrieveing and deleting of files along with retreiving the entire list of files.  Server is written in node and data is stored in a sqlite database.  Server will write to a log file information about all requests that are made to that address.

=======================
**Command line arguments**

run server: node NodeServer.js

=======================
**File List**

fileCollection
NodeServer.js
package.json
logFile.json

=======================
**Requests/Url's**

-fileid is a space for the id of the file you are wanting to interact with-

GET
* /
* /file/fileid/html
* /file/fileid/json
* /file/fileid/download

POST
* /file-upload
	* Is expecting a form with some attached file in the HTTP POST
* /file/fileid/delete

HEAD
* /

=======================
**Response Outlines**

-These are example responses for a GET request to the specified url-

* '/': initialGET.txt
* '/file/fileid/html': filePage.txt
* '/file/fileid/json': singleFile.txt

=======================
**Database 'fileCollection'**

* written in sqlite
* contains single table 'collection'
	* Fields:
		* 'filename': TEXT
			* example entry: somefile
		* 'fileid': TEXT NOT NULL
			* example entry: 02d5c910-36ea-431c-8ee8-b3eb1c6c22ad
		* 'date': INTEGER
			* example entry: 12/10/2014
		* 'filetype': TEXT
			* example entry: txt
		* 'size': INTEGER
			* example entry (in bytes): 217
		* 'filedata': BLOB
			* example entry: this is some text
		* 'link': TEXT
			* example entry: /file/02d5c910-36ea-431c-8ee8-b3eb1c6c22ad/json