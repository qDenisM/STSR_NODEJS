const resolvers = {
  Query: {
    get_faculties: async ({ faculty }, { db }) => {
      const result = await db.getFaculties(faculty);
      if (!result) return [];
      return Array.isArray(result) ? result : [result];
    },
    get_pulpits: async ({ pulpit }, { db }) => {
      const result = await db.getPulpits(pulpit);
      if (!result) return [];
      return Array.isArray(result) ? result : [result];
    },
    get_teachers: async ({ teacher }, { db }) => {
      const result = await db.getTeachers(teacher);
      if (!result) return [];
      return Array.isArray(result) ? result : [result];
    },
    get_subjects: async ({ subject }, { db }) => {
      const result = await db.getSubjects(subject);
      if (!result) return [];
      return Array.isArray(result) ? result : [result];
    },

    get_teachers_by_faculty: ({ faculty }, { db }) => db.getTeachersByFaculty(faculty),
    get_subjects_by_faculties: ({ faculty }, { db }) => db.getSubjectsByFaculties(faculty),
  },

  Mutation: {
    set_faculty: (args, { db }) => db.setFaculty(args.faculty),
    set_pulpit: (args, { db }) => db.setPulpit(args.pulpit),
    set_teacher: (args, { db }) => db.setTeacher(args.teacher),
    set_subject: (args, { db }) => db.setSubject(args.subject),

    del_faculty: ({ faculty }, { db }) => db.delFaculty(faculty),
    del_pulpit: ({ pulpit }, { db }) => db.delPulpit(pulpit),
    del_teacher: ({ teacher }, { db }) => db.delTeacher(teacher),
    del_subject: ({ subject }, { db }) => db.delSubject(subject),
  },
};

module.exports = { resolvers };
