create table if not exists(
	optionid TEXT NOT NULL,
	userid TEXT NOT NULL,
	PRIMARY KEY(optionid, userid)
	FOREIGN KEY(optionid) REFERENCES options(id),
	FOREIGN KEY(userid) REFERENCES users(id)
);