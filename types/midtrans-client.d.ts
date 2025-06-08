declare module "midtrans-client" {
  export class Snap {
    constructor(options: {
      isProduction: boolean
      serverKey: string
      clientKey?: string
    })

    createTransaction(parameter: {
      transaction_details: {
        order_id: string
        gross_amount: number
      }
      credit_card?: {
        secure?: boolean
      }
      customer_details?: any
      item_details?: any[]
      [key: string]: any
    }): Promise<{
      token: string
      redirect_url: string
    }>
  }

  export class CoreApi {
    constructor(options: {
      isProduction: boolean
      serverKey: string
      clientKey?: string
    })

    transaction: {
      status(orderId: string): Promise<any>
      cancel(orderId: string): Promise<any>
      approve(orderId: string): Promise<any>
      deny(orderId: string): Promise<any>
      expire(orderId: string): Promise<any>
      refund(orderId: string, parameter?: any): Promise<any>
    }
  }

  export class Iris {
    constructor(options: {
      isProduction: boolean
      serverKey: string
    })
  }
}
