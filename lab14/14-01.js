const http = require('http')
const fs = require('fs')
const path = require('path')
const {
    FacultyService,
    PulpitService,
    SubjectService,
    AuditoriumTypeService,
    AuditoriumService,
} = require('./db.js')

const PORT = 8080

const facultyService = new FacultyService()
const pulpitService = new PulpitService()
const subjectService = new SubjectService()
const auditoriumTypeService = new AuditoriumTypeService()
const auditoriumService = new AuditoriumService()

function readBody(req) {
    return new Promise((resolve, reject) => {
        let data = ''
        req.on('data', (chunk) => {
            data += chunk.toString()
        })
        req.on('end', () => resolve(data))
        req.on('error', reject)
    })
}

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, {
        'content-type': 'application/json',
    })
    res.end(JSON.stringify(payload))
}

async function handleGet(res, getFn) {
    try {
        const result = await getFn()
        sendJson(res, 200, result)
    } catch (err) {
        sendJson(res, 500, {
            error: 1,
            message: err.message,
        })
    }
}

async function handlePost(res, addFn, req) {
    try {
        const data = await readBody(req)
        await addFn(data)
        sendJson(res, 200, JSON.parse(data))
    } catch (err) {
        sendJson(res, 500, {
            error: 1,
            message: err.message,
        })
    }
}

async function handlePut(res, editFn, req) {
    try {
        const data = await readBody(req)
        const body = JSON.parse(data)
        await editFn(JSON.stringify(body.prev), JSON.stringify(body.upd))
        sendJson(res, 200, body.upd)
    } catch (err) {
        sendJson(res, 500, {
            error: 1,
            message: err.message,
        })
    }
}

async function handleDelete(res, getFn, deleteFn, code, keyField) {
    try {
        const all = await getFn()
        const deleted = Object.values(all).find((item) => item[keyField] === code)
        if (!deleted) {
            sendJson(res, 404, {
                error: 2,
                message: `Запись с кодом ${code} не найдена`,
            })
            return
        }
        await deleteFn(code)
        sendJson(res, 200, deleted)
    } catch (err) {
        sendJson(res, 500, {
            error: 1,
            message: err.message,
        })
    }
}

