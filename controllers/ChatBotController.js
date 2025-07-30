// ChatBotController.js
export const handleChatMessage = (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Message is required." });
  
    const msg = message.toLowerCase();
    let reply = "Sorry, I didn't understand that.";
  
    if (msg.includes("hello") || msg.includes("hi")) {
      reply = "Hello! How can I assist you today?";
    } else if (msg.includes("services")) {
      reply = "We offer web development, mobile apps, and digital marketing.";
    } else if (msg.includes("price") || msg.includes("cost")) {
      reply = "Prices depend on project details. Contact us for a custom quote.";
    } else if (msg.includes("contact")) {
      reply = "You can reach us via the contact form or email on our Contact page.";
    }
  
    res.json({ reply });
  };
  