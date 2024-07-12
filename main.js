const http = require("http");
const fs = require("fs");
const OpenAI = require("openai");

const openai = new OpenAI();

async function doit(messages) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
  });
  const response = completion.choices[0].message;
  console.log(messages);
  console.log(response);
  fs.appendFileSync("log.txt", `${messages}\n${response}\n\n`);
  return response;
}

const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    const messages = JSON.parse(body);
    const response = await doit(messages);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ response }));
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
