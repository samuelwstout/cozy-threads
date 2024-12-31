"use client";
/*
- use payment intents api to list all payments
- id, amount, date
- create an api, GET all payment intents
- GET /payment-intents

refund 
- create a button to invoke a POST to create the refund
*/
import { useEffect, useState } from "react";

export default function ListPayments() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [paymentIntents, setPaymentIntents] = useState<any[]>();

  useEffect(() => {
    const fetchPaymentIntents = async () => {
      try {
        const response = await fetch("/api/payment-intents");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPaymentIntents(data.paymentIntents.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPaymentIntents();
  }, []);

  // var date = new Date(unix_timestamp * 1000);

  async function createRefund(id: string) {
    try {
      const response = await fetch("/api/create-refund", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      console.log("res:", response);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <p>List Payments</p>
      {paymentIntents?.map((item) => {
        const date = new Date(item.created * 1000);
        const dateString = date.toString();
        return (
          <div key={item.id}>
            <p>{item.id}</p>
            <p>${item.amount / 100}</p>
            <p>{dateString}</p>
            <button onClick={() => createRefund(item.id)}>Refund</button>
          </div>
        );
      })}
    </div>
  );
}
