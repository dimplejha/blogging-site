const jwt = require("jsonwebtoken");

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-Api-Key"];
        if (!token) token = req.headers["x-api-key"];

        if (!token) return res.status(404).send({ status: false, msg: "token must be present." });
        let decodedToken = jwt.verify(token, "functionup-thorium");
        //   console.log(decodedToken);
        if (!decodedToken)
            return res.status(404).send({ status: false, msg: "token is invalid." });
        next();
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}


const authorisation = function (req, res, next) {
    let token = req.headers["x-Api-Key"];
    if (!token) token = req.headers["x-api-key"];

    if (!token) return res.send({ status: false, msg: "token must be present." });
    let decodedToken = jwt.verify(token, "functionup-thorium");
    //console.log(decodedToken);

    console.log(decodedToken.authorId)
        console.log(req.query.authorId)

    if ( decodedToken.authorId != req.params.authorId) {
       
        return res.status(404).send({ status: false, msg: "you are not authorised" });
    }
    next();
}

module.exports.authentication = authentication;
module.exports.authorisation = authorisation;