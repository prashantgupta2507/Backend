const connection = require('./Connection')

const createUser = (req, res, next) => {
    connection.query('CREATE TABLE if not exists CUSTOMER (user_id int auto_increment primary key,email varchar(30) unique not null, password varchar(100) not null, first_name varchar(20) not null, last_name varchar(20) not null, admin TINYINT(1) default 0, mobile varchar(15),gender char(1))', function (err) {
        if (err) throw err
        next()
    })
}

const createAddress = (req, res, next) => {
    connection.query('CREATE TABLE if not exists ADDRESS (address_id int(11) auto_increment primary key, name varchar(20), number varchar(15), locality varchar(30), houseAddress varchar(50) not null, city varchar(25) not null, state varchar(25) not null, pincode char(10) not null, landmark varchar(30), alternateNumber varchar(15), addressType char(1), user_id int, FOREIGN KEY(user_id) REFERENCES CUSTOMER(user_id))', function (err) {
        if (err) throw err
        next()
    })
}

const createCategory = (req, res, next) => {
    connection.query('CREATE TABLE if not exists CATEGORY (category_id int auto_increment primary key,title varchar(30) not null)', function (err) {
        if (err) throw err
        next()
    })
}

const createProduct = (req, res, next) => {
    connection.query('CREATE TABLE if not exists PRODUCT (product_id int auto_increment primary key, title varchar(75) not null, summary varchar(2000), price double(6,2) not null, discount double(4,2) not null, quantity smallint(6) unsigned, category_id int, main_image_url varchar(2000),size varchar(10),invalid TINYINT(1) default 0,FOREIGN KEY(category_id) REFERENCES CATEGORY(category_id))', function (err) {
        if (err) throw err
        next()
    })
}

const createOrder = (req, res, next) => {
    connection.query('CREATE TABLE if not exists `ORDER` (order_id int auto_increment primary key, user_id int, total_price double(8,2), address_id int(11), paymentMode varchar(10), order_date varchar(20), pending TINYINT(1) default 1, FOREIGN KEY(user_id) REFERENCES CUSTOMER(user_id), FOREIGN KEY(address_id) REFERENCES ADDRESS(address_id))', function (err) {
        if (err) throw err
        next()
    })
}

const createSubOrder = (req, res, next) => {
    connection.query('CREATE TABLE if not exists SUBORDER (order_id int, product_name varchar(100), product_img varchar(2000), product_qty int, price double(6,2),FOREIGN KEY(order_id) REFERENCES `ORDER`(order_id))', function (err) {
        if (err) throw err
        next()
    })
}

const creatOtp = (req, res, next) => {
    connection.query('CREATE TABLE if not exists OTP (otp_id int primary key auto_increment, otp_value char(6) not null, email varchar(30) unique not null,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, is_verified boolean DEFAULT FALSE)', (err)=>{
        if(err) throw err
        next()
    })
}

module.exports = { createUser, createAddress, createCategory, createProduct, createOrder, createSubOrder, creatOtp };