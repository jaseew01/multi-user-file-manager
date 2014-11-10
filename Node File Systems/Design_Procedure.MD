**Semantic Descriptors**
============================
Protocol Semantics: which HTTP requests a client will be making
Application Semantics: which bits of data will be sent back and forth
* file(s)
* file type
* file size
* number of files
* cummulative file size
* date added
* file name
* all file names

**State Diagram**
============================
----------------                ----------------------
|   **file**   |                |    **File List**   |
|    (type)    |      Item      |       (names)      | <------------
|    (size)    | <------------- |     (total size)   |
|	 (date)    |                |       (number)     |
|	 (name)    |                ----------------------
----------------                           ^
        |                                  |
        ------------------------------------
                    Collection

**Reconcile Names**
============================
Magic Strings: semantic descriptors and link relations
Item --> [RFC6573]
Collection --> [RFC6573]

**Media Type**
============================
Collection+JSON

**Profile**
============================
-Will explain the application semantics-
-Use ALPS documentation format to define semantics-

**What the file list will look like (initial GET)**
{
	files:
	[
		name:
		{
			date:"September 9, 2014",
			type:"jpeg",
			size:"12 MB",
			link:""
		},
		name:
		{
			date:"September 8, 2014",
			type:"txt",
			size:"10 KB",
			link:""
		}
	]
}

**What an individual file will look like (GET response content for individual file)**
{
	name:
	{
		date:"November 1, 2014",
		type:"png",
		size:"7 MB",
		link:""
	}
}

**HTTP Requests**
GET
	-Initial
		-Will return A list in the form of Collection+JSON that will contain each file.  Each object in that list will contain the following attributes:
			-name
			-size
			-date last edited/created
			-file type
	-Individual File
		-Will return the file object as shown in the list.  You will get back an object with the file name, date, size, and type.

HEAD
	-Will essentially be the same as the GET request, just without the content.

POST
	-Will be used to update an existing resource (file) on the server.  Some of the possible responses will be: 200(OK), 204(No Content).

PUT
	-Will be used to upload a new file to ther server, or replace an existing file with this new one.  Possible responses will be: 201(Created), 200(OK), 204(No Content), maybe 301(Moved Permanently) or 501(Not Implemented).

DELETE
	-Individual File
		-Will allow you to delete the specified file.  Responses will be 200(OK), 202(Accepted), 204(No Content), or 501(Not Implemented).




read more into http request types
	-RESTful_Web_Services.pdf
		-The Uniform Interfaced (pg. 245)
		-read back over safe vs. unsafe, idempotent vs. nonidempotent

searching - allow a way to search for files?  Specify how it will work.

Links/URLs - what format your urls will be in (what will get placed into the url)
	-Web services book will talk a lot about this (Look at Chs 4 and 5).
	-Look for naming conventions.
Server routes - how express will represent each http request.  How will the router direct the request to the correct method.

<!-- ALPS Profile -->
<alps>
	<descriptor id="file" type="semantic" href="">
		<descriptor id="type" type="semantic" href=""/>
		<descriptor id="size" type="semantic" href=""/>
		<descriptor id="date" type="semantic" href=""/>
		<descriptor id="name" type="semantic" href=""/>
	</descriptor>

	<descriptor id="File List" type="semantic" href="">
		<descriptor id="names" type="semantic" href=""/>
		<descriptor id="total size" type="semantic" href=""/>
		<descriptor id="number" type="semantic" href=""/>
	</descriptor>
</alps>