const routes = [
    {
        method: 'GET',
        pattern: new URLPattern({ pathname: '/' }),
        handler: (req, res) => {
            fs.readFile(path.join(__dirname, '14-01.html'), (err, data) => {
                if (err) {
                    sendJson(res, 500, {
                        error: 1,
                        message: 'Ошибка чтения файла 14-01.html',
                    })
                    return
                }
                res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
                res.end(data)
            })
        },
    },
    {
        method: 'GET',
        pattern: new URLPattern({ pathname: '/api/faculties' }),
        handler: (req, res) => handleGet(res, () => facultyService.getFaculties()),
    },
    {
        method: 'GET',
        pattern: new URLPattern({ pathname: '/api/pulpits' }),
        handler: (req, res) => handleGet(res, () => pulpitService.getPulpits()),
    },
    {
        method: 'GET',
        pattern: new URLPattern({ pathname: '/api/subjects' }),
        handler: (req, res) => handleGet(res, () => subjectService.getSubjects()),
    },
    {
        method: 'GET',
        pattern: new URLPattern({ pathname: '/api/auditoriumstypes' }),
        handler: (req, res) =>
            handleGet(res, () => auditoriumTypeService.getAuditoriumsTypes()),
    },
    {
        method: 'GET',
        pattern: new URLPattern({ pathname: '/api/auditoriums' }),
        handler: (req, res) => handleGet(res, () => auditoriumService.getAuditoriums()),
    },
    {
        method: 'POST',
        pattern: new URLPattern({ pathname: '/api/faculties' }),
        handler: (req, res) => handlePost(res, (data) => facultyService.addFaculty(data), req),
    },
    {
        method: 'POST',
        pattern: new URLPattern({ pathname: '/api/pulpits' }),
        handler: (req, res) => handlePost(res, (data) => pulpitService.addPulpit(data), req),
    },
    {
        method: 'POST',
        pattern: new URLPattern({ pathname: '/api/subjects' }),
        handler: (req, res) => handlePost(res, (data) => subjectService.addSubject(data), req),
    },
    {
        method: 'POST',
        pattern: new URLPattern({ pathname: '/api/auditoriumstypes' }),
        handler: (req, res) =>
            handlePost(res, (data) => auditoriumTypeService.addAuditoriumType(data), req),
    },
    {
        method: 'POST',
        pattern: new URLPattern({ pathname: '/api/auditoriums' }),
        handler: (req, res) =>
            handlePost(res, (data) => auditoriumService.addAuditorium(data), req),
    },
    {
        method: 'PUT',
        pattern: new URLPattern({ pathname: '/api/faculties' }),
        handler: (req, res) =>
            handlePut(res, (prev, upd) => facultyService.editFaculty(prev, upd), req),
    },
    {
        method: 'PUT',
        pattern: new URLPattern({ pathname: '/api/pulpits' }),
        handler: (req, res) =>
            handlePut(res, (prev, upd) => pulpitService.editPulpit(prev, upd), req),
    },
    {
        method: 'PUT',
        pattern: new URLPattern({ pathname: '/api/subjects' }),
        handler: (req, res) =>
            handlePut(res, (prev, upd) => subjectService.editSubject(prev, upd), req),
    },
    {
        method: 'PUT',
        pattern: new URLPattern({ pathname: '/api/auditoriumstypes' }),
        handler: (req, res) =>
            handlePut(res, (prev, upd) =>
                auditoriumTypeService.editAuditoriumType(prev, upd),
            req),
    },
    {
        method: 'PUT',
        pattern: new URLPattern({ pathname: '/auditoriums' }),
        handler: (req, res) =>
            handlePut(res, (prev, upd) => auditoriumService.editAuditorium(prev, upd), req),
    },
    {
        method: 'DELETE',
        pattern: new URLPattern({ pathname: '/api/faculties/:code' }),
        handler: (req, res, match) =>
            handleDelete(
                res,
                () => facultyService.getFaculties(),
                (code) => facultyService.deleteFaculty(code),
                match.pathname.groups.code,
                'FACULTY',
            ),
    },
    {
        method: 'DELETE',
        pattern: new URLPattern({ pathname: '/api/pulpits/:code' }),
        handler: (req, res, match) =>
            handleDelete(
                res,
                () => pulpitService.getPulpits(),
                (code) => pulpitService.deletePulpit(code),
                match.pathname.groups.code,
                'PULPIT',
            ),
    },
    {
        method: 'DELETE',
        pattern: new URLPattern({ pathname: '/api/subjects/:code' }),
        handler: (req, res, match) =>
            handleDelete(
                res,
                () => subjectService.getSubjects(),
                (code) => subjectService.deleteSubject(code),
                match.pathname.groups.code,
                'SUBJECT',
            ),
    },
    {
        method: 'DELETE',
        pattern: new URLPattern({ pathname: '/api/auditoriumtypes/:code' }),
        handler: (req, res, match) =>
            handleDelete(
                res,
                () => auditoriumTypeService.getAuditoriumsTypes(),
                (code) => auditoriumTypeService.deleteAuditoriumType(code),
                match.pathname.groups.code,
                'AUDITORIUM_TYPE',
            ),
    },
    {
        method: 'DELETE',
        pattern: new URLPattern({ pathname: '/api/auditoriums/:code' }),
        handler: (req, res, match) =>
            handleDelete(
                res,
                () => auditoriumService.getAuditoriums(),
                (code) => auditoriumService.deleteAuditorium(code),
                match.pathname.groups.code,
                'AUDITORIUM',
            ),
    },
]

http
    .createServer((req, res) => {
        for (const route of routes) {
            if (route.method !== req.method) continue
            const match = route.pattern.exec(req.url)
            if (match) {
                Promise.resolve(route.handler(req, res, match)).catch((err) => {
                    if (!res.headersSent) {
                        sendJson(res, 500, {
                            error: 1,
                            message: err.message,
                        })
                    }
                })
                return
            }
        }
        sendJson(res, 404, {
            error: 2,
            message: 'Маршрут не найден',
        })
    })
    .listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })