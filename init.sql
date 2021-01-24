CREATE DATABASE IF NOT EXISTS organization_structure;
USE organization_structure;
CREATE TABLE IF NOT EXISTS organization_structure.hierarchy_nodes (
	id VARCHAR(255) NOT NULL,
	`path` LONG VARCHAR NULL,
	CONSTRAINT hierarchy_nodes_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8
COLLATE=utf8_general_ci;
CREATE INDEX IF NOT EXISTS hierarchy_nodes_path_IDX USING BTREE ON organization_structure.hierarchy_nodes (`path`);
