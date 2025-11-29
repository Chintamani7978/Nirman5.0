const express = require("express")
const multer = require("multer");
const { Syllabusextracted } = require("../controller/controller");
const { getTopic, allSubjects, allTopics, allSubjectanalytic, getTopicanalytics, getprogress, allSubjectProgress } = require("../controller/getController");
const { topicCompleted } = require("../controller/postController");
const storage = multer.memoryStorage();
const upload = multer({storage})

const router = express.Router()
//Upload API
router.post("/extractSyllabus",upload.single("file"),Syllabusextracted)

//Get APIS
router.get("/allsubjects",allSubjects)
router.get("/allSubjectProgress",allSubjectProgress)
router.get("/alltopics/:subjectId",allTopics)
router.get("/topic/:subjectId/:topicId",getTopic)
router.get("/allSubjectAnalytics",allSubjectanalytic)
router.get("/topicAnalytics/:subjectId",getTopicanalytics)
router.get("/progress/:subjectId",getprogress)

//Post APIS
router.post("/topicCompleted/:subjectId/:topicId",topicCompleted)

module.exports = router