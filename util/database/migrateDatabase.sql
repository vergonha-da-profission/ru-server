USE `ruDB`;

CREATE TABLE IF NOT EXISTS `lorem` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `word` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(500) NOT NULL,
  `id_uffs` VARCHAR(255),
  `name` VARCHAR(255),
  `cpf` VARCHAR (20),
  CONSTRAINT unique_email UNIQUE (email),
  CONSTRAINT unique_id_uffs UNIQUE (id_uffs),
  CONSTRAINT unique_cpf UNIQUE (cpf)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
