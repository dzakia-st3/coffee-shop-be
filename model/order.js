const db = require('../helper/db_connection')
const fs = require('fs')

module.exports = {
    get: (req, res) => {
        return new Promise((resolve, reject) => {
            const { order_id } = req.query

            const sql = `SELECT profile.id, profile.address, profile.phone_number, product.product_id, order_id, size, order_number, delivery_method, created_at, update_at FROM order JOIN profile ON profile.id = user_id GROUP`

            db.query(sql, (err, result) => {
                if (err) {
                    console.log(err)
                    reject({ message: "error" })
                }
                if (!result.length) {
                    reject({
                        message: "Data not found",
                        data: result
                    })
                } resolve({
                    message: "get all order success",
                    status: 200,
                    data: result,
                })
            })
        })
    }, getById: (req, res) => {
        return new Promise((resolve, reject) => {
            const { user_id } = req.params

            const sql = `SELECT * FROM order WHERE user_id = ${user_id}`

            db.query(sql, (err, result) => {
                if (err) {
                    console.log(err)
                    reject({ message: "error" })
                }

                resolve({
                    message: "get all order by user id success",
                    status: 200,
                    data: result,
                })
            })
        })
    },
    add: (req, res) => {
        return new Promise((resolve, reject) => {
            const { user_id, order_id, id_product, size, order_number, delivery_method } = req.body

            db.query(`INSERT INTO order(user_id, order_id, id_product, size, order_number, delivery_method) VALUES ('${user_id}', '${order_id}', '${id_product}', '${size}', '${order_number}', '${delivery_method}')`, (err, results) => {
                if (err) {
                    console.log(err)
                    reject({ message: "error" })
                }
                resolve({
                    message: "add new order success",
                    status: 200,
                    data: {
                        ...req.body,
                    }
                })
            })
        })
    }, update: (req, res) => {
        return new Promise((resolve, reject) => {
            const { order_id } = req.params
            const sql = `SELECT * FROM order WHERE order_id = ${order_id}`

            db.query(sql, (err, result) => {
                if (err) {
                    reject({ message: "error" })
                }
                if (result.length == 0) {
                    reject({ message: "id not found" })
                }
                const previousData = {
                    ...result[0],
                    ...req.body
                }
                        const { user_id, id_product, size, order_number, delivery_method } = previousData

                        db.query(`UPDATE order SET user_id = '${user_id}', id_product = '${id_product}', size = '${size}', order_number = '${order_number}', delivery_method = '${delivery_method}' WHERE order_id = ${order_id}`, (err, result) => {
                            if (err) {
                                console.log(err)
                                reject({ message: "error" })
                            }
                            resolve({
                                message: "update order successfully",
                                status: 200,
                                data: result
                            })
                        })
            })
        })
    }, remove: (req, res) => {
        return new Promise((resolve, reject) => {
            const {order_id} = req.params  
            const sql = `DELETE FROM order WHERE order_id = ${order_id}`
    
            db.query(sql, (err, result) => {
                if(err) {
                    console.log(err)
                    reject({message: "error"})
                }
                resolve({
                    message: "delete order succes",
                    status: 200,
                    data: result
                })
            })   
        })
    },
}