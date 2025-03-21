# Stripe Demo Engineer Interview Take Home Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Tech Stack

- **Next.js**
- **Stripe** - Payment processing
- **Drizzle ORM** - Database ORM
- **Turso** - Database
- **Zustand** - Global state management
- **Vercel** - Application deployment
- **Vercel Blob** - Product image storage
- **Tailwind/TailwindUI** - Styling

## API Endpoints

- `GET /products`
- `POST /products`
- `GET /product/[id]`
- `POST /create-payment-intent`

## Front-end Routes

- `/` - Home page
- `/admin` - Admin dashboard
- `/product/[id]` - Product detail page
- `/checkout` - Checkout process
- `/complete` - Order completion

## Database Schema

### Products Table

| Column          | Type    |
| --------------- | ------- |
| id              | integer |
| title           | text    |
| description     | text    |
| imageUrl        | text    |
| stripeProductId | text    |
| stripePriceId   | text    |
| createdAt       | text    |
| updateAt        | integer |

## Application Flow

1. User enters the application and sees all products (`GET /products`)
2. User clicks a product and navigates to `/product/[id]`
3. Product page fetches product details (`GET /product/[id]`)
4. User can add products to shopping cart
5. Shopping cart data is managed by Zustand and persisted in localStorage
6. Shopping cart slider shows:
   - All products in cart
   - Quantity per product
   - Total price
   - Option to remove products
7. Checkout flow:
   - User clicks checkout and goes to `/checkout`
   - Displays cart items and Stripe Payment Element
   - Form submission creates payment intent (`POST /create-payment-intent`)
8. After payment:
   - User is redirected to `/complete`
   - Page displays payment status and intent ID
9. Product Management:
   - Admin can add products via `/admin`
   - Creates products in both database and Stripe catalog (`POST /products`)

## Trade-offs and Considerations

### Image Storage

- **Pro**: Vercel Blob offers convenient integration
- **Con**:
  - Potentially more expensive at scale compared to AWS S3
  - Beta status - not covered by Vercel enterprise SLA

### Database Choice

- **Pro**: Turso and Drizzle ORM provide easy setup and usage
- **Con**: Potential limitations for:
  - Complex queries
  - Large datasets

## Getting Started

Run the development server:

```bash
pnpm dev
```
