export async function up(sequelize) {
  sequelize.query(`
      CREATE TABLE firebaseUsers (
        id INT unsigned NOT NULL AUTO_INCREMENT,
        name VARCHAR(30) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        firebase_uid VARCHAR(128) UNIQUE NOT NULL,
        createdAt TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP NOT NULL,
        deletedAt TIMESTAMP,
        PRIMARY KEY (id)
      );
  `);

  console.log('*Table firebaseUsers created!*');
}

export async function down(sequelize) {
  sequelize.query(`DROP TABLE firebaseUsers`);
}
