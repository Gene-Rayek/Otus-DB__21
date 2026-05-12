db = db.getSiblingDB("otus");

db.createCollection("users");
db.createCollection("products");
db.createCollection("orders");

db.users.insertMany([
  {
    _id: 1,
    name: "Иван Петров",
    email: "ivan.petrov@example.com",
    age: 31,
    city: "Москва",
    created_at: new Date("2026-05-01")
  },
  {
    _id: 2,
    name: "Анна Смирнова",
    email: "anna.smirnova@example.com",
    age: 27,
    city: "Санкт-Петербург",
    created_at: new Date("2026-05-02")
  },
  {
    _id: 3,
    name: "Олег Иванов",
    email: "oleg.ivanov@example.com",
    age: 40,
    city: "Казань",
    created_at: new Date("2026-05-03")
  },
  {
    _id: 4,
    name: "Мария Орлова",
    email: "maria.orlova@example.com",
    age: 35,
    city: "Москва",
    created_at: new Date("2026-05-04")
  },
  {
    _id: 5,
    name: "Павел Сидоров",
    email: "pavel.sidorov@example.com",
    age: 29,
    city: "Новосибирск",
    created_at: new Date("2026-05-05")
  }
]);

db.products.insertMany([
  {
    _id: 1,
    name: "Ноутбук Lenovo",
    category: "electronics",
    price: 85000,
    stock: 10
  },
  {
    _id: 2,
    name: "Монитор Samsung",
    category: "electronics",
    price: 23000,
    stock: 15
  },
  {
    _id: 3,
    name: "Клавиатура Logitech",
    category: "accessories",
    price: 7000,
    stock: 30
  },
  {
    _id: 4,
    name: "SSD Kingston 1TB",
    category: "storage",
    price: 7500,
    stock: 25
  },
  {
    _id: 5,
    name: "Принтер HP LaserJet",
    category: "office",
    price: 32000,
    stock: 8
  }
]);

db.orders.insertMany([
  {
    _id: 1,
    user_id: 1,
    items: [
      { product_id: 1, quantity: 1, price: 85000 },
      { product_id: 3, quantity: 1, price: 7000 }
    ],
    total: 92000,
    status: "paid",
    created_at: new Date("2026-05-06")
  },
  {
    _id: 2,
    user_id: 2,
    items: [
      { product_id: 2, quantity: 2, price: 23000 }
    ],
    total: 46000,
    status: "new",
    created_at: new Date("2026-05-07")
  },
  {
    _id: 3,
    user_id: 4,
    items: [
      { product_id: 4, quantity: 3, price: 7500 },
      { product_id: 5, quantity: 1, price: 32000 }
    ],
    total: 54500,
    status: "paid",
    created_at: new Date("2026-05-08")
  },
  {
    _id: 4,
    user_id: 5,
    items: [
      { product_id: 3, quantity: 2, price: 7000 }
    ],
    total: 14000,
    status: "cancelled",
    created_at: new Date("2026-05-09")
  }
]);

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ city: 1 });

db.products.createIndex({ category: 1 });
db.products.createIndex({ price: 1 });

db.orders.createIndex({ user_id: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ status: 1, total: -1 });
