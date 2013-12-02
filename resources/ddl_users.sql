create table if not exists users(
	id TEXT PRIMARY KEY NOT NULL,
	name TEXT NOT NULL,
	pwd TEXT NOT NULL,
	type INTEGER NOT NULL
);