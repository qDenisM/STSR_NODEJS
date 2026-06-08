exports.addUser =  (req, res) => {
    res.send("Добавление пользователя");
};
exports.getUsers = (req, res) => {
    res.send("Список пользователей");
};

exports.getUser = (req, res) => {
    res.send(`Пользовать с ID = ${req.params.id}`)
}