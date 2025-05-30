drop database nextjs_post;
create database nextjs_post;
use nextjs_post;

create table tbl_post(
	id bigint(20) primary key auto_increment,
    title varchar(64),
    content varchar(255),
    status enum('active', 'inactive'),
    tag varchar(64),
    created_at timestamp default current_timestamp,
    update_at timestamp default current_timestamp on update current_timestamp,
    is_active tinyint(1),
    is_deleted tinyint(1)
);


INSERT INTO tbl_post (title, content, status, tag, is_active, is_deleted)
VALUES
    ('Tech Innovations in 2025', 'An overview of the latest trends in technology for 2025.', 'active', 'hello', 1, 0),
    ('Healthy Eating Tips', 'A guide to healthy eating and maintaining a balanced diet.', 'active', 'hey', 1, 0),
    ('10 Lifestyle Hacks', 'Simple and effective lifestyle changes to make your life easier.', 'inactive', 'bye', 0, 0),
    ('Best Online Courses for 2025', 'A list of the top online courses to take in 2025.', 'active', 'no', 1, 0);


    create table tbl_user(
    id bigint(20) primary key auto_increment,
    name varchar(64) ,
    mobile varchar(16) ,
    email varchar(128),
    password text,
    login_type enum('simple', 'google', 'facebook', 'apple') default 'simple',
    address text,
    location text,
    latitude varchar(16),
    longitude varchar(16),
    profile_image varchar(255) default 'default.jpeg',
    social_id varchar(255),
    notified tinyint(1),
    is_verified tinyint(1) default 0,
    is_completed tinyint(1) default 0,
    is_active boolean default 1,
    is_deleted boolean default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);


    create table tbl_user_device (
    id bigint(20) primary key auto_increment,
    user_id bigint(20),
    device_type enum('android', 'macos'),
    device_token varchar(255),
    os_version varchar(128),
    app_version varchar(128),
    time_zone varchar(128),
    user_token varchar(255),
    foreign key (user_id) references tbl_user (id) on delete cascade,
    is_active tinyint(1) default 1,
    is_deleted tinyint(1) default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);

create table tbl_user_otp(
	id bigint(20) primary key auto_increment,
    mobile varchar(16),
    otp varchar(6) not null,
    user_id bigint(20),
    is_active tinyint(1) default 1,
    is_deleted tinyint(1) default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    foreign key (user_id) references tbl_user (id) on delete cascade
);

INSERT INTO tbl_user (
    name, mobile, email, password, login_type, address, location, latitude, longitude,
    profile_image, social_id, notified, is_verified, is_completed,
    is_active, is_deleted
)
VALUES 
(
    'Khushi Tekwani', '9876543210', 'khushi@example.com', MD5('password123'), 'simple',
    '123, MG Road, Mumbai', 'Mumbai', '19.0760', '72.8777',
    'profile1.jpeg', NULL, 1, 1, 1, 1, 0
),
(
    'John Doe', '9123456780', 'john.doe@gmail.com', MD5('johnsecure'), 'google',
    '456, Park Street, New York', 'New York', '40.7128', '-74.0060',
    'john.jpg', 'google-123456', 1, 1, 1, 1, 0
);

INSERT INTO tbl_user_device (
    user_id, device_type, device_token, os_version, app_version, time_zone, user_token
)
VALUES 
(
    1, 'android', 'abc123tokenxyz', '12.0', '1.0.0', 'Asia/Kolkata', 'tokenuser1'
),
(
    2, 'macos', 'xyz789tokenabc', '14.2', '2.5.3', 'America/New_York', 'tokenuser2'
);

