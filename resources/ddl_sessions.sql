create table if not exists sessions(
	name TEXT NOT NULL,
	key TEXT NOT NULL,
	PRIMARY KEY(name, key)
);