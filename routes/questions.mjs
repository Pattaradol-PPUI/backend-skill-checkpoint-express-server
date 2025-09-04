import express from "express";
import { Query } from "pg";

const questionRouter = express.Router();

router.post("/",  async (req, res) => {
    try {
      const {title, description, category} = req.body;
      if (!title || !description || !category) {
        return res.status(400).json({message: "Invalid request data."})
      }
      await connectionPool.Query(
        `INSERT INTO questions (title, description, category)
        VALUES ($1, $2, $3)`,
        [title, description, category]
      );
      return res.status(201).json({message: "Question created successfully."})
    } catch (err) {
      return res.status(500).json({message: "Unable to create question."})
    }
  });
  
  router.get("/", async (req, res) => {
    try {
      const result = await Query(`SELECT * FROM questions`);
      return res.status(200).json({data: result.rows})
    } catch (err) {
      return res.status(500).json({message: "Unable to fetch questions."})
    }
  });
  
  router.get("/:questionId", async (req, res) => {
    try {
      const {questionId} = req.params;
      
      const result = await Query(`SELECT * FROM questions WHERE id = $1`,
        [questionId,]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({message: "Question not found."});
      }
      return res.status(200).json({data: result.rows[0]});
    } catch (err) {
      return res.status(500).json({message: "Unable to fetch questions."})
    }
  });
  
  router.put("/:questionId", async (req, res) => {
    try {
      const {questionId} = req.params;
      const {title, description, category} = req.body;
  
      if (!title || !description || !category) {
        return res.status(400).json({message: "Invalid request data"});
      }
  
      const result = await Query(
        `UPDATE qusetions SET title=$1, description=$2, category=$3 WHERE id=$4 RETURNING *`,
        [title, description, category, questionId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({message: "Question not found"});
      }
  
      return res.status(200).json({message: "Question updated successfully."});
    } catch (err) {
      return res.status(500).json({message: "Unable to fetch questions"});
    }
  });
  
  router.delete("/:questionId" , async (req, res) => {
    try {
      const {questionId} = req.params;
  
      await Query(
        `DELETE FROM answers WHERE question_id = $1`,
        [questionId]
      );
  
      const result = await Query(
        `DELETE FROM questions WHERE id=$1 RETURNING *`,
        [questionId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({message: "Question not found"});
      }
  
      return res.status(200).json({message: "Question post has been deleted successfully"});
    } catch (err) {
      return res.status(500).json({message: "Unable to delete question."})
    }
  });
  
  router.get("/search", async (req, res) => {
    try {
      const {title, category} = req.query;
  
      if (!title && !category) {
        return res.status(400).json({message: "Invalid search parameters"});
      }
  
      let sql = `SELECT * FROM questions WHERE 1=1`;
      const params = [];
      if (title) {
        params.push(`%${title}%`);
        sql += ` AND title ILIKE $${params.length}`;
      }
      if (category) {
        params.push(category);
        sql += ` AND category = $${params.length}`;
      }
      const result = await Query(sql, params);
      return res.status(200).json({data: result.rows});
      } catch (err) {
        return res.status(500).json({message: "Unable to fetch a question."});
      }
  });

  export default questionRouter;