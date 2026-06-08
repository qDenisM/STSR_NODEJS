const express = require('express')
const userRouter = require("./routes/userRouter.js");
const homeRouter = require("./routes/homeRouter.js");

const PORT = 8080
 
const app = express()

app.use("/users", userRouter);;
app.use("/", homeRouter);
 
app.use((req, res, next) => {
    res.status(404).send("Not Found")
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))