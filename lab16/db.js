const mssql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function getPool() {
  const pool = await mssql.connect(config);
  return pool;
}

class DB {
  constructor(pool, data) {
    this.pool = pool;
    this.faculties = data.faculties;
    this.pulpits = data.pulpits;
    this.subjects = data.subjects;
    this.teachers = data.teachers;
  }

  static async init() {
    const pool = await getPool();
    const [faculties, pulpits, subjects, teachers] = await Promise.all([
      pool.request().query("SELECT * FROM dbo.FACULTY"),
      pool.request().query("SELECT * FROM dbo.PULPIT"),
      pool.request().query("SELECT * FROM dbo.SUBJECT"),
      pool.request().query("SELECT * FROM dbo.TEACHER"),
    ]);
    return new DB(pool, {
      faculties: faculties.recordset,
      pulpits: pulpits.recordset,
      subjects: subjects.recordset,
      teachers: teachers.recordset,
    });
  }

  async getFaculties(facultyCode) {
    if (facultyCode) {
      const result = await this.pool
        .request()
        .input("facultyCode", facultyCode)
        .query("SELECT * FROM dbo.FACULTY WHERE FACULTY = @facultyCode");
      return result.recordset[0] ?? null;
    } else {
      return this.faculties;
    }
  }

  async getPulpits(pulpitCode) {
    if (pulpitCode) {
      const result = await this.pool
        .request()
        .input("pulpitCode", pulpitCode)
        .query("SELECT * FROM dbo.PULPIT WHERE PULPIT = @pulpitCode");
      return result.recordset[0] ?? null;
    } else {
      return this.pulpits;
    }
  }

  async getSubjects(subjectCode) {
    if (subjectCode) {
      const result = await this.pool
        .request()
        .input("subjectCode", subjectCode)
        .query("SELECT * FROM dbo.SUBJECT WHERE SUBJECT = @subjectCode");
      return result.recordset[0] ?? null;
    } else {
      return this.subjects;
    }
  }

  async getTeachers(teacherCode) {
    if (teacherCode) {
      const result = await this.pool
        .request()
        .input("teacherCode", teacherCode)
        .query("SELECT * FROM dbo.TEACHER WHERE TEACHER = @teacherCode");
      return result.recordset[0] ?? null;
    } else {
      return this.teachers;
    }
  }

  async setFaculty(faculty) {
    const existFaculty = await this.pool
      .request()
      .input("faculty", faculty.FACULTY).query(`
        SELECT COUNT(*) AS amount FROM dbo.FACULTY
        WHERE FACULTY = @faculty    
    `);
    if (existFaculty.recordset[0].amount > 0) {
      await this.pool
        .request()
        .input("faculty", faculty.FACULTY)
        .input("faculty_name", faculty.FACULTY_NAME).query(`
            UPDATE dbo.FACULTY
            SET FACULTY_NAME = @faculty_name
            WHERE FACULTY = @faculty    
        `);
    } else {
      await this.pool
        .request()
        .input("faculty", faculty.FACULTY)
        .input("faculty_name", faculty.FACULTY_NAME).query(`
            INSERT INTO dbo.FACULTY(FACULTY, FACULTY_NAME) 
            VALUES (@faculty, @faculty_name)
        `);
    }
    return faculty;
  }

  async setPulpit(pulpit) {
    const existPulpit = await this.pool.request().input("pulpit", pulpit.PULPIT)
      .query(`
        SELECT COUNT(*) AS amount FROM dbo.PULPIT
        WHERE PULPIT = @pulpit    
    `);
    if (existPulpit.recordset[0].amount > 0) {
      await this.pool
        .request()
        .input("pulpit", pulpit.PULPIT)
        .input("pulpit_name", pulpit.PULPIT_NAME)
        .input("faculty", pulpit.FACULTY).query(`
            UPDATE dbo.PULPIT
            SET PULPIT_NAME = @pulpit_name, FACULTY = @faculty
            WHERE PULPIT = @pulpit    
        `);
    } else {
      await this.pool
        .request()
        .input("pulpit", pulpit.PULPIT)
        .input("pulpit_name", pulpit.PULPIT_NAME)
        .input("faculty", pulpit.FACULTY).query(`
            INSERT INTO dbo.PULPIT(PULPIT, PULPIT_NAME, FACULTY) 
            VALUES (@pulpit, @pulpit_name, @faculty)
        `);
    }
    return pulpit;
  }

  async setSubject(subject) {
    const existSubject = await this.pool
      .request()
      .input("subject", subject.SUBJECT).query(`
        SELECT COUNT(*) AS amount FROM dbo.SUBJECT
        WHERE SUBJECT = @subject    
    `);
    if (existSubject.recordset[0].amount > 0) {
      await this.pool
        .request()
        .input("subject", subject.SUBJECT)
        .input("subject_name", subject.SUBJECT_NAME)
        .input("pulpit", subject.PULPIT).query(`
            UPDATE dbo.SUBJECT
            SET SUBJECT_NAME = @subject_name, PULPIT = @pulpit
            WHERE SUBJECT = @subject    
        `);
    } else {
      await this.pool
        .request()
        .input("subject", subject.SUBJECT)
        .input("subject_name", subject.SUBJECT_NAME)
        .input("pulpit", subject.PULPIT).query(`
            INSERT INTO dbo.SUBJECT(SUBJECT, SUBJECT_NAME, PULPIT) 
            VALUES (@subject, @subject_name, @pulpit)
        `);
    }
    return subject;
  }

