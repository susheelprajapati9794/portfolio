export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: "Message required" });
    const key = process.env.AI_API_KEY;
    if (!key) return res.status(200).json({ reply: "AI chat is not configured yet. You can contact Susheel directly at Susheelprajapati9794@gmail.com." });
    const r = await fetch("https://api.openai.com/v1/responses", {
      method:"POST",
      headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${key}` },
      body:JSON.stringify({
        model: process.env.AI_MODEL || "gpt-5-mini",
        input:`You are Susheel Prajapati's portfolio assistant. Answer concisely and only using these facts:
Susheel is a 5th-semester B.Tech CSE student at ABES Engineering College. CGPA 7.9; 4th semester SGPA 7.22. Skills: Java, Python, C, C++, JavaScript, Spring Boot (learning), JDBC, NumPy, Pandas, Matplotlib, Tkinter, HTML/CSS, MySQL, OOP, DSA (learning), web development and DBMS. Projects: Social Media App (in progress), Banking System (Java/JDBC/MySQL/transactions), Hospital Management System (Java/JDBC/MySQL/CRUD), Simple Book Store (Spring Boot/REST), E-Commerce Website (HTML/CSS/JS). Current interests: backend systems, DSA and generative AI.
User question: ${message}`
      })
    });
    const data = await r.json();
    const reply = data.output_text || data.output?.map(x=>x.content?.map(c=>c.text||"").join("")).join("") || "I couldn't answer that right now.";
    return res.status(r.ok?200:500).json({ reply });
  } catch(e) { return res.status(500).json({ error:"AI service unavailable" }); }
}