BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "log" (
	"id"	INTEGER UNIQUE,
	"side"	TEXT,
	"luck"	TEXT,
	"image"	TEXT,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "shop" (
	"id"	INTEGER NOT NULL DEFAULT 0 UNIQUE,
	"name"	TEXT,
	"main"	TEXT,
	"price"	INTEGER,
	"page"	INTEGER,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "data" (
	"id"	INTEGER NOT NULL UNIQUE,
	"user"	TEXT,
	"uid"	TEXT,
	"level"	INTEGER NOT NULL DEFAULT 1,
	"exp"	INTEGER NOT NULL DEFAULT 0,
	"money"	INTEGER NOT NULL DEFAULT 0,
	"luck"	TEXT NOT NULL DEFAULT '無',
	"number"	INTEGER DEFAULT '',
	"side"	TEXT NOT NULL DEFAULT 'N/A',
	"term"	TEXT NOT NULL DEFAULT 'N/A',
	"pray"	INTEGER NOT NULL DEFAULT 0,
	"work"	INTEGER NOT NULL DEFAULT 0,
	"sine"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "character" (
	"id"	INTEGER NOT NULL UNIQUE,
	"page"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"color"	TEXT,
	"avatar"	TEXT NOT NULL,
	PRIMARY KEY("id")
);
COMMIT;