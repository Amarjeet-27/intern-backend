import jwt from "jsonwebtoken";
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header["authorization"].split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Auth failed",
        });
      } else {
        req.body.userId = decode.userId;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Auth Failed",
    });
  }
};

export default authMiddleware;
