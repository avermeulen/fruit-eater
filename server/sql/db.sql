create database fruit_eater_app;
create role fruit_eater login password 'eat123';
grant all privileges on database fruit_eater_app to fruit_eater;