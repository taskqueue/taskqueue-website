---
title: TaskQueue API Specification
template: docs
menu: API Specification
---
# Task Queue Specification

## Messages
A message is a single json document that is routed to one or more endpoints.

### Post Message
Send a new message to the TaskQueue service for processing.

##### Request
```http
POST /message
Host: https://taskqueue.io
Content-Type: application/json
Authorization: Token {API_TOKEN}
X-TQ-Timeout: 30
X-TQ-Endpoint: http://target-this.io/new-order

{ "JSON_PAYLOAD": "HERE" }
```

##### Response
```http
201 Created

X-TQ-Message-ID: 0b787a38-3a1b-4ca4-9b35-2a3005fc6611
```

#### Body
The message body should be a json object encoded using `UTF-8`.

The maximum message size is `10MB`. Any messgae excceding this limit will result
in a `413 Request Entity Too Large` HTTP status code.

#### Headers

##### Authorization
Refer to the Authentication section below for more info on this header.

##### X-TQ-Timeout (optional)
The number of seconds in which the target endpoint is expected to respond before
the attempt is considered failed. The maximum time limit is `60` seconds.

Where the message is being processed by a hook, this value will override the value
specified by the hook.

##### X-TQ-Retries (optional)
The number of retires before declaring the message dead - the maximum is `5` attempts
using a backoff strategy (`1`, `10`, `30`, `60` & `120` seconds). When a message is
considered dead then it will be routed to the dead letter enpoint (if specified).

It is valid to specify a total of `0` retries. If the first attempt fails, then the
message will immediately be considered dead.

Where the message is being processed by a hook, this value will override the value
specified by the hook.

##### X-TQ-Endpoint (optional)
This is an optional endpoint that allows you to specify the target endpoint that
the message will be published to.

This header enables users to publish and process messages without ever having to
register a hook.

A message with an endpoint specified will also be processed by any matching hooks.


## Hooks
A hook is a message filter that forwards messages to an endpoint when all of its
conditions are met.

> This section still needs work

### Anatomy
Below is an example hook definition:

```json
{
  "id": "2299180b-6d0c-4aab-afbd-b4f98f8eeb9d",
  "endpoint": "http://target-this.io/new-order",
  "filters": [
    { "type": "new-order" }
  ]
}
```

#### ID
The unique ID of the hook.

#### Endpoint
An absolute `HTTP` / `HTTPS` URI that accepts requests conforming with the following
contract:

```http
POST ENDPOINT_ABSOLUTE_PATH
Host: ENDPOINT_HOST_AND_PORT
Content-Type: application/json
```

#### Filters
An array of header names and values that must be matched in order of the hook to fire.

The TaskQueue service will ignore case differences during the matching process and
strip off the `X-` and `X-TQ-` header prefixes. For the header `X-Type` with a value
of `new-customer` the following filters would match:

```json
"filters": [
  { "type": "new-customer" },         // match
  { "TYPE": "NEW-CUSTOMER" },         // match
  { "X-TQ-Type": "new-customer" },    // match
  { "X-Type": "new-customer" },       // match
  { "other": "new-customer" }         // no match
]
```

If no filters are specified (empty array), then the hook will match all messages. This
will helpful for diagnostics / debugging messages.

### Get All Hooks
Returns a list of all hooks currently configured for the user. An empty array of hooks
will be returned if no hooks have been configured yet.

##### Request
```http
GET /hooks
Host: https://taskqueue.io
Content-Type: application/json
Authorization: Token {API_TOKEN}
```

##### Response
```http
200 OK

{
  "hooks": [
    {
      "id": "83aa54e4-e92b-41a1-9ee3-fe43c01977f1",
      "endpoints": "http://target-this.io/new-customer",
      "filters": [
        { "type": "new-customer" }
      ]
    },
    {
      "id": "2299180b-6d0c-4aab-afbd-b4f98f8eeb9d",
      "endpoints": "http://target-this.io/new-message",
      "filters": [ ]
    }
  ]
}
```

### Get a Hook
Returns a single hook based on the ID specified.

##### Request
```http
GET /hooks/:id
Host: https://taskqueue.io
Content-Type: application/json
Authorization: Token {API_TOKEN}
```

##### Response
```http
200 OK

{
  "id": "2299180b-6d0c-4aab-afbd-b4f98f8eeb9d",
  "target": "http://target-this.io/new-order",
  "filters": [
    { "type": "new-order" }
  ]
}
```

A `404 Not Found` message will be returned where no hook exists with the specified ID.

### Create a Hook
Creates a new hook. Once created the hook will be immediately available for processing.

##### Request
```http
POST /hooks
Host: https://taskqueue.io
Authorization: Token {API_TOKEN}

{
  "target": "http://target-this.io/new-order",
  "filters": [
    { "type": "new-order" }
  ]
}
```

##### Response
```http
201 Created

{
  "id": "2299180b-6d0c-4aab-afbd-b4f98f8eeb9d",
  "target": "http://target-this.io/new-order",
  "filters": [
    { "type": "new-order" }
  ]
}
```

The ID of the hook should not be specified, this is defined by the TaskQueue system. In the
event that the ID is specified, a `400 Bad Request` response will be returned to the caller.

### Delete a Hook
Deletes the hook with the specified ID.

##### Request
```http
DELETE /hooks/:id
Host: https://taskqueue.io
Authorization: Token {API_TOKEN}
```

##### Response
```http
200 OK
```

A `404 Not Found` message will be returned where no hook exists with the specified ID.


## Authentication

### Authorization Header
TaskQueue currently supports only Token authentication for using the standard `Authorization`
HTTP header.

The header must be in the form:

```http
Authorization: Token {API_TOKEN}
```

We plan to add additional authentication methods in the future.

##### Request
```http
DELETE /hooks/:id
Host: https://taskqueue.io
Authorization: Token {API_TOKEN}
```

##### Response
```http
200 OK
```

## Future Features

For insight into possible future features, see [Request for Comments (RFC's)](rfc).
