import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// 🌏 Timestamp fields (Asia/Bangkok timezone)
const createdAt = timestamp("created_at", {
  mode: "date",
})
  .default(sql`(NOW() AT TIME ZONE 'Asia/Bangkok')`)
  .notNull();

const updatedAt = timestamp("updated_at", {
  mode: "date",
})
  .default(sql`(NOW() AT TIME ZONE 'Asia/Bangkok')`)
  .notNull();

// ENUM สำหรับสถานะการจอง
// Use pgEnum.create() to reference an existing enum instead of trying to create it
export const reservationStatusEnum = pgEnum("reservation_status", [
  "pending", // ยังไม่ assign รถ/คนขับ
  "confirmed", // assign แล้ว
  "cancelled", // ยกเลิก
  "completed", // ใช้งานเสร็จแล้ว
]);

// 🚗 Vehicles
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  licensePlate: varchar("license_plate", { length: 20 }).notNull().unique(),
  brand: varchar("brand", { length: 50 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // ประเภท เช่น รถเก๋ง, รถบรรทุก
  model: varchar("model", { length: 50 }), // ✅ รุ่น เช่น Altis, Fortuner
  variant: varchar("variant", { length: 50 }),
  active: boolean("active").default(true),
  imageUrl: varchar("image_url", { length: 255 }),
  createdAt,
  updatedAt,
});

// 🧑‍✈️ Drivers
export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  active: boolean("active").default(true),
  imageUrl: varchar("image_url", { length: 255 }),

  createdAt,
  updatedAt,
});

// 👤 Customers (ผู้ใช้รถ)
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  active: boolean("active").default(true),

  createdAt,
  updatedAt,
});

// 📅 Reservations (การจองรถ)
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),

  // ลูกค้าที่ใช้รถ
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),

  // ผู้ทำการจอง (อาจไม่ใช่ผู้ใช้รถ)
  reservedByName: varchar("reserved_by_name", { length: 100 }).notNull(),

  // รายละเอียดการจอง
  date: date("date").notNull(), // Changed from timestamp to date
  timeStart: varchar("time_start", { length: 10 }).notNull(),
  timeEnd: varchar("time_end", { length: 10 }).notNull(),
  purpose: text("purpose"),
  pickupLocation: text("pickup_location"),
  dropoffLocation: text("dropoff_location"),

  // รถและคนขับ (optional ตอนยังไม่ได้ assign)
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  driverId: integer("driver_id").references(() => drivers.id),

  passengerCount: integer("passenger_count"),
  passengerInfo: text("passenger_info"), // JSON string ได้ เช่น '[{"name":"A","phone":"123"}]'

  // สถานะการจอง
  status: reservationStatusEnum("status").notNull().default("pending"),

  // Flag สำหรับ soft delete
  active: boolean("active").default(true),

  imageUrl: varchar("image_url", { length: 255 }), // เพิ่ม imageUrl เป็น string
  createdAt,
  updatedAt,
});

export const reservationsRelations = relations(reservations, ({ one }) => ({
  customer: one(customers, {
    fields: [reservations.customerId],
    references: [customers.id],
  }),
  vehicle: one(vehicles, {
    fields: [reservations.vehicleId],
    references: [vehicles.id],
  }),
  driver: one(drivers, {
    fields: [reservations.driverId],
    references: [drivers.id],
  }),
}));

// Define relations for customers table
export const customersRelations = relations(customers, ({ many }) => ({
  reservations: many(reservations),
}));

// Define relations for vehicles table
export const vehiclesRelations = relations(vehicles, ({ many }) => ({
  reservations: many(reservations),
}));

// Define relations for drivers table
export const driversRelations = relations(drivers, ({ many }) => ({
  reservations: many(reservations),
}));

export const users = pgTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: text("role").notNull().default("user"),
  createdAt,
});

export const sessions = pgTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  user_id: varchar("user_id", { length: 255 }).notNull(),
  createdAt,
});
