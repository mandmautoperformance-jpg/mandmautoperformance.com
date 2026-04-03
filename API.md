# M&M Auto Performance - API Documentation

## Base URL
```
https://mandmautoperformance.com/api
```

## Authentication
All endpoints require a valid JWT token from Supabase Auth in the Authorization header:

```
Authorization: Bearer {JWT_TOKEN}
```

## Response Format
All API responses follow this standard format:

```json
{
  "data": {},
  "error": null,
  "status": 200,
  "timestamp": "2026-04-03T10:30:00Z"
}
```

### Status Codes
- `200 OK`: Request successful
- `201 Created`: Resource created
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## Bookings API

### Create Booking
**Endpoint**: `POST /bookings`

**Description**: Create a new vehicle booking with document verification

**Request Body**:
```json
{
  "vehicleId": "1",
  "pickupDate": "2026-04-10",
  "returnDate": "2026-04-12",
  "pickupTime": "10:00",
  "passengers": 2,
  "pickupLocation": "Mayfair, London",
  "returnLocation": "Mayfair, London",
  "specialRequirements": "Extra insurance cover"
}
```

**Response**:
```json
{
  "data": {
    "bookingId": "bk_abc123",
    "status": "pending_verification",
    "vehicle": {
      "id": "1",
      "model": "Lamborghini Huracán",
      "dailyRate": 1500
    },
    "totalCost": 3000,
    "verificationStatus": "awaiting_documents",
    "createdAt": "2026-04-03T10:30:00Z"
  },
  "error": null,
  "status": 201
}
```

---

### Get Booking
**Endpoint**: `GET /bookings/{bookingId}`

**Description**: Retrieve booking details and verification status

**Response**:
```json
{
  "data": {
    "bookingId": "bk_abc123",
    "status": "confirmed",
    "vehicle": {
      "id": "1",
      "model": "Lamborghini Huracán",
      "registrationNumber": "M26MMO",
      "pickupLocation": { "lat": 51.5074, "lng": -0.1278 }
    },
    "customer": {
      "id": "usr_xxx",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "dates": {
      "pickupDate": "2026-04-10",
      "returnDate": "2026-04-12",
      "pickupTime": "10:00"
    },
    "pricing": {
      "dailyRate": 1500,
      "days": 2,
      "subtotal": 3000,
      "insuranceAddon": 500,
      "total": 3500
    },
    "verification": {
      "licenseVerified": true,
      "insuranceVerified": true,
      "idVerified": true,
      "verifiedAt": "2026-04-03T11:15:00Z"
    }
  },
  "error": null,
  "status": 200
}
```

---

### List User Bookings
**Endpoint**: `GET /bookings`

**Query Parameters**:
- `status` (optional): `pending`, `confirmed`, `active`, `completed`, `cancelled`
- `limit` (optional): Default 10, max 100
- `offset` (optional): Pagination offset

**Response**:
```json
{
  "data": [
    { "bookingId": "bk_abc123", "status": "confirmed", ... },
    { "bookingId": "bk_def456", "status": "completed", ... }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  },
  "error": null,
  "status": 200
}
```

---

### Cancel Booking
**Endpoint**: `DELETE /bookings/{bookingId}`

**Description**: Cancel an active booking (refund calculated based on cancellation window)

**Response**:
```json
{
  "data": {
    "bookingId": "bk_abc123",
    "status": "cancelled",
    "refund": {
      "originalAmount": 3500,
      "refundAmount": 2800,
      "cancellationFee": 700,
      "reason": "7 days before pickup"
    }
  },
  "error": null,
  "status": 200
}
```

---

## Vehicles API

### List All Vehicles
**Endpoint**: `GET /vehicles`

**Query Parameters**:
- `category` (optional): `luxury`, `sports`, `supercar`, `exotic`
- `location` (optional): `London`, `StAlbans`, `Watford`, `Radlett`
- `startDate` (required): Date to check availability
- `endDate` (required): Return date
- `priceMin` (optional): Minimum daily rate
- `priceMax` (optional): Maximum daily rate
- `limit` (optional): Default 20

