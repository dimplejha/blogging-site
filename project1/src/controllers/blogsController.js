const blogsModel = require("../models/blogsModel")
const authorModel = require("../models/authorModel")
const moment = require('moment')


const createBlog = async function (req, res) {
  try {
      let blog = req.body;
      let authorId = blog.authorId;
      if(!blog) {
          res.status(404).send({status: false, msg: 'blog data required'})
      }
      else {
          let author = await authorModel.findById({_id: authorId})
          if(!authorId) {
          res.status(404).send({status: false, msq: `please provide valid Id ${author}`}) 
          }
          else {
          let blogCreated = await blogsModel.create(blog)
          res.status(201).send( { status: true, msg : blogCreated})
          }
      }
  }
      catch(err) {
          res.status(500).send({error: err.message})
      }
}


const getBlogs = async function (req, res) {
  try {
    const data = req.query
    const blog = await blogsModel.find(data, { isDeleted: false}, {isPublished: true}).populate("authorId")

    if (blog.length == 0)
    return res.status(404).send ({ status: false , msg: "No blogs available"})
    else
    return  res.status(200).send ({ status: true, data: blog})
  } 
  catch (error) {
    res.status(500).send({ status: false, error: error });
  }
}




const updateBlogs = async function (req, res) {
  try {
    const data = await blogsModel.findById(req.params.blogId)

    if (!data) {
      return res.status(404).send({ msg: "data not found" });
    }
    let data1 = await blogsModel.findOneAndUpdate({ _id: req.params.blogId }, { title: req.body.title, body: req.body.body, tags: req.body.tags, subCategory: req.body.subCategory, PublishedAt: Date(), isPublished: true }, { new: true }).populate("authorId")
    res.status(200).send({ msg: "successfully updated", data: data1 });
  }
  catch (error) {
    res.status(500).send({ status: false, msg: "error-response-status" });
  }
}

const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId
    if (!blogId) {
      res.status(400).send({ status: false, msg: "blogId is required, BAD REQUEST" })
    }
    let blogsDetails = await blogsModel.find({ _id: blogId }, { isDeleted: false })
    if (!blogsDetails) {
      res.status(404).send({ status: false, msg: "blog not exist" })
    } else {
      let Date = moment().format("YYYY-MM-DD[T]HH:mm:ss")
      let blogDetails = await blogsModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: Date } })
      res.status(200).send()
      console.log(blogDetails)
    }
  }
  catch (error) {
    console.log(error)
    res.send({ msg: error.message })
  }
}




const deleteBlogByQuerCondition = async function (req, res) {
    try {
        let authorId = req.query.authorId
        let category = req.query.category
        if (!authorId) {
            res.status(400).send({ status: false, msg: "authorId is required, BAD REQUEST" })
        }
        if (!category) {
            res.status(400).send({ status: false, msg: "category is required, BAD REQUEST" })
        }
        let authorsDetails = await authorModel.find({ _id: authorId })
        if (!authorsDetails) {
            res.status(404).send({ status: false, msg: "authorId not exist" })
        } else {
            let Date = moment().format("YYYY-MM-DD[T]HH:mm:ss")
            let updatedDetails = await blogsModel.updateMany({ authorId: authorId, category: category }, { $set: { isDeleted: true,deletedAt:Date } })
            res.status(200).send({status:true, messaage: updatedDetails})
            //console.log(updatedDetails)
        }
  
    }
    catch (error) {
        console.log(error)
        res.send({ msg: error.message })
    }
  }
  




module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlogs = updateBlogs;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogByQuerCondition = deleteBlogByQuerCondition

