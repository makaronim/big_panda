const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const port = 8080;
const db = "mongodb://localhost:27017/big_panda";

const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log('MongoDB successfully connected')
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
}
connectDB();

const Comments = require('./models/Comments');

app.use(cors());
app.use(bodyParser.json());

app.get('/comments/get', async (req, res) => {
    const comments = await Comments.find();
    if (!comments) {
        res.json({'status': false, 'msg': 'No data found'})
    }
    res.json({'status': true, 'msg': comments});
})

app.post('/comments/new', (req, res) => {
    try {
        const email = req.body.email,
            comment = req.body.comment;
        if (email === '' || comment === '') {
            throw 'Email and comment is required';
        }
        const hash = crypto.createHash('md5').update(email).digest('hex');
        const newComment = new Comments({
            email: email,
            comment: comment,
            imgUrl: `https://www.gravatar.com/avatar/${hash}`
        })
        newComment.save();
        res.json(newComment);
    } catch (err) {
        res.json(err);
    }
});

app.listen(port, () => {
    console.log(`server is running on port: ${port}`)
})
