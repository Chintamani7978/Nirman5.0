const Subject = require("../database/model");

const topicCompleted = async(req,res) =>{
    try {
        const {subjectId,topicId} = req.params;
        const subject = await Subject.findById(subjectId);
        const response = await subject.topics.id(topicId);
        response.performance.correct_answers = Number(req.body.correct_answers);
        response.performance.total_questions = response.mcqs.length + response.quiz.length;
        response.performance.completed = true
        response.performance.topic_depth_score = ((response.performance.correct_answers / response.performance.total_questions) * 80) + (response.performance.completed ? 20 : 0) 
        await subject.save()
        res.status(201).json({
            message: "Correct answers updated successfully",
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    topicCompleted
}