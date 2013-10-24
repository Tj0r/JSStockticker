create table if not exists stockvalue(
	optionid TEXT NOT NULL,
	price INTEGER NOT NULL,
	time INTEGER NOT NULL,
	PRIMARY KEY(optionid, time),
	FOREIGN KEY(optionid) REFERENCES options(id)
);