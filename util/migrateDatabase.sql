USE `ruDB`;

CREATE TABLE IF NOT EXISTS `lorem` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `word` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;