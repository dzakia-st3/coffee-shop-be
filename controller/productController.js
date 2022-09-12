const product = require('../model/product')
const fs = require('fs')



module.exports = {
    getAllProduct: async (req, res) => {
        try {
            const result = await product.get(req,res)
            return res.status(200).send(result)
        } catch (error) {
            return res.status(500).send(error)
        }
    }, getProductbyId: async (req, res) => {
        try {
            const result = await product.getById(req,res)
            return res.status(200).send(result)
        } catch (error) {
            return res.status(500).send(error)
        }
    },
    addNewProduct: async (req, res) => {
        console.log(req.file, 'filename dari upload')
        try {
            console.log({...req.body, product_image: 'cekcek'})
            const reqModifer = {
                ...req,
                body: { ...req.body, product_image: req.file.filename }
            }
            const results = await product.add(reqModifer, res)
            return res.status(201).send(results)
        } catch (error) {
            return res.status(400).send(error)
        }
    }, updateProduct: async (req, res) => {
        try { 
            const result = await product.update(req, res)
            return res.status(201).send(result)
        } catch (error) {
            return res.status(400).send(error)
        }
    }, deleteProduct: async (req, res) => {
        try {
            const result = await product.remove(req,res)
            return res.status(201).send(result)
        } catch (error) {
            return res.status(400).send(error)
        }
    },
}