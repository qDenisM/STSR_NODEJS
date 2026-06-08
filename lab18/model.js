const { Sequelize, DataTypes, Model } = require("sequelize");

class Faculty extends Model {}
class Pulpit extends Model {}
class Teacher extends Model {}
class Subject extends Model {}
class Auditorium_type extends Model {}
class Auditorium extends Model {}

function initORM(sequelize) {
    Faculty.init(
        {
            faculty: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            faculty_name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize, 
            modelName: 'Faculty', 
            tableName: 'Faculty', 
            timestamps: false
        }
    )
    Pulpit.init(
        {
            pulpit: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            pulpit_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            faculty: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: Faculty,
                    key: 'faculty'
                }
            }
        },
        {
            sequelize, 
            modelName: 'Pulpit', 
            tableName: 'Pulpit', 
            timestamps: false
        }
    )
    Teacher.init(
        {
            teacher: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            teacher_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            pulpit: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: Pulpit,
                    key: 'pulpit'
                }
            }
        },
        {
            sequelize, 
            modelName: 'Teacher', 
            tableName: 'Teacher', 
            timestamps: false
        }
    )
    Subject.init(
        {
            subject: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            subject_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            pulpit: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: Pulpit,
                    key: 'pulpit'
                }
            }
        },
        {
            sequelize, 
            modelName: 'Subject', 
            tableName: 'Subject', 
            timestamps: false
        }
    )
    Auditorium_type.init(
        {
            auditorium_type: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            auditorium_typename: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize, 
            modelName: 'Auditorium_type', 
            tableName: 'Auditorium_type', 
            timestamps: false
        }
    )
    Auditorium.init(
        {
            auditorium: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            auditorium_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            auditorium_capacity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            auditorium_type: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: Auditorium_type,
                    key: 'auditorium_type'
                }
            }
        },
        {
            sequelize, 
            modelName: 'Auditorium', 
            tableName: 'Auditorium', 
            timestamps: false
        }
    )
}

module.exports.initORM = (s) => {
    initORM(s)
    return {
        Faculty,
        Pulpit,
        Teacher,
        Subject,
        Auditorium_type,
        Auditorium
    }
}