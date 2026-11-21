---
title: CS732 Project API
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - javascript--nodejs: Node.JS
  - ruby: Ruby
  - python: Python
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<h1 id="cs732-project-api">CS732 Project API v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

API documentation for the CS732 project

Base URLs:

* <a href="http://localhost:3001">http://localhost:3001</a>

<h1 id="cs732-project-api-journeyalbum">JourneyAlbum</h1>

## get__api_maps_{map_id}_pins_{pin_id}_albums_{id}

`GET /api/maps/{map_id}/pins/{pin_id}/albums/{id}`

*Get a single journey album by ID*

Retrieve a specific journey album by its ID. Only the owner of the album can access it.

<h3 id="get__api_maps_{map_id}_pins_{pin_id}_albums_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|map_id|path|string|true|The ID of the map.|
|pin_id|path|string|true|The ID of the map pin.|
|id|path|string|true|The ID of the journey album.|

> Example responses

> 200 Response

```json
{
  "journeyAlbum": null
}
```

<h3 id="get__api_maps_{map_id}_pins_{pin_id}_albums_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Journey album retrieved successfully.|Inline|

<h3 id="get__api_maps_{map_id}_pins_{pin_id}_albums_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» journeyAlbum|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## put__api_maps_{map_id}_pins_{pin_id}_albums_{id}

`PUT /api/maps/{map_id}/pins/{pin_id}/albums/{id}`

*Update a journey album by ID*

Update the details of a specific journey album. Only the owner of the album can update it.

> Body parameter

```json
{
  "name": "string",
  "images": [
    {
      "key": "string"
    }
  ]
}
```

<h3 id="put__api_maps_{map_id}_pins_{pin_id}_albums_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|map_id|path|string|true|The ID of the map.|
|pin_id|path|string|true|The ID of the map pin.|
|id|path|string|true|The ID of the journey album.|
|body|body|object|true|none|
|» name|body|string|false|The album's name.|
|» images|body|[object]|false|none|
|»» key|body|string|false|The key of the image.|

> Example responses

> 200 Response

```json
{
  "journeyAlbum": null
}
```

<h3 id="put__api_maps_{map_id}_pins_{pin_id}_albums_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Journey album updated successfully.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid input or validation error.|None|

<h3 id="put__api_maps_{map_id}_pins_{pin_id}_albums_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» journeyAlbum|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## delete__api_maps_{map_id}_pins_{pin_id}_albums_{id}

`DELETE /api/maps/{map_id}/pins/{pin_id}/albums/{id}`

*Delete a journey album by ID*

Delete a specific journey album. Only the owner of the album can delete it.

<h3 id="delete__api_maps_{map_id}_pins_{pin_id}_albums_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|map_id|path|string|true|The ID of the map.|
|pin_id|path|string|true|The ID of the map pin.|
|id|path|string|true|The ID of the journey album.|

> Example responses

> 200 Response

```json
{
  "message": "Journey album deleted successfully."
}
```

<h3 id="delete__api_maps_{map_id}_pins_{pin_id}_albums_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Journey album deleted successfully.|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized access.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Journey album not found.|None|

<h3 id="delete__api_maps_{map_id}_pins_{pin_id}_albums_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_maps_{map_id}_pins_{pin_id}_albums

`POST /api/maps/{map_id}/pins/{pin_id}/albums`

*Create a new journey album*

Create a new journey album for a specific map pin. Only the authenticated user can create an album.

> Body parameter

```json
{
  "name": "string",
  "images": [
    {
      "key": "string"
    }
  ]
}
```

<h3 id="post__api_maps_{map_id}_pins_{pin_id}_albums-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|map_id|path|string|true|The ID of the map.|
|pin_id|path|string|true|The ID of the map pin.|
|body|body|object|true|none|
|» name|body|string|false|The album's name.|
|» images|body|[object]|false|none|
|»» key|body|string|false|The key of the image.|

> Example responses

> 201 Response

```json
{
  "journeyAlbum": null
}
```

<h3 id="post__api_maps_{map_id}_pins_{pin_id}_albums-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Journey album created successfully.|Inline|

<h3 id="post__api_maps_{map_id}_pins_{pin_id}_albums-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» journeyAlbum|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_maps_{map_id}_pins_{pin_id}_albums

`GET /api/maps/{map_id}/pins/{pin_id}/albums`

*Get all journey albums for a specific map pin*

Retrieve all journey albums associated with a specific map pin. Only the owner of the albums can access them.

<h3 id="get__api_maps_{map_id}_pins_{pin_id}_albums-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|map_id|path|string|true|The ID of the map.|
|pin_id|path|string|true|The ID of the map pin.|

> Example responses

> 200 Response

```json
{
  "journeyAlbums": [
    {
      "id": "string",
      "name": "string",
      "images": [
        {
          "key": "string"
        }
      ],
      "map_pin_id": "string",
      "map_id": "string",
      "user_id": "string",
      "created_at": "2019-08-24T14:15:22Z",
      "updated_at": "2019-08-24T14:15:22Z"
    }
  ]
}
```

<h3 id="get__api_maps_{map_id}_pins_{pin_id}_albums-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Journey albums retrieved successfully.|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized access.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|No journey albums found for the specified map pin.|None|

<h3 id="get__api_maps_{map_id}_pins_{pin_id}_albums-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» journeyAlbums|[object]|false|none|none|
|»» id|string|false|none|The ID of the journey album.|
|»» name|string|false|none|The name of the journey album.|
|»» images|[object]|false|none|An array of images associated with the journey album.|
|»»» key|string|false|none|The key of the image.|
|»» map_pin_id|string|false|none|The ID of the associated map pin.|
|»» map_id|string|false|none|The ID of the associated map.|
|»» user_id|string|false|none|The ID of the user who created the journey album.|
|»» created_at|string(date-time)|false|none|The timestamp when the journey album was created.|
|»» updated_at|string(date-time)|false|none|The timestamp when the journey album was last updated.|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="cs732-project-api-map">Map</h1>

## post__api_maps

`POST /api/maps`

*Create a new map*

Create a new map owned by the authenticated user.

> Body parameter

```json
{
  "name": "My Map",
  "description": "This is my personal map."
}
```

<h3 id="post__api_maps-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|false|The name of the map.|
|» description|body|string|false|A description of the map.|

> Example responses

> 201 Response

```json
{
  "map": null
}
```

<h3 id="post__api_maps-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Map created successfully.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid input or validation error.|None|

<h3 id="post__api_maps-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» map|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_maps

`GET /api/maps`

*Get all maps for the current user*

Retrieve all maps where the authenticated user is the owner or a collaborator.

> Example responses

> 200 Response

```json
[]
```

<h3 id="get__api_maps-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|A list of maps where the user is the owner or a collaborator.|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized access.|None|

<h3 id="get__api_maps-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## put__api_maps_{id}

`PUT /api/maps/{id}`

*Update a map by ID*

Update the name or description of a specific map owned by the authenticated user.

> Body parameter

```json
{
  "name": "string",
  "description": "string"
}
```

<h3 id="put__api_maps_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|The ID of the map to update.|
|body|body|object|true|none|
|» name|body|string|false|The new name of the map.|
|» description|body|string|false|The new description of the map.|

> Example responses

<h3 id="put__api_maps_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Map updated successfully.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid input or validation error.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Map not found.|None|

<h3 id="put__api_maps_{id}-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## delete__api_maps_{id}

`DELETE /api/maps/{id}`

*Delete a map by ID*

Delete a specific map owned by the authenticated user. Ensures the user has at least one private map remaining.

<h3 id="delete__api_maps_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|The ID of the map to delete.|

> Example responses

> 200 Response

```json
{
  "message": "Map deleted successfully."
}
```

<h3 id="delete__api_maps_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Map deleted successfully.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid input or validation error.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Map not found.|None|

<h3 id="delete__api_maps_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="cs732-project-api-mappins">MapPins</h1>