**Response**:
```json
{
  "data": [
    {
      "id": "1",
      "model": "Lamborghini Huracán",
      "category": "supercar",
      "image": "https://cdn.example.com/lambo.jpg",
      "specs": {
        "horsepower": 657,
        "acceleration": "2.9s",
        "topSpeed": 217,
        "transmission": "Automatic"
      },
      "pricing": {
        "daily": 1500,
        "hourly": 200
      },
      "availability": {
        "available": true,
        "nextAvailable": "2026-04-05"
      },
      "features": ["GPS", "Premium Sound", "Leather Seats"],
      "location": "Mayfair, London",
      "rating": 4.9
    }
  ],
  "error": null,
  "status": 200
}
```

---

### Get Vehicle Details
**Endpoint**: `GET /vehicles/{vehicleId}`

**Response**:
```json
{
  "data": {
    "id": "1",
    "model": "Lamborghini Huracán",
    "description": "Experience the ultimate supercar performance with the iconic Lamborghini Huracán...",
    "specs": {
      "horsepower": 657,
      "acceleration": "2.9s",
      "topSpeed": 217,
      "transmission": "Automatic",
      "engine": "5.2L V10",
      "fuelType": "Petrol"
    },
    "pricing": {
      "daily": 1500,
      "hourly": 200,
      "minimumDays": 1
    },
    "features": [
      "GPS Navigation",
      "Premium Sound System",
      "Leather Sports Seats",
      "Climate Control",
      "Adaptive Suspension",
      "Carbon Fiber Accents"
    ],
    "images": [
      "https://cdn.example.com/lambo1.jpg",
      "https://cdn.example.com/lambo2.jpg"
    ],
    "location": "Mayfair, London",
    "rating": 4.9,
    "reviews": 127,
    "availability": {
      "calendar": [
        { "date": "2026-04-05", "available": true },
        { "date": "2026-04-06", "available": false }
      ]
    }
  },
  "error": null,
  "status": 200
}
```

---

## Document Verification API

### Upload Documents
**Endpoint**: `POST /verify-docs/upload`

**Description**: Upload license, insurance, and ID documents for AI verification

**Request** (multipart/form-data):
```
- file: [File] (PDF, PNG, JPG, max 10MB)
- documentType: "license" | "insurance" | "id"
- bookingId: string
```

**Response**:
```json
{
  "data": {
    "uploadId": "upl_xyz789",
    "documentType": "license",
    "status": "processing",
    "verificationId": "ver_abc123"
  },
  "error": null,
  "status": 201
}
```

---

### Check Verification Status
**Endpoint**: `GET /verify-docs/status/{verificationId}`

**Description**: Check AI verification progress and results

**Response**:
```json
{
  "data": {
    "verificationId": "ver_abc123",
    "documentType": "license",
    "status": "completed",
    "result": {
      "valid": true,
      "name": "John Doe",
      "licenseNumber": "DOEN123AB",
      "expiryDate": "2028-03-15",
      "confidence": 0.987,
      "issueDate": "2018-03-15"
    },
    "completedAt": "2026-04-03T11:05:00Z"
  },
  "error": null,
  "status": 200
}
```

---

## Telemetry API

### Get Live Vehicle Location
**Endpoint**: `GET /telemetry/location/{vehicleId}`

**Description**: Get real-time GPS location of active vehicle

**Response**:
```json
{
  "data": {
    "vehicleId": "1",
    "bookingId": "bk_abc123",
    "location": {
      "latitude": 51.5074,
      "longitude": -0.1278,
      "accuracy": 5,
      "timestamp": "2026-04-03T10:35:45Z"
    },
    "status": "active",
    "speedMph": 35,
    "heading": 45
  },
  "error": null,
  "status": 200
}
```

---

### Get Trip Telemetry
**Endpoint**: `GET /telemetry/trip/{bookingId}`

**Description**: Get detailed telemetry data for completed trip (Habit Score calculation)

