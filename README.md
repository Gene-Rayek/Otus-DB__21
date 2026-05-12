# Домашнее задание MongoDB

## Тема

Базовые возможности MongoDB.

## Цель

Научиться разворачивать MongoDB, заполнять базу данными и выполнять запросы.

## Задание

Необходимо:

- установить MongoDB одним из способов: ВМ или Docker;
- заполнить базу данными;
- написать несколько запросов на выборку данных;
- написать несколько запросов на обновление данных.

## Задание повышенной сложности

- создать индексы;
- сравнить производительность запросов до и после создания индексов.

---

# Выполнение

MongoDB развернута в Docker с помощью `docker compose`.

В качестве предметной области выбран магазин.

Создана база данных:

```
otus
```

Созданы коллекции:

```text
users
products
orders
```

Данные автоматически загружаются при первом запуске контейнера из файла:

```text
init/init.js
```


# 1. Docker Compose

Файл `docker-compose.yml`:

```yaml
services:
  mongodb:
    image: mongo:7
    container_name: otus-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
      MONGO_INITDB_DATABASE: otus
    volumes:
      - mongo_data:/data/db
      - ./init/init.js:/docker-entrypoint-initdb.d/init.js:ro

volumes:
  mongo_data:
```

# 2. Файл инициализации базы

Файл `init/init.js`:

```javascript
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
```

---

# 3. Запуск MongoDB

Запуск контейнера:

```bash
docker compose up -d
```

# 4. Подключение к MongoDB

Подключение к MongoDB:

```bash
docker exec -it otus-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
```

Переход в базу данных:

```javascript
use otus
```

Проверка коллекций:

```javascript
show collections
```

результат:

<img width="370" height="86" alt="1" src="https://github.com/user-attachments/assets/4588696d-cea7-4a2f-94f3-d90e1f245f93" />


---

# 5. Проверка загруженных данных

Количество пользователей:

```javascript
db.users.countDocuments()
```

Количество товаров:

```javascript
db.products.countDocuments()
```

Количество заказов:

```javascript
db.orders.countDocuments()
```

результат:

<img width="473" height="136" alt="2" src="https://github.com/user-attachments/assets/335b7809-7ba1-4fb8-9554-0c269277bc39" />


Просмотр данных:

```javascript
db.users.find().pretty()
db.products.find().pretty()
db.orders.find().pretty()
```

---

# 6. Запросы на выборку данных

## 6.1. Вывести всех пользователей

```javascript
db.users.find().pretty()
```

## 6.2. Найти пользователей из Москвы

```javascript
db.users.find({ city: "Москва" }).pretty()
```

## 6.3. Найти пользователей старше 30 лет

```javascript
db.users.find({ age: { $gt: 30 } }).pretty()
```

## 6.4. Вывести все товары

```javascript
db.products.find().pretty()
```

## 6.5. Найти товары категории `electronics`

```javascript
db.products.find({ category: "electronics" }).pretty()
```

## 6.6. Найти товары дороже 20000

```javascript
db.products.find({ price: { $gt: 20000 } }).pretty()
```

## 6.7. Найти товары, которые есть на складе

```javascript
db.products.find({ stock: { $gt: 0 } }).pretty()
```

## 6.8. Найти оплаченные заказы

```javascript
db.orders.find({ status: "paid" }).pretty()
```

## 6.9. Найти заказы на сумму больше 50000

```javascript
db.orders.find({ total: { $gt: 50000 } }).pretty()
```

---

# 7. Запросы на обновление данных

## 7.1. Обновить город пользователя

```javascript
db.users.updateOne(
  { _id: 1 },
  { $set: { city: "Московская область" } }
)
```

Проверка:

```javascript
db.users.find({ _id: 1 }).pretty()
```

## 7.2. Обновить цену товара

```javascript
db.products.updateOne(
  { _id: 2 },
  { $set: { price: 21900 } }
)
```

Проверка:

```javascript
db.products.find({ _id: 2 }).pretty()
```

## 7.3. Уменьшить остаток товара на складе

