import express from 'express';
import routes from './routes';
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Global middlewares
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/", routes)

app.use(errorHandler);

export default app;