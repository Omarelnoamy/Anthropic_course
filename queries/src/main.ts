import { open } from "sqlite";
import sqlite3 from "sqlite3";

import { createSchema } from "./schema";
import { getPendingOrders } from "./queries/order_queries";
import { sendSlackMessage } from "./slack";

const STALE_ORDER_DAYS = 3;
const ALERT_CHANNEL = "#order-alerts";

async function alertOnStalePendingOrders() {
  const db = await open({
    filename: "ecommerce.db",
    driver: sqlite3.Database,
  });

  await createSchema(db, false);

  const staleOrders = await getPendingOrders(db, STALE_ORDER_DAYS);

  for (const order of staleOrders) {
    const days = Math.floor(order.days_since_created);
    const phone = order.phone ?? "no phone on file";
    const text =
      `:warning: Order ${order.order_number} has been pending for ${days} days.\n` +
      `Customer: ${order.customer_name} (${phone}) — please follow up.`;

    await sendSlackMessage(ALERT_CHANNEL, text);
  }
}

alertOnStalePendingOrders();
