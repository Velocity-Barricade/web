export async function up(sequelize) {
  sequelize.query(`
      CREATE TABLE courses (
          id INT unsigned NOT NULL AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          PRIMARY KEY (id)
      );
  `);

  console.log('*Table course created!*');
}

export async function down(sequelize) {
  sequelize.query(`DROP TABLE courses`);
}
