const db = require('../helper/db_connection')
const fs = require('fs')

module.exports = {
    get : (req, res) => {
        return new Promise((resolve, reject) => {
            const {category_id} = req.query

            const sql = `SELECT * FROM product ${category_id ? `WHERE category_id LIKE '%${category_id}%'`:''}` 
    
            db.query(sql, (err, result) => {
                if(err) {
                    console.log(err)
                    reject({message: "error"})
                }
                if (!result.length){
                    reject({
                      message: "Data not found",
                      data: result
                    })
                } resolve({
                      message: "get all product success",
                      status: 200,
                      data: result,
                  })
                  })   
            })   
}, getById : (req, res) => {
  return new Promise((resolve, reject) => {
      const {product_id} = req.params

      const sql = `SELECT * FROM product WHERE product_id = ${product_id}` 

      db.query(sql, (err, result) => {
          if(err) {
              console.log(err)
              reject({message: "error"})
          }
         
          resolve({
                message: "get all product by product id success",
                status: 200,
                data: result,
            })
            })   
      })   
}, 
add : (req, res) => {
    return new Promise((resolve, reject)=> {
        const {category_id, product_name, price, product_details, product_image} = req.body

      db.query(`INSERT INTO product(category_id, product_name, price, product_details, product_image) VALUES('${category_id}', '${product_name}', '${price}', '${product_details}', '${product_image}')`,(err, results)=> {
        if(err) {
          console.log(err)
          reject({message: "error"})
        }
        resolve({
          message: "add new product success",
          status: 200,
          data: {
            ...req.body,
          }
        })
      })
    })
  }, update : (req, res) => {
    return new Promise((resolve, reject) => {
        const {product_id} = req.params 
        const sql = `SELECT * FROM product WHERE product_id = ${product_id}`
    
            db.query(sql, (err, result) => {
                if(err) {
                    reject({message: "error"})
                } 
                if (result?.length == 0) {
                    reject({message: "id not found"})
                }
                const previousData = {
                    ...result[0],
                    ...req.body
                }
                let image = previousData.product_image
                fs.unlink(`./uploads/${image}`, function (err) {
                  if(err) {
                    console.log(err)
                    return res.status(400).send({message: "error delete file"})
                  } else {
                    previousData.product_image = req.file.filename

                    const {category_id, product_name, price, product_details, product_image} = previousData
                    
                    db.query(`UPDATE product SET category_id = '${category_id}', product_name = '${product_name}', price = '${price}', product_details = '${product_details}', product_image = '${product_image}' WHERE product_id = ${product_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            reject({message: "error"})
                        }
                            resolve({
                            message: "update product successfully",
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
        const {product_id} = req.params
        db.query(`SELECT product_image FROM product WHERE product_id=${product_id}`, (err ,resultData) => {
          if(err) {
            console.log(err)
          }
          if(!resultData.length) {
            reject({message: "id not found"})
          }else {
            let image = resultData[0].product_image
            db.query(`DELETE FROM product WHERE product_id=${product_id}`,(err, results)=> {
              if(err) {reject({message: "error"})}
              fs.unlink(`./uploads/${image}`, function (err) {
                if (err) resolve({
                  message: "delete product successfully",
                  status: 200,
                  data: results
                });
                resolve({
                  message: "delete product successfully",
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