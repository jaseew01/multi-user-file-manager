<h1>Chapters 1-4 Notes</h1>

1) What does REST mean in simple terms?

REST is a set of guidlines used to create web services.

2) What are some key REST principles/properties/terms?

	* HTTP - Hypertext Transfer Protocol; It is the protocol used to transfer hypertext documents over the internet.

	* HyperMedia - Connects resources to each other, and describes their capabilities in machine-readable ways.  Some example of HyperMedia within HTML are links, images, and forms

	* URL - Used to identify the location of a specific resource

	* URI - Also used to identify the location of a specific resource.  All URLS are URIS, but not all URIS are URLS.

3) Why have REST and HTTP become such dominant technologies?

HTTP, today, and in the 90's provides/provided a way to GET resources fairly easy from a server.  REST has become big, because it provides a sense of accuracy between web services such as apis.

4) What are differences between REST and HTTP?

HTTP is a protocol while REST is more of a format.

5) What are the HTTP verbs and how is each used?

	* GET: Get a representation of a resource.
	* DELETE: Destroy the resource.
	* POST: Create a new resource underneath this one, based on the given representation.
	* PUT: Replace this state of this resource with the one described in the given representation.
	* HEAD: Get the headers that would be sent along with a representation of this resource, but not the representation itself.
	* OPTIONS: Discover which HTTP methods this resource responds to.
	* PATCH: Modify part of the state of this resource based on the given representation.  If some bit of resource state is not mentioned in the given representation, leave it alone.  PATCH is like put, but allows for fine-grained changes to resource state.
	* LINK: Connect some other resource to this one.
	* UNLINK: Destroy the connection between some other resource and this one.

6) What are standard HTTP response codes and when is each used?

	* 200 - When everything was found and retrieved correctly from the server.
	* 303 - Means see other, and will automatically direct your browser to another location.
	* 404 - When a resource can't be found on the server.

7) What are standard HTTP tags and what are they used for?

	* Content-Type: what kind of document the http response contains.
	* Content-Length: how many bytes the document is.
	* Date: when the document was received.
	* Last-Modified: when the document was last updated.
