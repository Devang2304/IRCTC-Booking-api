const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compresssion = require("compression");
const mainRoutes = require("./routes/main");
const { sequelize } = require("./models/main");
const logger = require("./utils/dataLogger");

dotenv.config();  

const app = express();
const PORT = process.env.PORT || 5000;

const rateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  });

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(rateLimiter);
app.use(helmet());

sequelize
  .sync()
  .then(() => {
    logger.info("Database synced successfully");
  })
  .catch((error) => {
    logger.error("Error syncing database:", error);
  });
  


app.use("/api", mainRoutes);

app.listen(PORT, () => {
  logger.info(`Server is running on port http://localhost:${PORT}`);
});