```javascript
db.products.updateOne(
  { _id: 1 },
  { $inc: { stock: -1 } }
)
```

Проверка:

```javascript
db.products.find({ _id: 1 }).pretty()
```

## 7.4. Изменить статус заказа

```javascript
db.orders.updateOne(
  { _id: 2 },
  { $set: { status: "paid" } }
)
```

Проверка:

```javascript
db.orders.find({ _id: 2 }).pretty()
```

## 7.5. Добавить новое поле всем пользователям

```javascript
db.users.updateMany(
  {},
  { $set: { is_active: true } }
)
```

Проверка:

```javascript
db.users.find({}, { name: 1, is_active: 1 }).pretty()
```

---

# 8. Удаление данных

Удалить заказ со статусом `new`:

```javascript
db.orders.deleteOne({ status: "new" })
```

Проверка:

```javascript
db.orders.find({ status: "new" }).pretty()
```

---

# 9. Агрегация данных

## 9.1. Общая сумма заказов по статусам

```javascript
db.orders.aggregate([
  {
    $group: {
      _id: "$status",
      orders_count: { $sum: 1 },
      total_sum: { $sum: "$total" }
    }
  }
])
```

## 9.2. Количество товаров по категориям

```javascript
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      products_count: { $sum: 1 }
    }
  }
])
```

## 9.3. Заказы вместе с пользователями

```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $unwind: "$user"
  },
  {
    $project: {
      _id: 1,
      "user.name": 1,
      "user.email": 1,
      total: 1,
      status: 1,
      created_at: 1
    }
  }
])
```

---

# 10. Задание повышенной сложности: индексы

В файле `init/init.js` были созданы индексы:

```javascript
db.users.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.orders.createIndex({ user_id: 1 });
db.orders.createIndex({ status: 1 });
```

Проверка индексов:

```javascript
db.users.getIndexes()
db.products.getIndexes()
db.orders.getIndexes()
```

---

# 11. Сравнение производительности

## 11.1. Проверка запроса по email

```javascript
db.users.find({ email: "ivan.petrov@example.com" }).explain("executionStats")
```

Так как по полю `email` создан индекс, MongoDB использует индексный поиск.

В результате можно увидеть:

```text
IXSCAN
```

## 11.2. Проверка запроса по категории товара

```javascript
db.products.find({ category: "electronics" }).explain("executionStats")
```

Так как по полю `category` создан индекс, MongoDB использует индексный поиск.

В результате можно увидеть:

```text
IXSCAN
```

## 11.3. Проверка запроса по статусу заказа

```javascript
db.orders.find({ status: "paid" }).explain("executionStats")
```

Так как по полю `status` создан индекс, MongoDB использует индексный поиск.

В результате можно увидеть:

```text
IXSCAN
```

## 11.4. Сравнение до и после удаления индекса

Удаляем индекс по категории товара:

```javascript
db.products.dropIndex("category_1")
```

Повторно выполняем запрос:

```javascript
db.products.find({ category: "electronics" }).explain("executionStats")
```

После удаления индекса MongoDB выполняет полный просмотр коллекции.

В результате можно увидеть:

```text
COLLSCAN
```

Создаем индекс обратно:

```javascript
db.products.createIndex({ category: 1 })
```

Повторная проверка:

```javascript
db.products.find({ category: "electronics" }).explain("executionStats")
```

После повторного создания индекса используется:

```text
IXSCAN
```

---

# Вывод

В ходе выполнения домашнего задания была развернута MongoDB в Docker.

Была создана база данных `otus`.

В базе данных созданы коллекции:

- `users`;
- `products`;
- `orders`.

Данные были автоматически загружены из файла `init/init.js`.

Были выполнены запросы:

- на выборку данных;
- на обновление данных;
- на удаление данных;
- на агрегацию данных.

В рамках задания повышенной сложности были созданы индексы.

Для сравнения производительности использовалась команда:

```javascript
explain("executionStats")
```

После создания индекса MongoDB использует индексный поиск `IXSCAN`.

Без индекса MongoDB выполняет полный просмотр коллекции `COLLSCAN`.

Таким образом, задание выполнено полностью.
