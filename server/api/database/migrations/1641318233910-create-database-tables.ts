import {MigrationInterface, QueryRunner} from "typeorm";

export class createDatabaseTables1641318233910 implements MigrationInterface {
    name = 'createDatabaseTables1641318233910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`conversations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` bigint NOT NULL, \`senderId\` bigint NOT NULL, \`lastMessage\` text NOT NULL, \`seen\` tinyint NOT NULL, \`unseenNumbers\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`messages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`senderId\` bigint NOT NULL, \`receiverId\` bigint NOT NULL, \`content\` text NULL, \`file\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_profile\` (\`id\` int NOT NULL AUTO_INCREMENT, \`phone\` varchar(16) NULL, \`coverPhoto\` varchar(255) NULL, \`gender\` enum ('male', 'female') NULL DEFAULT 'male', \`address\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`username\` varchar(25) NULL, UNIQUE INDEX \`IDX_dfc56fdfea231096490fd7620f\` (\`phone\`), UNIQUE INDEX \`REL_4a1ea7a18428c8a6b8d553b7c4\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_verification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`emailVerified\` enum ('0', '1') NOT NULL DEFAULT '0', \`emailVerifiedAt\` datetime NULL, \`passwordVerificationToken\` varchar(255) NULL, \`passwordVerificationTokenExpiry\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`username\` varchar(25) NULL, UNIQUE INDEX \`REL_7f814318a94e40836fc8088db5\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(20) NOT NULL, \`lastName\` varchar(20) NOT NULL, \`username\` varchar(25) NOT NULL, \`email\` varchar(50) NOT NULL, \`photo\` varchar(255) NULL, \`active\` enum ('0', '1') NOT NULL DEFAULT '0', \`password\` varchar(100) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users_profile\` ADD CONSTRAINT \`FK_4a1ea7a18428c8a6b8d553b7c46\` FOREIGN KEY (\`username\`) REFERENCES \`users\`(\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_verification\` ADD CONSTRAINT \`FK_7f814318a94e40836fc8088db51\` FOREIGN KEY (\`username\`) REFERENCES \`users\`(\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_verification\` DROP FOREIGN KEY \`FK_7f814318a94e40836fc8088db51\``);
        await queryRunner.query(`ALTER TABLE \`users_profile\` DROP FOREIGN KEY \`FK_4a1ea7a18428c8a6b8d553b7c46\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_7f814318a94e40836fc8088db5\` ON \`users_verification\``);
        await queryRunner.query(`DROP TABLE \`users_verification\``);
        await queryRunner.query(`DROP INDEX \`REL_4a1ea7a18428c8a6b8d553b7c4\` ON \`users_profile\``);
        await queryRunner.query(`DROP INDEX \`IDX_dfc56fdfea231096490fd7620f\` ON \`users_profile\``);
        await queryRunner.query(`DROP TABLE \`users_profile\``);
        await queryRunner.query(`DROP TABLE \`messages\``);
        await queryRunner.query(`DROP TABLE \`conversations\``);
    }

}
