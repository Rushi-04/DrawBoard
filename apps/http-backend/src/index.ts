import express from "express";
import z from "zod";

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    return res.json({
        msg: "Hello from http backend,"
    });
});

app.post('/signup', (req, res) => {
    const {username, password} = req.body;

    const requiredBody = z.object({
        username: z.string().min(3).max(20),
        password: z.string().min(4).max(50),
        email: z.email()
    })
    // const parsedBody =


    return res.json({
        msg: "Hello from http backend,"
    });
});

app.post('/signin', (req, res) => {


    return res.json({
        msg: "Hello from http backend,"
    });
});





app.listen(3001, () => {
    console.log("Running on port 3002...");
});
