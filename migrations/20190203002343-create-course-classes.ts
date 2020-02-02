export async function up(sequelize) {
  sequelize.query(`
      CREATE TABLE courseClasses (
          id INT unsigned NOT NULL AUTO_INCREMENT,
          course_id INT unsigned NOT NULL,
          venue VARCHAR(30) NOT NULL,
          time VARCHAR(30) NOT NULL,
          day SMALLINT NOT NULL,
          isHardCoded BOOLEAN DEFAULT 0,
          PRIMARY KEY (id),
          FOREIGN KEY (course_id) REFERENCES courses(id)
      );
  `);

  console.log('*Table courseClasses created!*');
}

export async function down(sequelize) {
  sequelize.query(`DROP TABLE courseClasses`);
}
