
/* Create table and Inseart data 
 Run this file before running the react application*/


CREATE TABLE `Users` (
	`id` INT NOT NULL AUTO_INCREMENT UNIQUE,
	`username` VARCHAR(50) NOT NULL UNIQUE,
	`hashPassword` VARCHAR(50) NOT NULL,
	`email` VARCHAR(50) NOT NULL,
	PRIMARY KEY (`id`)
);

INSERT INTO Users (username, hashPassword, email)
VALUES ('jane', '1234', 'jane@email.com');

INSERT INTO Users (username, hashPassword, email)
VALUES ('john', '1234', 'john@email.com');

INSERT INTO Users (username, hashPassword, email)
VALUES ('roy', '1234', 'roy@email.com');

INSERT INTO Users (username, hashPassword, email)
VALUES ('lo', '1234', 'lo@email.com');


CREATE TABLE `Saves` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`userId` INT NOT NULL,
	`category` TEXT NOT NULL,
	`movieId` INT,
	`bookId` INT,
	`placeId` INT,
	`private` BOOLEAN NOT NULL DEFAULT 0,
	`archived` BOOLEAN NOT NULL DEFAULT 0,
	`numOfSaves` INT NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`)
);


CREATE TABLE `MovieSaves` (
	`mid` INT NOT NULL AUTO_INCREMENT,
	`moiveTitle` VARCHAR(100) NOT NULL,
	`yearMade` INT,
	`director` VARCHAR(100),
	`movieAPI` INT NOT NULL,
	PRIMARY KEY (`id`)
);


CREATE TABLE `PlaceSaves` (
	`pid` INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100) NOT NULL,
	`address` VARCHAR(255) NOT NULL,
	`placeAPI` VARCHAR(50) NOT NULL,
	PRIMARY KEY (`id`)
);

INSERT INTO PlaceSaves (name, address, placeAPI)
VALUES ('Empire State Building', '20 W 34th St., New York, NY 10001, United States', 'ChIJaXQRs6lZwokRY6EFpJnhNNE');
INSERT INTO Saves (userId, category, placeId, private, archived, numOfSaves)
VALUES ('1', 'place', '1', False, False, 0);

CREATE TABLE `BookSaves` (
	`bid` INT NOT NULL AUTO_INCREMENT,
	`bookTitle` VARCHAR(150) NOT NULL,
	`author` VARCHAR(100) NOT NULL,
	`bookAPI` VARCHAR(50) NOT NULL,
	PRIMARY KEY (`id`)
);

INSERT INTO BookSaves (bookTitle, author, bookAPI)
VALUES ('The Catcher in the Rye', 'J. D. Salinger', 'R-tBPgAACAAJ');
INSERT INTO Saves (userId, category, bookId, private, archived, numOfSaves)
VALUES ('1', 'book', '1', False, False, 0);



CREATE TABLE `SendSaves` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`userId1` INT NOT NULL,
	`userId2` INT NOT NULL,
	`category` TEXT NOT NULL,
	`movieId` INT,
	`bookId` INT,
	`placeId` INT,
	`status` INT NOT NULL DEFAULT 1,
	PRIMARY KEY (`id`)
);


CREATE TABLE `Friends` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`userId1` INT NOT NULL,
	`userId2` INT NOT NULL,
	`status` INT NOT NULL DEFAULT 1,
	PRIMARY KEY (`id`)
);

INSERT INTO Friends (userId1, userId2, status)
VALUES (1, 2, 1);

INSERT INTO Friends (userId1, userId2, status)
VALUES (4, 1, 1);


CREATE TABLE `Likes` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`userId` INT NOT NULL,
	`saveId` INT NOT NULL,
	PRIMARY KEY (`id`)
);

ALTER TABLE `Saves` ADD CONSTRAINT `Saves_fk0` FOREIGN KEY (`userId`) REFERENCES `User`(`id`);

ALTER TABLE `Saves` ADD CONSTRAINT `Saves_fk1` FOREIGN KEY (`movieId`) REFERENCES `MovieSaves`(`id`);

ALTER TABLE `Saves` ADD CONSTRAINT `Saves_fk2` FOREIGN KEY (`bookId`) REFERENCES `BookSaves`(`id`);

ALTER TABLE `Saves` ADD CONSTRAINT `Saves_fk3` FOREIGN KEY (`placeId`) REFERENCES `PlaceSaves`(`id`);

ALTER TABLE `SendSaves` ADD CONSTRAINT `SendSaves_fk0` FOREIGN KEY (`userId1`) REFERENCES `User`(`id`);

ALTER TABLE `SendSaves` ADD CONSTRAINT `SendSaves_fk1` FOREIGN KEY (`userId2`) REFERENCES `User`(`id`);

ALTER TABLE `SendSaves` ADD CONSTRAINT `SendSaves_fk2` FOREIGN KEY (`movieId`) REFERENCES `MovieSaves`(`id`);

ALTER TABLE `SendSaves` ADD CONSTRAINT `SendSaves_fk3` FOREIGN KEY (`bookId`) REFERENCES `BookSaves`(`id`);

ALTER TABLE `SendSaves` ADD CONSTRAINT `SendSaves_fk4` FOREIGN KEY (`placeId`) REFERENCES `PlaceSaves`(`id`);

ALTER TABLE `Friends` ADD CONSTRAINT `Friends_fk0` FOREIGN KEY (`userId1`) REFERENCES `User`(`id`);

ALTER TABLE `Friends` ADD CONSTRAINT `Friends_fk1` FOREIGN KEY (`userId2`) REFERENCES `User`(`id`);

ALTER TABLE `Likes` ADD CONSTRAINT `Likes_fk0` FOREIGN KEY (`userId`) REFERENCES `User`(`id`);

ALTER TABLE `Likes` ADD CONSTRAINT `Likes_fk1` FOREIGN KEY (`saveId`) REFERENCES `Saves`(`id`);


SELECT u.id, u.username FROM Users as u
  LEFT JOIN Friends as f
  ON u.id = F.userId2
  WHERE f.status = 2 and f.userId1 = 1
UNION
SELECT u.id, u.username FROM Users as u
  LEFT JOIN Friends as f
  ON u.id = F.userId1
  WHERE f.status = 2 and f.userId2 = 1;

SELECT s.id, s.userId, s.category, s.movieId, s.bookId, s.placeId, s.private, s.archived, s.numOfSaves FROM Saves as s
  LEFT JOIN Friends as f
  ON s.userId = F.userId2
  WHERE f.status = 2 and f.userId1 = 1
UNION
SELECT s.id, s.userId, s.category, s.movieId, s.bookId, s.placeId, s.private, s.archived, s.numOfSaves FROM Saves as s
  LEFT JOIN Friends as f
  ON s.userId = F.userId1
  WHERE f.status = 2 and f.userId2 = 1




SELECT * FROM Saves as s
  LEFT JOIN Friends as f
  ON s.userId = F.userId2
  WHERE f.status = 2 and f.userId1 = 1
UNION
SELECT * FROM Saves as s
  LEFT JOIN Friends as f
  ON s.userId = F.userId1
  WHERE f.status = 2 and f.userId2 = 1

SELECT * FROM Saves as s 
	LEFT JOIN BookSaves as b on s.bookId = b.bid 
	LEFT JOIN PlaceSaves as p on s.placeId = p.pid 
	LEFT JOIN MovieSaves as m on s.movieId = m.mid	
	ORDER By id DESC;


SELECT * FROM Saves as s
  LEFT JOIN Friends as f
  ON s.userId = F.userId2
  WHERE f.status = 2 and f.userId1 = 1
UNION
SELECT * FROM Saves as s
  LEFT JOIN Friends as f
  ON s.userId = F.userId1
  WHERE f.status = 2 and f.userId2 = 1
	(SELECT * FROM Saves as s 
	LEFT JOIN BookSaves as b on s.bookId = b.bid 
	LEFT JOIN PlaceSaves as p on s.placeId = p.pid 
	LEFT JOIN MovieSaves as m on s.movieId = m.mid	
	ORDER By id DESC;)


SELECT * FROM (SELECT * FROM Saves as s
  LEFT JOIN Friends as f
  ON s.userId = F.userId2
  WHERE f.status = 2 and f.userId1 = 9
UNION
SELECT * FROM Saves as s
  LEFT JOIN Friends as f
  ON s.userId = F.userId1
  WHERE f.status = 2 and f.userId2 = 9) as sa
	LEFT JOIN BookSaves as b on sa.bookId = b.bid 
	LEFT JOIN PlaceSaves as p on sa.placeId = p.pid 
	LEFT JOIN MovieSaves as m on sa.movieId = m.mid	
	ORDER By id DESC;

SELECT * FROM SendSaves as s 
	LEFT JOIN BookSaves as b on s.bookId = b.bid 
	LEFT JOIN PlaceSaves as p on s.placeId = p.pid 
	LEFT JOIN MovieSaves as m on s.movieId = m.mid	
	WHERE userId2 = 9 and status = 1 ORDER By id DESC;