  async setTeacher(teacher) {
    const existTeacher = await this.pool
      .request()
      .input("teacher", teacher.TEACHER).query(`
        SELECT COUNT(*) AS amount FROM dbo.TEACHER
        WHERE TEACHER = @teacher    
    `);
    if (existTeacher.recordset[0].amount > 0) {
      await this.pool
        .request()
        .input("teacher", teacher.TEACHER)
        .input("teacher_name", teacher.TEACHER_NAME)
        .input("pulpit", teacher.PULPIT).query(`
            UPDATE dbo.TEACHER
            SET TEACHER_NAME = @teacher_name, PULPIT = @pulpit
            WHERE TEACHER = @teacher    
        `);
    } else {
      await this.pool
        .request()
        .input("teacher", teacher.TEACHER)
        .input("teacher_name", teacher.TEACHER_NAME)
        .input("pulpit", teacher.PULPIT).query(`
            INSERT INTO dbo.TEACHER(TEACHER, TEACHER_NAME, PULPIT) 
            VALUES (@teacher, @teacher_name, @pulpit)
        `);
    }
    return teacher;
  }

  async delFaculty(facultyCode) {
    const existFaculty = await this.pool
      .request()
      .input("facultyCode", facultyCode).query(`
        SELECT COUNT(*) AS amount FROM dbo.FACULTY
        WHERE FACULTY = @facultyCode    
    `);
    if (existFaculty.recordset[0].amount > 0) {
      await this.pool.request().input("facultyCode", facultyCode).query(`
            DELETE FROM dbo.FACULTY
            WHERE FACULTY = @facultyCode    
        `);
      return true;
    } else {
      return false;
    }
  }

  async delPulpit(pulpitCode) {
    const existPulpit = await this.pool
      .request()
      .input("pulpitCode", pulpitCode).query(`
        SELECT COUNT(*) AS amount FROM dbo.PULPIT
        WHERE PULPIT = @pulpitCode    
    `);
    if (existPulpit.recordset[0].amount > 0) {
      await this.pool.request().input("pulpitCode", pulpitCode).query(`
            DELETE FROM dbo.PULPIT
            WHERE PULPIT = @pulpitCode    
        `);
      return true;
    } else {
      return false;
    }
  }

  async delSubject(subjectCode) {
    const existSubject = await this.pool
      .request()
      .input("subjectCode", subjectCode).query(`
        SELECT COUNT(*) AS amount FROM dbo.SUBJECT
        WHERE SUBJECT = @subjectCode    
    `);
    if (existSubject.recordset[0].amount > 0) {
      await this.pool.request().input("subjectCode", subjectCode).query(`
            DELETE FROM dbo.SUBJECT
            WHERE SUBJECT = @subjectCode    
        `);
      return true;
    } else {
      return false;
    }
  }

  async delTeacher(teacherCode) {
    const existTeacher = await this.pool
      .request()
      .input("teacherCode", teacherCode).query(`
        SELECT COUNT(*) AS amount FROM dbo.TEACHER
        WHERE TEACHER = @teacherCode    
    `);

    if (existTeacher.recordset[0].amount > 0) {
      await this.pool.request().input("teacherCode", teacherCode).query(`
            DELETE FROM dbo.TEACHER
            WHERE TEACHER = @teacherCode    
        `);
      return true;
    } else {
      return false;
    }
  }

  async getTeachersByFaculty(facultyCode) {
    const result = await this.pool.request().input("facultyCode", facultyCode)
      .query(`
      SELECT dbo.TEACHER.*
      FROM dbo.TEACHER
      INNER JOIN dbo.PULPIT ON dbo.TEACHER.PULPIT = dbo.PULPIT.PULPIT
      WHERE dbo.PULPIT.FACULTY = @facultyCode
    `);
    return result.recordset
  }

  async getSubjectsByFaculties(facultyCode) {
    const pulpitsResult = await this.pool
      .request()
      .input("facultyCode", facultyCode).query(`
      SELECT *
      FROM dbo.PULPIT
      WHERE FACULTY = @facultyCode
    `);

    const pulpits = pulpitsResult.recordset;

    if (pulpits.length === 0) {
      return [];
    }

    const subjectsResult = await this.pool
      .request()
      .input("facultyCode", facultyCode).query(`
      SELECT dbo.SUBJECT.*
      FROM dbo.SUBJECT
      INNER JOIN dbo.PULPIT ON dbo.SUBJECT.PULPIT = dbo.PULPIT.PULPIT
      WHERE dbo.PULPIT.FACULTY = @facultyCode
    `);

    const subjects = subjectsResult.recordset;

    return pulpits.map((pulpit) => ({
      ...pulpit,
      subjects: subjects.filter((subject) => subject.PULPIT === pulpit.PULPIT),
    }));
  }
}

module.exports = { DB }