## post__api_maps_{map_id}_pins

`POST /api/maps/{map_id}/pins`

*Create a new map pin*

> Body parameter

```json
{
  "geo_location": {
    "lat": -36.8485,
    "lng": 174.7633
  },
  "country": "New Zealand",
  "city": "Auckland"
}
```

<h3 id="post__api_maps_{map_id}_pins-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|map_id|path|string|true|The ID of the map|
|body|body|object|true|none|
|» geo_location|body|object|true|none|
|»» lat|body|number|true|none|
|»» lng|body|number|true|none|
|» country|body|string|false|none|
|» city|body|string|false|none|

> Example responses

> 201 Response

```json
{
  "mapPin": null
}
```

<h3 id="post__api_maps_{map_id}_pins-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Map pin created successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Resource not found|None|

<h3 id="post__api_maps_{map_id}_pins-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» mapPin|any|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## get__api_maps_{map_id}_pins

`GET /api/maps/{map_id}/pins`

*Get all map pins for a specific map*

<h3 id="get__api_maps_{map_id}_pins-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|map_id|path|string|true|The ID of the map|

> Example responses

> 200 Response

```json
{
  "mapPins": []
}
```

<h3 id="get__api_maps_{map_id}_pins-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of map pins|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|None|

<h3 id="get__api_maps_{map_id}_pins-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» mapPins|array|false|none|none|
|»» *anonymous*|any|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## put__api_maps_{map_id}_pins_{id}

`PUT /api/maps/{map_id}/pins/{id}`

*Update a map pin by ID*

> Body parameter

```json
{
  "geo_location": {
    "lat": 0,
    "lng": 0
  },
  "country": "string",
  "city": "string"
}
```

<h3 id="put__api_maps_{map_id}_pins_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|map_id|path|string|true|The ID of the map|
|id|path|string|true|The ID of the map pin|
|body|body|object|true|none|
|» geo_location|body|object|false|none|
|»» lat|body|number|false|none|
|»» lng|body|number|false|none|
|» country|body|string|false|none|
|» city|body|string|false|none|

> Example responses

> 200 Response

```json
{
  "mapPin": null
}
```

<h3 id="put__api_maps_{map_id}_pins_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Map pin updated successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Map pin not found|None|

<h3 id="put__api_maps_{map_id}_pins_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» mapPin|any|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## delete__api_maps_{map_id}_pins_{id}

`DELETE /api/maps/{map_id}/pins/{id}`

*Delete a map pin by ID*

<h3 id="delete__api_maps_{map_id}_pins_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|map_id|path|string|true|The ID of the map|
|id|path|string|true|The ID of the map pin|

> Example responses

> 200 Response

```json
{
  "message": "Map pin deleted successfully"
}
```

<h3 id="delete__api_maps_{map_id}_pins_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Map pin deleted successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Map pin not found|None|

<h3 id="delete__api_maps_{map_id}_pins_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="cs732-project-api-mappin">MapPin</h1>

## get__api_map-pins

`GET /api/map-pins`

*Get all map pins for the current user*

