export async function up(sequelize) {
  sequelize.query(`
      CREATE TABLE userCourses (
          id INT unsigned NOT NULL AUTO_INCREMENT,
          user_email VARCHAR(64) NOT NULL,
          course_id INT unsigned NOT NULL,
          PRIMARY KEY (id)
      );
  `);

  console.log('*Table userCourses created!*');
}

export async function down(sequelize) {
  sequelize.query(`DROP TABLE userCourses`);
}
