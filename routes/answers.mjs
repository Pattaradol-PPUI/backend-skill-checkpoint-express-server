import express from "express";
import { Query } from "pg";

const answerRouter = express.Router();

router.post("/:questionId/answers", async (req, res) => {
    try {
      const {questionId} = req.params;
      const {content} = req.body;
    
      if (!content || !content.length > 300) {
        return res.status(400).json({message: "Invalid request data"});
      }
      
      await Query(
        `INSERT INTO answers (question_id, content
        VALUES ($1, $2)`,
        [questionId,content]
      );
      return res.status(201).json({message: "Answer created successfully."})
    } catch (err) {
      return res.status(500).json({message: "Unable to create answers."})
    }
    });
    
    router.get("/:questionId/answers", async (req, res) => {
      try {
        const {questionId} = req.params;
    
        const result = await Query (
          `SELECT * FROM answers WHERE question_id=$1`,
          [questionId]
        );
        return res.status(200).json({data: result.row});
    } catch (err) {
      return res.status(500).json({message: "Unable to fetch answers."})
    }
    });
    
    router.delete("/:questionId/answers", async (req, res) => {
      try {
        const { questionId } = req.params;
    
        const q = await query(`SELECT * FROM questions WHERE id=$1`, [questionId]);
        if (q.rows.length === 0) {
          return res.status(404).json({ message: "Question not found." });
        }
    
        await Query(`DELETE FROM answers WHERE question_id=$1`, [questionId]);
    
        return res.status(200).json({
          message: "All answers for the question have been deleted successfully.",
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Unable to delete answers." });
      }
    });

export default answerRouter;