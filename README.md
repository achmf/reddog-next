# Reddog

A takeaway ordering site for Reddog, a Korean snack brand. The existing reddog.co.id was only a landing page, so this project adds a transaction flow: customers pick a menu item, customize it, pay online and pick up their order at an outlet.

This is a demo built by a team for the Software Engineering course final project. It is not Reddog's live site, and payments run against the Midtrans sandbox.

## Features

- Menu with categories, search, toppings and special notes
- Cart with outlet and pickup time selection
- Online payment through Midtrans Snap, with pending, success and failed pages
- Payment status updates through a Midtrans webhook
- Order list and order detail with progress tracking
- Ordering without an account: a session ID in the browser links orders to the visitor
- Order validation codes
- Invoice download as PDF or image

## Tech stack

- [Next.js](https://nextjs.org) (App Router), React and TypeScript
- [Supabase](https://supabase.com) for the database
- [Midtrans](https://midtrans.com) for payments
- Tailwind CSS
- jsPDF and html2canvas for invoices, qrcode for order validation

## Getting started

You need Node.js, a Supabase project and a Midtrans sandbox account.

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   MIDTRANS_SERVER_KEY=your-midtrans-server-key
   ```

3. Create the Supabase tables the app reads from: `menus`, `orders`, `order_items` and `payment_webhooks`. The schema is not included in this repository.

4. Start the development server:

   ```bash
   npm run dev
   ```

   The app runs at [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/          Pages and API routes (menu, cart, orders, payment)
app/api/      Midtrans, order and payment status endpoints
components/   UI components
context/      Cart and alert state
utils/        Supabase and Midtrans clients
```
