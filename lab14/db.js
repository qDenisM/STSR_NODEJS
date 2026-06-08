const sql = require('mssql')
require('dotenv').config()

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
}

let pool

async function getPool() {
    if (pool && pool.connected) {
        return pool
    }
    pool = await sql.connect(config)
    return pool
}

class FacultyService {
    async getFaculties() {
        const pool = await getPool()
        const allFaculties = await pool.query`SELECT * FROM dbo.FACULTY`
        const objectResult = Object.fromEntries(
            allFaculties.recordset.map((item, index) => [`Row ${index}`, item])
        )
        return objectResult
    }

    async addFaculty(newFaculty) {
        const objectNewFaculty = JSON.parse(newFaculty)
        const pool = await getPool()
        await pool
            .request()
            .input('faculty', objectNewFaculty.FACULTY)
            .input('facultyName', objectNewFaculty.FACULTY_NAME)
            .query(`
                INSERT INTO dbo.FACULTY (FACULTY, FACULTY_NAME)
                VALUES (@faculty, @facultyName)
            `)
    }

    async editFaculty(prevFaculty, updFaculty) {
        const objectPrevFaculty = JSON.parse(prevFaculty)
        const objectUpdFaculty = JSON.parse(updFaculty)
        const pool = await getPool()
        await pool
            .request()
            .input('prevFaculty', objectPrevFaculty.FACULTY)
            .input('faculty', objectUpdFaculty.FACULTY)
            .input('facultyName', objectUpdFaculty.FACULTY_NAME)
            .query(`
                UPDATE dbo.FACULTY
                SET FACULTY = @faculty, FACULTY_NAME = @facultyName
                WHERE FACULTY = @prevFaculty
            `)
    }

    async deleteFaculty(facultyCode) {
        const pool = await getPool()
        await pool
            .request()
            .input('faculty', facultyCode)
            .query(`
                DELETE FROM dbo.FACULTY
                WHERE FACULTY = @faculty
            `)
    }
}

class PulpitService {
    async getPulpits() {
        const pool = await getPool()
        const allPulpits = await pool.query`SELECT * FROM dbo.PULPIT`
        const objectResult = Object.fromEntries(
            allPulpits.recordset.map((item, index) => [`Row ${index}`, item])
        )
        return objectResult
    }

    async addPulpit(newPulpit) {
        const objectNewPulpit = JSON.parse(newPulpit)
        const pool = await getPool()
        await pool
            .request()
            .input('pulpit', objectNewPulpit.PULPIT)
            .input('pulpitName', objectNewPulpit.PULPIT_NAME)
            .input('faculty', objectNewPulpit.FACULTY)
            .query(`
                INSERT INTO dbo.PULPIT (PULPIT, PULPIT_NAME, FACULTY)
                VALUES (@pulpit, @pulpitName, @faculty)
            `)
    }

    async editPulpit(prevPulpit, updPulpit) {
        const objectPrevPulpit = JSON.parse(prevPulpit)
        const objectUpdPulpit = JSON.parse(updPulpit)
        const pool = await getPool()
        await pool
            .request()
            .input('prevPulpit', objectPrevPulpit.PULPIT)
            .input('pulpit', objectUpdPulpit.PULPIT)
            .input('pulpitName', objectUpdPulpit.PULPIT_NAME)
            .input('faculty', objectUpdPulpit.FACULTY)
            .query(`
                UPDATE dbo.PULPIT
                SET PULPIT = @pulpit, PULPIT_NAME = @pulpitName, FACULTY = @faculty
                WHERE PULPIT = @prevPulpit
            `)
    }

    async deletePulpit(pulpitCode) {
        const pool = await getPool()
        await pool
            .request()
            .input('pulpit', pulpitCode)
            .query(`
                DELETE FROM dbo.PULPIT
                WHERE PULPIT = @pulpit
            `)
    }
}

class SubjectService {
    async getSubjects() {
        const pool = await getPool()
        const allSubjects = await pool.query`SELECT * FROM dbo.SUBJECT`
        const objectResult = Object.fromEntries(
            allSubjects.recordset.map((item, index) => [`Row ${index}`, item])
        )
        return objectResult
    }

    async addSubject(newSubject) {
        const objectNewSubject = JSON.parse(newSubject)
        const pool = await getPool()
        await pool
            .request()
            .input('subject', objectNewSubject.SUBJECT)
            .input('subjectName', objectNewSubject.SUBJECT_NAME)
            .input('pulpit', objectNewSubject.PULPIT)
            .query(`
                INSERT INTO dbo.SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
                VALUES (@subject, @subjectName, @pulpit)
            `)
    }

    async editSubject(prevSubject, updSubject) {
        const objectPrevSubject = JSON.parse(prevSubject)
        const objectUpdSubject = JSON.parse(updSubject)
        const pool = await getPool()
        await pool
            .request()
            .input('prevSubject', objectPrevSubject.SUBJECT)
            .input('subject', objectUpdSubject.SUBJECT)
            .input('subjectName', objectUpdSubject.SUBJECT_NAME)
            .input('pulpit', objectUpdSubject.PULPIT)
            .query(`
                UPDATE dbo.SUBJECT
                SET SUBJECT = @subject, SUBJECT_NAME = @subjectName, PULPIT = @pulpit
                WHERE SUBJECT = @prevSubject
            `)
    }

