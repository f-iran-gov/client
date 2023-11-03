CREATE TABLE `servers` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`ip` text NOT NULL,
	`port` integer NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`country` text NOT NULL,
	`country_code` text NOT NULL
);