**Response**:
```json
{
  "data": {
    "bookingId": "bk_abc123",
    "vehicleId": "1",
    "startTime": "2026-04-10T10:00:00Z",
    "endTime": "2026-04-12T10:00:00Z",
    "totalDistance": 245.3,
    "totalDuration": 48,
    "metrics": {
      "maxSpeed": 95,
      "averageSpeed": 52,
      "hardBrakes": 3,
      "hardAccelerations": 5,
      "corneringEvents": 12,
      "fuelEfficiency": 18.5
    },
    "habitScore": {
      "overall": 82,
      "breakdown": {
        "speedControl": 85,
        "brakingSmooth": 88,
        "cornering": 75,
        "acceleration": 80
      },
      "rewards": {
        "points": 500,
        "tier": "gold",
        "nextTierAt": 750
      }
    }
  },
  "error": null,
  "status": 200
}
```

---

## Admin API

### Get Fleet Overview
**Endpoint**: `GET /admin/fleet`

**Authentication**: Requires `admin` role

**Response**:
```json
{
  "data": {
    "totalVehicles": 500,
    "activeBookings": 45,
    "availableVehicles": 455,
    "maintenanceQueue": 15,
    "locations": [
      {
        "city": "Mayfair, London",
        "vehicles": 150,
        "bookings": 20,
        "maintenance": 5
      },
      {
        "city": "St Albans, Herts",
        "vehicles": 100,
        "bookings": 10,
        "maintenance": 3
      }
    ]
  },
  "error": null,
  "status": 200
}
```

---

### Update Dynamic Pricing
**Endpoint**: `POST /admin/pricing/update`

**Authentication**: Requires `admin` role

**Request Body**:
```json
{
  "vehicleId": "1",
  "adjustment": 1.25,
  "reason": "high_demand",
  "effectiveFrom": "2026-04-03T15:00:00Z",
  "duration": 3600
}
```

**Response**:
```json
{
  "data": {
    "vehicleId": "1",
    "newDailyRate": 1875,
    "previousRate": 1500,
    "adjustment": 1.25,
    "effectiveFrom": "2026-04-03T15:00:00Z",
    "effectiveUntil": "2026-04-03T16:00:00Z"
  },
  "error": null,
  "status": 200
}
```

---

## Error Responses

### Example Error Response
```json
{
  "data": null,
  "error": "Vehicle not available for requested dates",
  "status": 400
}
```

### Common Errors

| Error | Code | Reason |
|-------|------|--------|
| Invalid token | 401 | JWT token missing or expired |
| Vehicle unavailable | 400 | Dates conflict with existing bookings |
| Document verification failed | 400 | Invalid document or unsupported format |
| Booking limit exceeded | 429 | Rate limit reached (100 req/min) |

---

## Rate Limiting

- **Per User**: 100 requests per minute
- **Per IP**: 1000 requests per minute
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## WebSocket Events (Real-time Telemetry)

### Connect
```
wss://mandmautoperformance.com/telemetry
```

### Subscribe to Vehicle Updates
```json
{
  "action": "subscribe",
  "vehicleId": "1"
}
```

### Receive Location Update
```json
{
  "event": "location_update",
  "vehicleId": "1",
  "location": {
    "latitude": 51.5074,
    "longitude": -0.1278,
    "speedMph": 45,
    "timestamp": "2026-04-03T10:35:45Z"
  }
}
```

---

## Testing

### cURL Examples

**Get Available Vehicles**:
```bash
curl -X GET "https://mandmautoperformance.com/api/vehicles?startDate=2026-04-10&endDate=2026-04-12" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create Booking**:
```bash
curl -X POST "https://mandmautoperformance.com/api/bookings" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": "1",
    "pickupDate": "2026-04-10",
    "returnDate": "2026-04-12",
    "passengers": 2
  }'
```

---

## SDKs & Client Libraries

### JavaScript/TypeScript
```typescript
import { createClient } from '@supabase/supabase-js';

const client = createClient(SUPABASE_URL, ANON_KEY);

// Fetch vehicles
const { data: vehicles } = await client
  .from('vehicles')
  .select('*')
  .eq('available', true);
```

### React Hook
```typescript
import { useQuery } from '@tanstack/react-query';

function useVehicles(startDate, endDate) {
  return useQuery({
    queryKey: ['vehicles', startDate, endDate],
    queryFn: () => fetch(`/api/vehicles?startDate=${startDate}&endDate=${endDate}`)
      .then(r => r.json())
  });
}
```

---

**Last Updated**: April 3, 2026
**API Version**: v1.0
**Documentation Status**: Complete
