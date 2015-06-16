# Requests for Comments (RFC's)

This page contains possible future features, over time these will be expanded is
additional thinking as we progress the idea.


## Load balanced hook targets
Support for load balancing messages across multiple hook targets.


## Dead Message Delivery
Support for sending dead messages to an end point.


## Dead Message Query
Support for querying a list of available dead messages.


## Expanded backoff
Improving the backoff algorithm to increase the likely hood of successful delivery.


## Paused delivery
Pause the delivery of messages for specific accounts or endpoints.


## Analytics API
API for querying analytics information on an account.


## 202 Accepted
Support the `202 Accepted` HTTP status code from the endpoint. This would allow the
service to not block waiting for the response from the client. The responsibility
would then be passed to the client to inform the that the message was received
successfully before the timeout period.


## Message Expiry
Support to specify an `X-TQ-Expiry` header that contains a UTC date / time that the
message should be considered dead by if it has not been delivered.

Due to the backoff approach to retries there may be scenarios where the expiry of
messages need to expire within a given window irrespective of delivery.


## Hook Wildcard Header Filters
Support the ability to specify wildcards in hook filters, this will provide more
flexibity on how messages are matched.


## Hook Payload Filters
Support the ability for hooks to filter based on conditions in the payload, like the
existence of certain fields. This would add a larger overhead to processing times so
we would probably want to charge more for these types of filters - maybe something
like an extra $1 / month / payload filter.


## Batching API
Support for batching multiple messages together when posting, this reduces chatter
where multiple messages need to be produced.

Although the messages would be published together, processing would be individual so
if 1 failed delivery, that would not nessecarily impact the other messages.


## Message Journal
A store of all messages ever posted to the service - this would be an additional paid
service. Would allow for auditing of messages and possibly even replay of message ranges.


## Endpoint Headers
Provide the ability to specify additional headers that will be sent to an point when a
message is posted. The most common requirement will most likely be posting an
`Authroization` header with a token of some sort.

This would most likely only be available through hooks, not additional headers when
posting a message.