Retrieve all map pins associated with maps where the authenticated user is the owner or a collaborator. Includes user details for each pin.

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "map_id": "string",
    "user_id": {
      "id": "string",
      "email": "string",
      "name": "string"
    }
  }
]
```

<h3 id="get__api_map-pins-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|A list of map pins with user details.|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized access.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|No maps or pins found for the user.|None|

<h3 id="get__api_map-pins-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|string|false|none|The ID of the map pin.|
|» map_id|string|false|none|The ID of the map associated with the pin.|
|» user_id|object|false|none|The user details associated with the pin.|
|»» id|string|false|none|The ID of the user.|
|»» email|string|false|none|The email of the user.|
|»» name|string|false|none|The name of the user.|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="cs732-project-api-share">Share</h1>

## put__api_maps_{map_id}_share

`PUT /api/maps/{map_id}/share`

*Update the sharing settings of a map*

Update the sharing settings (range and relevant users) for a specific map. Only the map owner can perform this action.

> Body parameter

```json
{
  "range": "assigned",
  "relevant_ids": [
    {
      "id": "user1_id",
      "permission": "read"
    },
    {
      "id": "user2_id",
      "permission": "write"
    }
  ]
}
```

<h3 id="put__api_maps_{map_id}_share-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|map_id|path|string|true|The ID of the map to update sharing settings for.|
|body|body|object|true|none|
|» range|body|string|false|The sharing range of the map.|
|» relevant_ids|body|[object]|false|A list of user IDs and their permissions (required if range is "assigned").|
|»» id|body|string|false|The user ID to assign access to the map.|
|»» permission|body|string|false|The permission level for the user.|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» range|private|
|» range|anyone|
|» range|assigned|
|»» permission|read|
|»» permission|write|

> Example responses

> 200 Response

```json
{
  "share": {
    "range": "string",
    "relevant_ids": [
      {
        "id": "string",
        "permission": "read"
      }
    ]
  }
}
```

<h3 id="put__api_maps_{map_id}_share-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Sharing settings updated successfully.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid input or validation error.|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Access denied. Only the map owner can update sharing settings.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Map or share information not found.|None|

<h3 id="put__api_maps_{map_id}_share-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» share|object|false|none|The updated sharing settings.|
|»» range|string|false|none|The sharing range of the map.|
|»» relevant_ids|[object]|false|none|none|
|»»» id|string|false|none|The user ID.|
|»»» permission|string|false|none|The user's permission level.|

#### Enumerated Values

|Property|Value|
|---|---|
|permission|read|
|permission|write|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_shares_code_{code}

`GET /api/shares/code/{code}`

*Get share information by code*

Retrieve share information by its code. Only users with access to the associated map can perform this action.

<h3 id="get__api_shares_code_{code}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|code|path|string|true|The unique code of the share to retrieve.|

> Example responses

> 200 Response

```json
{
  "share": {
    "range": "string",
    "relevant_ids": [
      {
        "id": "string",
        "permission": "read"
      }
    ]
  },
  "permission": "read"
}
```

<h3 id="get__api_shares_code_{code}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Share information retrieved successfully.|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Access denied. The user does not have permission to view this share.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Share not found.|None|

<h3 id="get__api_shares_code_{code}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» share|object|false|none|The share information.|
|»» range|string|false|none|The sharing range of the map.|
|»» relevant_ids|[object]|false|none|none|
|»»» id|string|false|none|The user ID.|
|»»» permission|string|false|none|The user's permission level.|
|»» permission|string|false|none|The current user's permission level for the share.|

#### Enumerated Values

|Property|Value|
|---|---|
|permission|read|
|permission|write|
|permission|read|
|permission|write|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="cs732-project-api-upload">Upload</h1>

## post__api_upload

`POST /api/upload`

*Upload a file*

Upload a file with a specific scene

> Body parameter

```yaml
file: string

```

<h3 id="post__api_upload-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|scene|query|string|false|The scene for the file upload|
|body|body|object|true|none|
|» file|body|string(binary)|false|The file to be uploaded|

#### Enumerated Values

|Parameter|Value|
|---|---|
|scene|profile|
|scene|avatar|
|scene|post|
|scene|journey|
|scene|others|

> Example responses

> 200 Response

```json
{
  "success": true,
  "file": {
    "originalName": "example.jpg",
    "filename": "12345-example.jpg",
    "path": "/uploads/profile/12345-example.jpg",
    "size": 204800,
    "mimetype": "image/jpeg"
  }
}
```

<h3 id="post__api_upload-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|File uploaded successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|No file uploaded|Inline|

<h3 id="post__api_upload-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» file|object|false|none|none|
|»» originalName|string|false|none|The original name of the uploaded file|
|»» filename|string|false|none|The name of the file stored on the server|
|»» path|string|false|none|The path to the uploaded file|
|»» size|integer|false|none|The size of the uploaded file in bytes|
|»» mimetype|string|false|none|The MIME type of the uploaded file|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» code|integer|false|none|none|
|» reason|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_upload_multiple

`POST /api/upload/multiple`

*Upload multiple files*

Upload multiple files with a specific scene.

> Body parameter

```yaml
files:
  - string

