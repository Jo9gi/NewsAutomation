# News Articles API Documentation

This API provides CRUD operations for news articles. All endpoints are relative to the base URL: `http://localhost:3000/api/articles`

## Endpoints

### 1. Get All Articles
```http
GET /api/articles
```
Returns all articles from the latest CSV file.

**Response:**
```json
{
  "articles": [
    {
      "id": 1,
      "title": "Article Title",
      "description": "Article Description",
      "link": "https://example.com/article",
      "pubDate": "2024-03-14T12:00:00Z",
      "source": "example.com"
    }
  ]
}
```

### 2. Create New Article
```http
POST /api/articles
```
Creates a new article.

**Request Body:**
```json
{
  "title": "New Article Title",
  "description": "New Article Description",
  "link": "https://example.com/new-article",
  "source": "example.com"
}
```

**Response:**
```json
{
  "article": {
    "id": 2,
    "title": "New Article Title",
    "description": "New Article Description",
    "link": "https://example.com/new-article",
    "pubDate": "2024-03-14T12:00:00Z",
    "source": "example.com"
  }
}
```

### 3. Update Article
```http
PUT /api/articles
```
Updates an existing article.

**Request Body:**
```json
{
  "id": 1,
  "title": "Updated Title",
  "description": "Updated Description"
}
```

**Response:**
```json
{
  "article": {
    "id": 1,
    "title": "Updated Title",
    "description": "Updated Description",
    "link": "https://example.com/article",
    "pubDate": "2024-03-14T12:00:00Z",
    "source": "example.com"
  }
}
```

### 4. Delete Article
```http
DELETE /api/articles
```
Deletes an article.

**Request Body:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "message": "Article deleted successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

```json
{
  "error": "Error message"
}
```

Status codes:
- 200: Success
- 201: Created
- 404: Not Found
- 500: Server Error

## Testing in Postman

1. Create a new collection in Postman
2. Add requests for each endpoint
3. Set the request method (GET, POST, PUT, DELETE)
4. For POST and PUT requests, set the body to raw JSON
5. Test each endpoint with appropriate data

Example Postman setup:
1. GET http://localhost:3000/api/articles
2. POST http://localhost:3000/api/articles
3. PUT http://localhost:3000/api/articles
4. DELETE http://localhost:3000/api/articles 