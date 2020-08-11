import express from 'express';
import {resolve, join} from 'path';

const PATH_TO_STATIC_DIR = join(__dirname, "..", "client");
const app = express();

app.use(express.static(PATH_TO_STATIC_DIR));

app.get('/', (req, res) => {
    res.sendFile(join(PATH_TO_STATIC_DIR, 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});