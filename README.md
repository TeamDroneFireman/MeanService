# Mean Service
This is the API service concerning the Mean object

##Object model
```
{
  "idIntervention": "boolean",
  "location": {
    "x": int,
    "y": int,
    "z": int,
  },
  "state": "string",
  "role": "string",
  "action": "string",
  "name": "string"
}
```

##API path

There is all the path provided by this service
- GET   - /api/means
- POST  - /api/means
- PUT   - /api/means
- GET   - /api/means/{id}
- PUT   - /api/means/{id}
- GET   - /api/means/count
