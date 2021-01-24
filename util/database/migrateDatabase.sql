USE `ruDB`;

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(500) NOT NULL,
  `id_uffs` VARCHAR(255),
  `name` VARCHAR(255),
  `cpf` VARCHAR (20),
  `qr_code` VARCHAR (550),
  `avatar` VARCHAR (550),
  `balance` REAL NOT NULL DEFAULT '0.0',
  CONSTRAINT unique_email UNIQUE (email),
  CONSTRAINT unique_qr_code UNIQUE (qr_code),
  CONSTRAINT unique_cpf UNIQUE (cpf)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Returns type like incoming, outcoming by value positive or negative, */
CREATE TABLE IF NOT EXISTS `transfer_history` (
  `id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255),
  `value` REAL NOT NULL DEFAULT '0.0',
  `date_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` INT(11) NOT NULL,
  CONSTRAINT `fk_user_transfer_history`
    FOREIGN KEY (`user_id`)
      REFERENCES `user` (`id`)
      ON DELETE CASCADE
      ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
