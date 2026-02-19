import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { tools } from './tools';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const context = `
SEMS (Student Examination Management System) manages student academic records and results.

College Information:
- Class timings: 8:30 AM to 4:00 PM.
- Students are not allowed on campus before or after class hours.
- Minimum attendance required: 75%.

Academic Terms:
- SGPA: Semester Grade Point Average.
- CGPA: Cumulative Grade Point Average.
- Credits: Each subject has assigned credit points.
- Result Status: Pass / Fail / Arrear.

Grading System:
- O  : 90 - 100 (Outstanding)
- A+ : 80 - 89  (Excellent)
- A  : 70 - 79  (Very Good)
- B+ : 60 - 69  (Good)
- B  : 50 - 59  (Average)
- C  : 40 - 49  (Pass)
- F  : Below 40 (Fail)

Result Rules:
- Passing mark: Minimum 40% in each subject.
- SGPA is calculated per semester.
- CGPA is calculated from all completed semesters.
- Students with failed subjects must appear for arrear exams.
- Revaluation can be applied within 7 days after results are published.
- Improvement exams are allowed as per university rules.

Sample Subjects:
- Data Structures
- Operating Systems
- Database Management Systems
- Computer Networks
- Artificial Intelligence

Sample Student Data:
- Name: Arun Kumar
- Department: Computer Science and Engineering
- Semester: 4
- SGPA: 8.2
- CGPA: 7.9
- Attendance: 82%
- Result Status: Pass

Common Student Queries:
- How is SGPA/CGPA calculated?
- What is my grade?
- Am I eligible for exams?
- How to apply for revaluation?
- What happens if I fail a subject?
`;
const systemPrompt = `
You are SEMS Assistant AI, a college result management chatbot.

Your job:
- Help students with result-related queries.
- Explain grades, SGPA, CGPA, pass/fail status, attendance rules, and revaluation clearly.
- Use the provided context to answer accurately.

Rules:
- Use simple and student-friendly language.
- Give short, clear, and structured answers.
- Never guess unknown data.
- Never reveal another student's information.
- Be polite and professional.

${context}
`;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system:'speak in tamil u tamil friend',
    messages: await convertToModelMessages(messages),

    //TODO TASK 2 - Tool Calling
    // tools,            // Uncomment to enable tool calling
    // maxSteps: 5,      // Allow multi-step tool use (model calls tool → gets result → responds)
  });

  return result.toUIMessageStreamResponse();
}
