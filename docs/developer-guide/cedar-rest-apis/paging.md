# Paging

A listing can hold more rows than one response should carry, so every CEDAR route that returns a
listing serves it a page at a time. The resource, artifact, messaging, monitor, bridge and terminology
servers all page the same way. A client asks for a page by its position, and the response says where
that page sits in the whole listing.

## Asking for a Page

A request names its page with two query parameters, or with two body fields on a POST route:

- `limit`: how many rows to return, from 1 to 500. A request that sends no limit gets 100.
- `offset`: how many rows to skip before the page starts. A request that sends no offset gets 0.

A limit above 500, or a negative offset, is refused with 400. The server does not reduce an oversized
limit to the maximum, so a client that asks for too much learns it at once rather than reading a short
page as the end of the listing.

For example, the third page of twenty templates in a folder is:

```bash
curl "$CEDAR_API/folders/<URL_ENCODED_FOLDER_ID>/contents?limit=20&offset=40" \
  -H "Authorization: apiKey $CEDAR_API_KEY"
```

CEDAR's terminology and authority routes once accepted a one-based `page` with `pageSize` or
`page_size`, and the bridge's name search accepted a zero-based `page` with `pageSize`. Those
parameters are withdrawn. A GET request that sends one is refused with 400, so a client written for
them stops at once instead of reading the first page again and again. A terminology POST body that
sends `page` 1 is still served, by its `limit` and `offset`, because published releases of the
embeddable editor send it. Any other `page` in a body is refused.

## Reading the Answer

Every page carries the same envelope beside its rows:

- `request`: the `limit` and `offset` the page was served at, after the defaults were applied.
- `totalCount`: how many rows the whole listing holds.
- `currentOffset`: the offset of the page's first row.
- `paging`: links to the `first`, `prev`, `next` and `last` pages, built from the request's own URL.
  A link is left out when there is no such page, so the absence of `next` marks the last page.

The rows themselves sit under a key that names what the listing holds, such as `resources` on the
resource server or `collection` on the terminology server. A client walks a listing by following
`paging.next` until it is absent, or by adding the number of rows it received to `currentOffset` and
asking again.

## Variations on the Envelope

Three kinds of listing answer a variation of the envelope, each because of something the listing
cannot provide.

**A POST route has no `paging` links.** The terminology server's integrated search, integrated
retrieve, versioned search and property search take their query in a request body, so there is no URL
a link could carry it in. The rest of the envelope is the same, and a client asks for the next page by
sending the next offset in a new body.

**A listing that cannot know its exact total answers `countCapped`.** Some listings cannot afford to
count every row, or read from a source that does not say how many it holds. Their `totalCount` is then
the number the listing reached, and the response carries `countCapped: true` and no `last` link. The
monitor's raw log rows, the bridge's ROR and NIH RePORTER searches, integrated search past its
1,000-result window and the terminology property hierarchies answer this way. A client reads such a
listing by following `next` rather than by computing the last page from the total.

**The bridge keys its rows by term IRI.** An authority search returns its rows under `results` as an
object keyed by each term's IRI, rather than as a list, because the embeddable editor looks a term up
by its IRI. The envelope beside them is the same.

## Walks That Use a Cursor

An offset tells the server how many rows to skip, so a deep page costs as much as every page before
it. Two listings are too large for that to be affordable, and page instead with a cursor that records
where the previous page ended. They are the stated exceptions to offset paging.

**Deep search on the resource server.** `/search-deep` can walk the whole repository. A client starts
a walk with `continuation=start`, and each page answers with a `continuation` token to send for the
next one. The token belongs to the user and the search that produced it. A token sent by another user,
or with a different query, is refused with 400. A walk may change its `limit` between pages.

**The monitor's raw log query.** `POST /logs/query` returns raw log rows newest first. When more rows
remain, the result carries a `nextCursor` in the form `<timestamp>,<id>`, which the client sends back
as `cursor` in its next query. A raw query may ask for up to 2,000 rows a page. A grouped query
returns its aggregate in one answer and takes no cursor.
