---
title: TaskQueue Features
template: docs
menu: Features
---
# Features

## Detailed Specification

For a detailed explaination on all supported features, please see the
[API Specification](spec).


## Routing Options

TaskQueue provides two message routing options Zero Configuration & Pre-Configured
Hooks, both are explained below.

### Zero Configuration

This option allows a publisher of a message to specify the target endpoint along
with additional headers that influence the delivery of the message.

The below example specifies the target endpoint using the `X-TQ-Endpoint` header:

```http
POST /message
Host: https://taskqueue.io
Content-Type: application/json
Authorization: Token {API_TOKEN}
X-TQ-Timeout: 30
X-TQ-Endpoint: http://target-this.io/new-order

{{JSON_PAYLOAD}}
```

For more information on message headers, see the [API Specification](spec).

### Pre-Configured Hooks

With pre-configured hooks, you can define target endpoints up front - these hooks
contain routing rules based off the message headers values.

The below example hook would match and request that contains a header `Type` or `X-Type`
(case in-sensitive) and automatically route the message to the target endpoint:

```js
{
  "id": "83aa54e4-e92b-41a1-9ee3-fe43c01977f1",
  "endpoints": "http://target-this.io/new-customer",
  "filters": [
    { "type": "new-customer" }
  ]
}
```

For more information on Hooks, see the [API Specification](spec).


## Supported Content Types

Initially we will support the following content types out of the box.

- application/json

### Coming soon

We also plan to add support for the following content types.

- application/x-www-form-urlencoded
- multipart/form-data
