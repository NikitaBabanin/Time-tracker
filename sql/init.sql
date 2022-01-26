
CREATE TABLE person(
	id SERIAL PRIMARY KEY,
	email VARCHAR(255),
	username VARCHAR(255),
	password VARCHAR(255)
);

CREATE TABLE time(
	id SERIAL PRIMARY KEY,
	date VARCHAR(255),
	description VARCHAR(255),
	hours INTEGER,
	user_id INTEGER,
	FOREIGN KEY (user_id) REFERENCES person (id)
);