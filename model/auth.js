// model = tempat dimana kita meletakkan data yang berhubungan dengan database
const db = require('../helper/db_connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {useError} = require('../helper/message')


module.exports = {
  login: (req, res) => {
    const { email, password } = req.body;
    return new Promise((resolve, reject) => {
      console.log(req.body)
      db.query(
        `SELECT id, role, email, password, display_name FROM profile WHERE email='${email.toLowerCase()}'`,
        
        (err, results) => {
          if (err) {
            console.log(err)
            reject({ message: "error" });
          }else {
            if(!results.length) {
              reject({message: "Wrong email or password."})
            }else {
              bcrypt.compare(password, results[0].password, (errHashing, successHashing) => {
                if(errHashing) {reject({message: "There is problem while logging, please try again."})} //bycript error, tampilin ke user seolah2
                if(successHashing) {
                  const token = jwt.sign({ user_id: results[0].id, role: results[0].role}, process.env.JWT_SECRET_KEY, 
                    // {expireIn: '1 month'}
                    );
                  console.log(process.env.JWT_SECRET_KEY)

                  // var decoded = jwt.decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJpYXQiOjE2NTcxMDMyNjJ9.5Si2fUSuaAiIrcvHUPhgN_ViiWIpWU1I77XbWhnUmps", process.env.JWT_SECRET_KEY);
                  // console.log(decoded) // bar
                  
                  // // verify a token symmetric
                  // jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJpYXQiOjE2NTcxMDMyNjJ9.KEu4w29fOtuNcvhKf74pDLtBhb7612676", process.env.JWT_SECRET_KEY, function(err, decoded) {
                  //   console.log(decoded) // bar
                  // });
                  resolve({
                    message: "login successful",
                    status: 200,
                    data: {
                      user_id: results[0].id,
                      display_name: results[0].display_name,
                      token,
                    },
                  });
                }else {reject({message: "Wrong Email or Password."})}
              });
            }
          }
        }
      );
    });
  },
  register: (req, res) => {
    const {email, password, phone_number } = req.body;
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, function (err, hashedPassword) {
        if (err) {
          console.log(err)
          reject({ message: "error" });
        } else {
          db.query(
            `INSERT INTO profile(email, password, phone_number) VALUES('${email}', '${hashedPassword}', '${phone_number}')`,
            (err, results) => {
              if (err) {
                console.log(err)
                reject(useError(err.code));
              }
              resolve({
                message: "register successfully",
                status: 201,
                data: results,
              });
            }
          );
        }
      });
    });
  },
};