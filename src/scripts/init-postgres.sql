CREATE TABLE mytable (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

INSERT INTO mytable (name) VALUES ('sample data');
