# Medical Store Backend API

A comprehensive Node.js/Express backend for the Medical Store Management System. This API handles all business logic including authentication, inventory management, transactions, and tax calculations.

## Features

✅ User Authentication (Email, Phone, Social Login)
✅ Medicine Inventory Management
✅ FIFO (First In First Out) Stock Management
✅ Transaction Management (Buy/Sell)
✅ GST Calculation & Tax Filing
✅ Expiring Medicine Tracking
✅ Dashboard Analytics
✅ Supplier Management
✅ Bulk Medicine Upload

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
```bash
cd Medical-Store-Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/medical-store
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

## Running the Server

### Development Mode
```bash
npm run dev
```
The server will start at `http://localhost:5000`

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login with email/password or phone
- `POST /social-login` - Login with Google/Facebook
- `GET /profile` - Get user profile (requires auth)
- `PUT /profile` - Update user profile (requires auth)

### Medicines (`/api/medicines`)
- `GET /` - Get all medicines (requires auth)
- `POST /` - Create new medicine (requires auth)
- `GET /:id` - Get medicine by ID (requires auth)
- `PUT /:id` - Update medicine (requires auth)
- `DELETE /:id` - Delete medicine (requires auth)
- `GET /search?query=term` - Search medicines (requires auth)
- `GET /inventory` - Get inventory list (requires auth)
- `GET /expiring?days=30` - Get expiring medicines (requires auth)
- `POST /bulk-upload` - Bulk upload medicines (requires auth)

### Transactions (`/api/transactions`)
- `GET /` - Get all transactions (requires auth)
- `POST /` - Create new transaction (requires auth)
- `GET /:id` - Get transaction by ID (requires auth)
- `GET /tax-data` - Get tax data (requires auth)
- `GET /dashboard-stats` - Get dashboard statistics (requires auth)

### Suppliers (`/api/suppliers`)
- `GET /` - Get all suppliers (requires auth)
- `POST /` - Create new supplier (requires auth)
- `GET /:id` - Get supplier by ID (requires auth)
- `PUT /:id` - Update supplier (requires auth)
- `DELETE /:id` - Delete supplier (requires auth)

## Authentication

All endpoints except `/auth/register` and `/auth/login` require JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Database Models

### User
```typescript
{
  email: string
  password: string (hashed)
  phone: string
  shopName: string
  address: string
  gstin: string
  contactNumber: string
  ownerName: string
  loginProvider: 'email' | 'google' | 'facebook' | 'phone'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Medicine
```typescript
{
  name: string
  expiryDate: string
  batchNo: string
  supplier: string
  isScheduleH: boolean
  price: number
  mrp: number
  stockQuantity: number
  minStockLevel: number
  category: string
  manufacturer: string
  gstRate: number
  fifoLots: MedicineLot[]
  createdAt: Date
  updatedAt: Date
}
```

### Transaction
```typescript
{
  type: 'sell' | 'purchase'
  items: TransactionItem[]
  totalAmount: number
  date: string
  customerName?: string
  customerPhone?: string
  gstAmount: number
  invoiceNumber: string
  paymentMethod: 'cash' | 'card' | 'upi'
  userId: ObjectId
  createdAt: Date
  updatedAt: Date
}
```

## Error Handling

The API returns standard error responses:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route handlers
├── middleware/      # Express middleware
├── models/          # MongoDB schemas
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript interfaces
├── utils/           # Utility functions
└── server.ts        # Main server file
```

## Development Guidelines

1. **Code Style**: TypeScript with strict mode enabled
2. **Error Handling**: Use custom error messages
3. **Validation**: Implement input validation in controllers
4. **Security**: All passwords are hashed with bcrypt

## Future Enhancements

- [ ] Payment Gateway Integration
- [ ] Email Notifications
- [ ] SMS Notifications
- [ ] Prescription Upload & OCR Processing
- [ ] Advanced Reporting
- [ ] Inventory Forecasting
- [ ] Multi-location Support
- [ ] API Rate Limiting
- [ ] Caching with Redis
- [ ] Unit Tests

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

MIT
