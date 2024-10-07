# API Structure Documentation

## Occupations

### Get All Occupations

- **Method**: GET
- **Path**: `/api/v1/occupations`
- **Description**: Retrieves a list of all occupations.
- **Query Parameters**:
  - `page`: Page number for pagination (default: 1)
  - `limit`: Number of items per page (default: 10)
  - `search`: Search term for filtering occupations

#### Example
```
GET /api/v1/occupations?page=1&limit=10&search=engineer
```

### Create Occupation

- **Method**: POST
- **Path**: `/api/v1/occupations`
- **Description**: Creates a new occupation.

#### Example
```
POST /api/v1/occupations
Content-Type: application/json

{
  "code": "SE-001",
  "name": "Software Engineer",
  "competencies": [
    {
      "unitCode": "SE-001-01",
      "name": "Develop software applications",
      "standardCompetency": "Able to develop software applications using modern programming languages and frameworks"
    }
  ]
}
```

### Get Occupation by ID

- **Method**: GET
- **Path**: `/api/v1/occupations/:id`
- **Description**: Retrieves details of a specific occupation.

#### Example
```
GET /api/v1/occupations/123e4567-e89b-12d3-a456-426614174000
```

### Update Occupation

- **Method**: PUT
- **Path**: `/api/v1/occupations/:id`
- **Description**: Updates an existing occupation.

#### Example
```
PUT /api/v1/occupations/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "code": "SE-001-UPDATE",
  "name": "Senior Software Engineer",
  "competencies": [
    {
      "unitCode": "SE-001-01",
      "name": "Develop complex software applications",
      "standardCompetency": "Able to develop and architect complex software applications using advanced programming techniques"
    }
  ]
}
```

### Delete Occupation

- **Method**: DELETE
- **Path**: `/api/v1/occupations/:id`
- **Description**: Deletes an occupation.

#### Example
```
DELETE /api/v1/occupations/123e4567-e89b-12d3-a456-426614174000
```

## Competencies

### Get All Competencies for an Occupation

- **Method**: GET
- **Path**: `/api/v1/occupations/:id/competencies`
- **Description**: Retrieves all competencies for a specific occupation.

#### Example
```
GET /api/v1/occupations/123e4567-e89b-12d3-a456-426614174000/competencies
```

### Create Competency for an Occupation

- **Method**: POST
- **Path**: `/api/v1/occupations/:id/competencies`
- **Description**: Adds a new competency to a specific occupation.

#### Example
```
POST /api/v1/occupations/123e4567-e89b-12d3-a456-426614174000/competencies
Content-Type: application/json

{
  "unitCode": "SE-001-02",
  "name": "Implement security best practices",
  "standardCompetency": "Able to implement security best practices in software development"
}
```

### Get Specific Competency for an Occupation

- **Method**: GET
- **Path**: `/api/v1/occupations/:id/competencies/:competencyId`
- **Description**: Retrieves details of a specific competency for an occupation.

#### Example
```
GET /api/v1/occupations/123e4567-e89b-12d3-a456-426614174000/competencies/98765432-abcd-efgh-ijkl-123456789012
```

### Update Competency for an Occupation

- **Method**: PUT
- **Path**: `/api/v1/occupations/:id/competencies/:competencyId`
- **Description**: Updates an existing competency for an occupation.

#### Example
```
PUT /api/v1/occupations/123e4567-e89b-12d3-a456-426614174000/competencies/98765432-abcd-efgh-ijkl-123456789012
Content-Type: application/json

{
  "unitCode": "SE-001-02-UPDATE",
  "name": "Implement advanced security measures",
  "standardCompetency": "Able to implement and maintain advanced security measures in software development"
}
```

### Delete Competency from an Occupation

- **Method**: DELETE
- **Path**: `/api/v1/occupations/:id/competencies/:competencyId`
- **Description**: Removes a competency from an occupation.

#### Example
```
DELETE /api/v1/occupations/123e4567-e89b-12d3-a456-426614174000/competencies/98765432-abcd-efgh-ijkl-123456789012
```

## General Notes

- All endpoints return JSON responses.
- Successful responses have a `success` field set to `true` and a `data` field containing the requested information.
- Error responses have a `success` field set to `false`, an `error` field with an error message, and a `statusCode` field.
- Authentication and authorization requirements are not specified in this documentation and should be implemented as needed.
- All ID fields use UUID format.
- Pagination is implemented for list endpoints where applicable.