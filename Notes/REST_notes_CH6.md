<h1>Chapter 6 Notes</h1>

A collection resource has its own URL (because it is a resource) and it is a collection of other resources.  It contains links to other resources or items.

<h3>Colletction Based API HTTP Request types:</h3>
	* GET: Serves a representation of the collection.
	* POST-to-Append: Creates a new resource
	* PUT and PATCH: Collection+JSON, AtomPub, and OData all define PUT as a way to edit the state of existing items within the collection.
	* DELETE: Will delete the collection

You add an item to a collection by sending a POST to that collection as suggested by the template property.

Pagination- Is giving the server the ability to return only the first 10 items in the collection and give the client a link to the rest.


<h3>There are four standards for collection based API'S:</h3>

1. Collection+JSON
	* Is a standard for how to transport a collection of JSON objects
	* Each member is represented as a JSON object
	* This document will contain 5 properties:
		* href: A permanent link to the collection itself.
		* items: Links to the members of the collection, and partial representations of them.
		Is a JSON object containing a list of JSON objects that have the following attributes:
			* href: A permanent link to the item as a standalone resource.
			* links: Hypermedia links to other resources related to the item.
			* data: Any other information that’s an important part of the item’s representation.
		* links: Links to other resources related to the collection.
		* queries: Hypermedia controls for searching the collection.
		Useful when you have a large collection of JSON objects.  Rather than having to GET all of them, you may use this to filter out your GET request.
		* templates: A hypermedia control for adding a new item to the collection.
		Used as a guidline to show how to add a new item to the collection.

2. Atom Publishing Protocol (AtomPub)
	* Is the original standard for collection based API'S
	* Has an XML-based format
	* Has the same concepts as Collection+JSON, but uses different terminology. Instead of a “collection” that contains “items”, this is a “feed” that contains
	“entries.”
	* Every entry in an AtomPub feed must have a unique ID, a title, and the date and time it was published or last updated.

3. OData
	* Is the third major standardization of the collection pattern
	* Was originally based off of AtomPub but uses JSON representation

4. HYDRA Standard
