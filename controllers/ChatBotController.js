
export const handleChatMessage = (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message is required." });
  }

  const msg = message.toLowerCase().trim();
  let reply = `❓ Sorry, I didn’t quite catch that. If it’s urgent, feel free to <a href="https://wa.me/96171234567" target="_blank">WhatsApp us</a>.`;

  const contactLink = `<a href="https://leaptechkw.com/ContactUs" target="_blank">Contact Us</a>`;
  const whatsappLink = `<a href="https://wa.me/96525713432" target="_blank">WhatsApp us</a>`;

  const servicesList = [
    "• 🏠 Smart Home",
    "• ☁️ Cloud Storage",
    "• 🌐 Web Development",
    "• 📱 Mobile App Development",
    "• 📣 Digital Marketing",
    "• 🛍️ E-Business Solutions"
  ].join("<br/>");

  // Main chatbot logic
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    reply = "👋 Hello! How can I assist you today? You can ask about our services, pricing, or how to get in touch.";
  } 
  else if (msg.includes("services") || msg.includes("offer") || msg.includes("what can you do")) {
    reply = `Here are the services we offer:<br/>${servicesList}<br/><br/>Want more details about any of them?`;
  } 
  else if (msg.includes("price") || msg.includes("cost") || msg.includes("quote") || msg.includes("how much")) {
    reply = `💰 Prices depend on project scope. Please reach us via our ${contactLink} for a quote.`;
  } 
  else if (msg.includes("contact") || msg.includes("reach you") || msg.includes("email") || msg.includes("phone")) {
    reply = `📞 You can reach us here: ${contactLink}<br/>Or message us directly on ${whatsappLink}.`;
  } 
  else if (
    (msg.includes("services") && msg.includes("price")) ||
    (msg.includes("cost") && msg.includes("contact")) ||
    msg.split(" ").length > 20 // long/complex message
  ) {
    reply = `🤖 That sounds like a detailed request! For faster help, ${whatsappLink} or use our ${contactLink}.`;
  }

  res.json({ reply });
};
