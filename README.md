# WeppoStronaSklepu
Strona na projekt finalny z Kursu WEPPO
Kod SQL dla stworzenie tabel:
# items
```
CREATE TABLE items (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    jpgname varchar(255),
    description varchar(255),
    price varchar(255) NOT NULL,
    PRIMARY KEY (id)
);
```
# users + admin
```
CREATE TABLE users (
    id int NOT NULL AUTO_INCREMENT,
    login varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    PRIMARY KEY (id)
);
INSERT INTO users (login, password, email) VALUES ('admin', 'admin1', 'admin@gmail.com');
```

# orders
```
CREATE TABLE orders (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    itemId varchar(255) NOT NULL,
    userId varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    price varchar(255) NOT NULL,
    ordered int NOT NULL,
    PRIMARY KEY (id)
);
```

