const db = require('../helper/db_connection')
const fs = require('fs')
const bcrypt = require('bcrypt');
const {useError} = require('../helper/message')

module.exports = {
    get : (req, res) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM `profile`'
    
            db.query(sql, (err, result) => {
                if(err) {
                    console.log(err)
                    reject({message: "error"})
                }
                resolve({
                    message: "get all user success",
                    status: 200,
                    data: result
                })
            })   
        })
}, add : (req, res) => {
    return new Promise((resolve, reject)=> {
        const {email, password, address, phone_number, display_name, first_name, last_name, birth, profile_image} = req.body

        bcrypt.hash(password, 10, function (err, hashedPassword) {
            if (err) {
              console.log(err)
              reject({ message: "error" });
            } else {
              db.query(
                `INSERT INTO profile(email, password, address, phone_number, display_name, first_name, last_name, birth, profile_image) VALUES('${email}', '${hashedPassword}', '${address}', '${phone_number}', '${display_name}', '${first_name}', '${last_name}', '${birth}', '${profile_image}')`,
                (err, results) => {
                  if (err) {
                    console.log(err)
                    reject(useError(err.code));
                  }
                  resolve({
                    message: "add user successfully",
                    status: 201,
                    data: results,
                  });
                }
              );
            }
          });
    })
  }, update : (req, res) => {
    return new Promise((resolve, reject) => {
        const {id} = req.params 
        const sql = `SELECT * FROM profile where id = ${id}`
    
            db.query(sql, (err, result) => {
                if(err) {
                    reject({message: "error"})
                } 
                if (result.length == 0) {
                    reject({message: "id not found"})
                }
                const previousData = {
                    ...result[0],
                    ...req.body
                }
                let image = previousData.profile_image
                fs.unlink(`./uploads/profile/${profile_image}`, function (err) {
                  if(err) {
                    console.log(err)
                    return res.status(400).send({message: "error delete file"})
                  } else {
                    previousData.profile_image = req.file.filename

                    const {email, password, address, phone_number, display_name, first_name, last_name, birth, profile_image} = previousData
                    
                    db.query(`UPDATE profile SET email = '${email}', password = '${password}', address = '${address}', phone_number = '${phone_number}', display_name = '${display_name}', first_name = '${first_name}', last_name = '${last_name}', birth = '${birth}', profile_image = '${profile_image}'  WHERE id = ${id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            reject({message: "error"})
                        }
                            resolve({
                            message: "update profil successfully",
                            status: 200,
                            data: result
                            })
                    })
                  }
                })
            }) 
    })
}, remove:(req, res)=> {
      return new Promise((resolve, reject)=> {
        const {id} = req.params
        db.query(`SELECT image FROM profile WHERE id=${id}`, (err ,resultData) => {
          if(err) {
            console.log(err)
          }
          if(!resultData.length) {
            reject({message: "id not found"})
          }else {
            let image = resultData[0].image
            db.query(`DELETE FROM profile WHERE id=${id}`,(err, results)=> {
              if(err) {reject({message: "error"})}
              fs.unlink(`./uploads/profile/${profile_image}`, function (err) {
                if (err) resolve({
                  message: "delete profile successfully",
                  status: 200,
                  data: results
                });
                resolve({
                  message: "delete profile successfully",
                  status: 200,
                  data: results
                });
              });
            })
          }
        })
      })
    }
}