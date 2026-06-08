const { MongoClient } = require("mongodb");

async function run() {
  const client = new MongoClient(
    "mongodb://admin:123467@localhost:27017/?authSource=admin",
  );
  try {
    await client.connect();

    const db = client.db("belstu");

    const faculties = db.collection("faculties");
    const pulpits = db.collection("pulpits");

    await faculties.deleteMany();
    await pulpits.deleteMany();

    await faculties.insertMany([
      {
        FACULTY: "ТОВ",
        FACULTY_NAME: "Технологии органических веществ",
      },
      {
        FACULTY: "ИТ",
        FACULTY_NAME: "Информационных технологий",
      },
      {
        FACULTY: "ХТиТ",
        FACULTY_NAME: "Химические технологии и техника",
      },
    ]);

    await pulpits.insertMany([
      {
        PULPIT: "ТНВиОХТ",
        PULPIT_NAME:
          "Технологии неорганических веществ и общей химической технологии",
        FACULTY: "ХТиТ",
      },
      {
        PULPIT: "ХТЭПиМЭЕ",
        PULPIT_NAME:
          "Химии, технологии электрохимических производств и материалов электронной техники",
        FACULTY: "ХТиТ",
      },
      {
        PULPIT: "ТНХСиППМ",
        PULPIT_NAME:
          "Технологии нефтехимического синтеза и переработки полимерных материалов",
        FACULTY: "ТОВ",
      },
      {
        PULPIT: "ХПД",
        PULPIT_NAME: "Химической переработки древесины",
        FACULTY: "ТОВ",
      },
      {
        PULPIT: "ПИ",
        PULPIT_NAME: "Программная инженерия",
        FACULTY: "ИТ",
      },
      {
        PULPIT: "ИСиТ",
        PULPIT_NAME: "Информационные системы и технологии",
        FACULTY: "ИТ",
      },
    ]);
  } finally {
    await client.close();
  }
}

run();
