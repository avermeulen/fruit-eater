drop table fruit_eaten;
drop table fruit_eater;

create table fruit_eater (
	id serial not null primary key,
	username text unique not null,
	password text not null
);

create table fruit_eaten (
	id serial not null primary key,
	fruit_name text not null,
	counter int default 0,
	user_id int,
	foreign key (user_id) references fruit_eater(id)
);