```

<h3 id="post__api_upload_multiple-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|scene|query|string|false|The scene for the file upload (e.g., profile, avatar, post).|
|body|body|object|true|none|
|» files|body|[string]|false|The files to be uploaded.|

#### Enumerated Values

|Parameter|Value|
|---|---|
|scene|profile|
|scene|avatar|
|scene|post|
|scene|journey|
|scene|others|

> Example responses

> 200 Response

```json
{
  "files": [
    {
      "originalName": "example.jpg",
      "filename": "12345-example.jpg",
      "path": "/uploads/post/12345-example.jpg",
      "size": 204800,
      "mimetype": "image/jpeg"
    }
  ]
}
```

<h3 id="post__api_upload_multiple-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Files uploaded successfully.|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|No files uploaded or invalid input.|Inline|

<h3 id="post__api_upload_multiple-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» files|[object]|false|none|none|
|»» originalName|string|false|none|The original name of the uploaded file.|
|»» filename|string|false|none|The name of the file stored on the server.|
|»» path|string|false|none|The path to the uploaded file.|
|»» size|integer|false|none|The size of the uploaded file in bytes.|
|»» mimetype|string|false|none|The MIME type of the uploaded file.|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» code|integer|false|none|none|
|» reason|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="cs732-project-api-users">Users</h1>

## post__api_users_register

`POST /api/users/register`

*Register a new user*

> Body parameter

```json
{
  "email": "user@example.com",
  "username": "testuser",
  "password": "password123",
  "avatar": "avatars/example.jpg"
}
```

<h3 id="post__api_users_register-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» email|body|string(email)|true|none|
|» username|body|string|true|none|
|» password|body|string|true|none|
|» avatar|body|string|true|none|

> Example responses

> 201 Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": null
}
```

<h3 id="post__api_users_register-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|User registered successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|None|

<h3 id="post__api_users_register-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» token|string|false|none|none|
|» user|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## post__api_users_login

`POST /api/users/login`

*Login a user*

> Body parameter

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

<h3 id="post__api_users_login-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» email|body|string(email)|true|none|
|» password|body|string|true|none|

> Example responses

> 200 Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": null
}
```

<h3 id="post__api_users_login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Login successful and user information returned|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid email or password|None|

<h3 id="post__api_users_login-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» token|string|false|none|none|
|» user|any|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get__api_users_me

`GET /api/users/me`

*Get the current user's information*

> Example responses

<h3 id="get__api_users_me-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Current user information|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|None|

<h3 id="get__api_users_me-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## put__api_users_me

`PUT /api/users/me`

*Update the current user's information*

> Body parameter

```json
{
  "username": "updateduser",
  "password": "newpassword123",
  "avatar": "avatars/updated.jpg"
}
```

<h3 id="put__api_users_me-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» username|body|string|false|none|
|» password|body|string|false|none|
|» avatar|body|string|false|none|

> Example responses

<h3 id="put__api_users_me-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User updated successfully|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|

<h3 id="put__api_users_me-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## get__api_users_email_{email}

`GET /api/users/email/{email}`

*Get user information by email*

<h3 id="get__api_users_email_{email}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|email|path|string(email)|true|The email of the user to retrieve|

> Example responses

> 200 Response

```json
{
  "user": {
    "id": "string",
    "email": "string",
    "username": "string",
    "avatar": "string"
  }
}
```

<h3 id="get__api_users_email_{email}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User information retrieved successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid email format|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|None|

<h3 id="get__api_users_email_{email}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» user|object|false|none|none|
|»» id|string|false|none|The ID of the user|
|»» email|string|false|none|The email of the user|
|»» username|string|false|none|The username of the user|
|»» avatar|string|false|none|The avatar URL of the user|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

