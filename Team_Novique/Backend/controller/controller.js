const FormData = require("form-data")
const axios = require("axios")
const {GoogleGenerativeAI} = require("@google/generative-ai")
const dotenv = require("dotenv")
const { chunkArray, extractJSON } = require("../Const")
const Subject = require("../database/model")

dotenv.config()
const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY)
const api = "http://127.0.0.1:8000"
const Syllabusextracted = async(req,res) =>{
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const formData = new FormData();
        formData.append("file",req.file.buffer,req.file.originalname)
        const response = await axios.post(`${api}/extractedSyallabus`,formData,{headers:formData.getHeaders()}) 
        const finalResults = [];
        let syllabusText = response.data.predictedText
        let notesText = ""
        const result = await model.generateContent(`
        Extract a clean list of topics from this syllabus:

        "${syllabusText}"

        Return JSON array only.
        `)
        let raw = result.response.text();
        
        raw = raw.replace(/```json|```/g, "").trim();
        
        let topics = JSON.parse(raw);
        const batches  = chunkArray(topics,7)
        console.log(batches)
        for(let i = 0 ;i<batches.length;i++){
            const batch = batches[i];
            console.log(`⏳ Processing batch ${i + 1}/${batches.length}...`);
            const tasks = batch.map(topic =>
                model.generateContent(`
                You are an expert academic tutor creating exam-ready learning material.
                Generate content ONLY for the given topic.
                
                Topic: "${topic}"
                
                Notes Context:
                "${notesText}"
                
                RULES:
                1. Use the notes as the main reference wherever possible.
                2. If the notes do NOT contain information for this topic, fill the gaps using accurate general knowledge.
                3. Keep explanations simple, clear, and suitable for fast revision.
                4. OUTPUT MUST BE STRICT VALID JSON ONLY. No commentary, no backticks, no markdown.
                
                FORMAT:
                {
                  "topic_name": "",
                  "summary": {
                    "text": "",
                    "key_formulas": []
                  },
                  "flashcards": [
                    { "question": "", "answer": "" }
                  ],
                  "mcqs": [
                    {
                      "question": "",
                      "options": ["", "", "", ""],
                      "correct_answer": ""
                    }
                  ],
                  "analytical_questions": [""],
                  "real_world_examples": [""],
                  "quiz": [
                    {
                      "question": "",
                      "options": ["", "", "", ""],
                      "correct_answer": ""
                    }
                  ],
                  "performance": {
                    "total_questions": 0,
                    "correct_answers": 0,
                    "topic_depth_score": 0,
                    "completed": false
                  }
                }
                
                CONTENT REQUIREMENTS:
                - summary.text → 5 to 10 lines, simple explanation.
                - summary.key_formulas → Only formulas relevant to the topic.
                - flashcards → 6 to 10 short question-answer pairs.
                - mcqs → At least 5 conceptual MCQs.
                - analytical_questions → 3 to 5 deeper thinking questions.
                - real_world_examples → At least 3 practical examples.
                - quiz → 5 MCQs different from above.
                - performance → Must always be included with default values exactly as above.
                
                STRICT JSON ONLY.
                Return ONLY the JSON object.
                                      `)
            );
            const result2 = await Promise.all(tasks);
            const parsedResults = result2.map(r =>
                JSON.parse(extractJSON(r.response.text()))
            );
            finalResults.push(...parsedResults);
            if(i<batches.length-1){
                console.log("⏳ Waiting 60 seconds to avoid rate limit...")
                await new Promise(res => setTimeout(res,60000))
            }
        }
        console.log("all Batch Processed")
        const newSubject = new Subject({
            subject_name:req.body.subject_name,
            exam_date:req.body.exam_date,
            study_hours_per_day:req.body.study_hours_per_day,
            total_days:req.body.total_days,
            topics:finalResults,
            progress_summary:{
                total_topics:finalResults.length,
                completed_topics:0,
                average_depth_score:0,
                growth_trend:[]
            }
        })
        console.log("Saving to DB...");
        await newSubject.save()
        console.log("Saved to DB");
        res.status(201).json({
            message:"Success The File Uploaded and Data Saved"
        })
    } catch (error) {
        res.status(500).json({
            message:"File Upload Failed",
            error:error.message
        })
    }
}

module.exports = {
    Syllabusextracted
}