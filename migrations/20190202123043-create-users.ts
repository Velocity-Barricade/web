export async function up(sequelize) {
    sequelize.query(`
        CREATE TABLE users (
            id INT unsigned NOT NULL AUTO_INCREMENT,
            name VARCHAR(30) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            degreeProgram VARCHAR(30) NOT NULL,
            createdAt TIMESTAMP NOT NULL,
            updatedAt TIMESTAMP NOT NULL,
            deletedAt TIMESTAMP,
            PRIMARY KEY (id)
        );
    `);

    console.log('*Table users created!*');
}

export async function down(sequelize) {
    sequelize.query(`DROP TABLE users`);
}
