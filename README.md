## Todo API
Todo App API with Deno KV & Hono

## Development
If you're using [drux](https://deno.land/x/drux)
```bash
  drux dev
```
or
```bash
  deno task dev
```
## API Using
#### GET, POST, PUT, DELETE Subject
```http
  GET /subject
```
---
```http
  GET /subject/{{subjectId}}
```
---
```http
  POST /subject
```
BODY
```json
{
  "title":"subject title"
}
```
---
```http
  PUT /subject/{{subjectId}}
```
BODY
```json
{
  "title":"new subject title"
}
```
---
```http
  DELETE /subject
```
BODY
```json
{
  "id":"{{subjectId}}"
}
```
---
#### GET, POST, PUT, DELETE Todo
```http
  GET /todo/{{subjectId}}
```
---
```http
  GET /todo/{{subjectId}}/{{todoId}}
```
---
```http
  POST /todo/{{subjectId}}
```
BODY
```json
{
  "title":"todo title"
}
```
---
```http
  PUT /subject/{{subjectId}}
```
BODY
```json
{
  "title":"new todo title"
}
```
---
```http
  DELETE /todo/{{subjectId}}
```
BODY
```json
{
  "id":"{{todoId}}"
}
```
---
## Test And Bench
### Test
```bash
  drux test
```
### Bench
```bash
  drux bench
```

You need [https://deno.land/x/drux](https://deno.land/x/drux)