    async deleteSubject(subjectCode) {
        const pool = await getPool()
        await pool
            .request()
            .input('subject', subjectCode)
            .query(`
                DELETE FROM dbo.SUBJECT
                WHERE SUBJECT = @subject
            `)
    }
}

class AuditoriumTypeService {
    async getAuditoriumsTypes() {
        const pool = await getPool()
        const allAuditoriumTypes = await pool.query`SELECT * FROM dbo.AUDITORIUM_TYPE`
        const objectResult = Object.fromEntries(
            allAuditoriumTypes.recordset.map((item, index) => [`Row ${index}`, item])
        )
        return objectResult
    }

    async addAuditoriumType(newAuditoriumType) {
        const objectNewAuditoriumType = JSON.parse(newAuditoriumType)
        const pool = await getPool()
        await pool
            .request()
            .input('auditoriumType', objectNewAuditoriumType.AUDITORIUM_TYPE)
            .input('auditoriumTypeName', objectNewAuditoriumType.AUDITORIUM_TYPENAME)
            .query(`
                INSERT INTO dbo.AUDITORIUM_TYPE (AUDITORIUM_TYPE, AUDITORIUM_TYPENAME)
                VALUES (@auditoriumType, @auditoriumTypeName)
            `)
    }

    async editAuditoriumType(prevAuditoriumType, updAuditoriumType) {
        const objectPrevAuditoriumType = JSON.parse(prevAuditoriumType)
        const objectUpdAuditoriumType = JSON.parse(updAuditoriumType)
        const pool = await getPool()
        await pool
            .request()
            .input('prevAuditoriumType', objectPrevAuditoriumType.AUDITORIUM_TYPE)
            .input('auditoriumType', objectUpdAuditoriumType.AUDITORIUM_TYPE)
            .input('auditoriumTypeName', objectUpdAuditoriumType.AUDITORIUM_TYPENAME)
            .query(`
                UPDATE dbo.AUDITORIUM_TYPE
                SET AUDITORIUM_TYPE = @auditoriumType, AUDITORIUM_TYPENAME = @auditoriumTypeName
                WHERE AUDITORIUM_TYPE = @prevAuditoriumType
            `)
    }

    async deleteAuditoriumType(auditoriumTypeCode) {
        const pool = await getPool()
        await pool
            .request()
            .input('auditoriumType', auditoriumTypeCode)
            .query(`
                DELETE FROM dbo.AUDITORIUM_TYPE
                WHERE AUDITORIUM_TYPE = @auditoriumType
            `)
    }
}

class AuditoriumService {
    async getAuditoriums() {
        const pool = await getPool()
        const allAuditoriums = await pool.query`SELECT * FROM dbo.AUDITORIUM`
        const objectResult = Object.fromEntries(
            allAuditoriums.recordset.map((item, index) => [`Row ${index}`, item])
        )
        return objectResult
    }

    async addAuditorium(newAuditorium) {
        const objectNewAuditorium = JSON.parse(newAuditorium)
        const pool = await getPool()
        await pool
            .request()
            .input('auditorium', objectNewAuditorium.AUDITORIUM)
            .input('auditoriumName', objectNewAuditorium.AUDITORIUM_NAME)
            .input('auditoriumCapacity', objectNewAuditorium.AUDITORIUM_CAPACITY)
            .input('auditoriumType', objectNewAuditorium.AUDITORIUM_TYPE)
            .query(`
                INSERT INTO dbo.AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_CAPACITY, AUDITORIUM_TYPE)
                VALUES (@auditorium, @auditoriumName, @auditoriumCapacity, @auditoriumType)
            `)
    }

    async editAuditorium(prevAuditorium, updAuditorium) {
        const objectPrevAuditorium = JSON.parse(prevAuditorium)
        const objectUpdAuditorium = JSON.parse(updAuditorium)
        const pool = await getPool()
        await pool
            .request()
            .input('prevAuditorium', objectPrevAuditorium.AUDITORIUM)
            .input('auditorium', objectUpdAuditorium.AUDITORIUM)
            .input('auditoriumName', objectUpdAuditorium.AUDITORIUM_NAME)
            .input('auditoriumCapacity', objectUpdAuditorium.AUDITORIUM_CAPACITY)
            .input('auditoriumType', objectUpdAuditorium.AUDITORIUM_TYPE)
            .query(`
                UPDATE dbo.AUDITORIUM
                SET AUDITORIUM = @auditorium, AUDITORIUM_NAME = @auditoriumName,
                    AUDITORIUM_CAPACITY = @auditoriumCapacity, AUDITORIUM_TYPE = @auditoriumType
                WHERE AUDITORIUM = @prevAuditorium
            `)
    }

    async deleteAuditorium(auditoriumCode) {
        const pool = await getPool()
        await pool
            .request()
            .input('auditorium', auditoriumCode)
            .query(`
                DELETE FROM dbo.AUDITORIUM
                WHERE AUDITORIUM = @auditorium
            `)
    }
}

module.exports = {FacultyService, PulpitService, SubjectService, AuditoriumTypeService, AuditoriumService}