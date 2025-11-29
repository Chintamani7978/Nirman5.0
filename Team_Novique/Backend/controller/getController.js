const Subject = require("../database/model")

const allSubjects = async(req,res) =>{
    try {
        const response = await Subject.find().sort({created_at:-1});
        const response2 = response.map((sub)=>({subject:sub.subject_name,id:sub.id}))
        res.status(200).json(response2)
    } catch (error) {
        console.error("Error :",error)
        res.status(500).json({message:'Internal Server Error'})
    }
}

const allSubjectProgress = async(req,res) =>{
    try {
        const response = await Subject.find()
        const res2 = response.map((sub)=>({id:sub.id,subject:sub.subject_name,progress:sub.progress_summary.completed_topics*100/sub.progress_summary.total_topics}))
        res.status(200).json(res2)
    } catch (error) {
        console.error("Error :",error)
        res.status(500).json({message:'Internal Server Error'})
    }
}



const allTopics = async(req,res) => {
    try {
        const {subjectId} = req.params
        const response = await Subject.findById(subjectId)
        res.status(200).json(response.topics)
    } catch (error) {
        console.error("Error :",error)
        res.status(500).json({message:'Internal Server Error'})
    }
}

const getTopic = async(req,res) =>{
    try {
        const {subjectId,topicId} = req.params
        const subject = await Subject.findById(subjectId)
        const topic = await subject.topics.id(topicId)
        res.status(200).json(topic)
    } catch (error) {
        console.error("Error :",error)
        res.status(500).json({message:'Internal Server Error'})
    }
}


const allSubjectanalytic = async(req,res) => {
    try {
        const response = await Subject.find()
        const response2 = response.map(sub => ({subject_name: sub.subject_name, average_depth_score: sub.progress_summary.average_depth_score}))
        res.status(200).json(response2)
    } catch (error) {
        console.error("Error :",error)
        res.status(500).json({message:'Error Getting all Subject Analytics'})
    }
}

const getTopicanalytics = async(req,res) =>{
    try {
        const {subjectId} = req.params;
        const response = await Subject.findById(subjectId)
        const response2 = response.topics.map(topic => topic.performance.topic_depth_score)
        res.status(200).json(response2)
    } catch (error) {
        console.error("Error :",error)
        res.status(500).json({message:'Error Getting all TopicAnalytics'})
    }
}

const getprogress = async(req,res) => {
    try {
    const { subjectId } = req.params;
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // --------------------------
    // 1) TOTAL TOPICS
    // --------------------------
    const total_topics = subject.topics.length;

    // --------------------------
    // 2) COMPLETED TOPICS
    // --------------------------
    // const completed_topics = subject.topics.map((topic)=>topic.performance.completed == true).length
    const completed_topics = subject.topics.filter(
  (topic) => topic.performance.completed === 1
).length;
    // --------------------------
    // 3) AVERAGE DEPTH SCORE
    // --------------------------
    let average_depth_score = 0;

    if (total_topics > 0) {
      const sum = subject.topics.reduce((acc, topic) => {
        return acc + (topic.performance?.topic_depth_score || 0);
      }, 0);

      average_depth_score = sum / total_topics;
    }

    // --------------------------
    // 4) GROWTH TREND
    // --------------------------
    const trend = subject.progress_summary.growth_trend;
    // Get last entry
    const lastEntry = trend[trend.length - 1];
    
    // Check if last entry exists **and** it's from today
    const isSameDay =
      lastEntry &&
      new Date(lastEntry.date).toDateString() === new Date().toDateString();
    
    if (isSameDay) {
      // Update today's score
      lastEntry.avg_score = average_depth_score;
    } else {
      // New day → increment day count
      const newDayNumber = trend.length + 1;
    
      trend.push({
        day: newDayNumber,
        avg_score: average_depth_score,
        date: new Date()
      });
    }
    // Update summary fields
    subject.progress_summary.total_topics = total_topics;
    subject.progress_summary.completed_topics = completed_topics;
    subject.progress_summary.average_depth_score = average_depth_score;
    subject.progress_summary.last_updated = Date.now();

    await subject.save();

    return res.json({
      message: "Progress summary updated",
      progress_summary: subject.progress_summary.growth_trend
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}



module.exports = {
    allSubjects,
    allSubjectProgress,
    getTopic,
    allTopics,
    allSubjectanalytic,
    getTopicanalytics,
    getprogress,
}