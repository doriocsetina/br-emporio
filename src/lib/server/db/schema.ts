import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

// Admin sessions
export const session = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(), // always "admin"
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull()
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  media: text("media"),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  surname: text("surname").notNull(),
  email: text("email").notNull().unique(),
  address: text("address"),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  delivery: integer("delivery", { mode: "boolean" }).notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  isCompleted: integer("delivery", { mode: "boolean" }).notNull(),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
});
