
// export const handleChatMessage = (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ reply: "Message is required." });
//   }

//   const msg = message.toLowerCase().trim();
//   let reply = `❓ Sorry, I didn’t quite catch that. If it’s urgent, feel free to <a href="https://wa.me/96171234567" target="_blank">WhatsApp us</a>.`;

//   const contactLink = `<a href="https://leaptechkw.com/ContactUs" target="_blank">Contact Us</a>`;
//   const whatsappLink = `<a href="https://wa.me/96525713432" target="_blank">WhatsApp us</a>`;

//   const servicesList = [
//     "• 🏠 Smart Home",
//     "• ☁️ Cloud Storage",
//     "• 🌐 Web Development",
//     "• 📱 Mobile App Development",
//     "• 📣 Digital Marketing",
//     "• 🛍️ E-Business Solutions"
//   ].join("<br/>");

//   // Main chatbot logic
//   if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
//     reply = "👋 Hello! How can I assist you today? You can ask about our services, pricing, or how to get in touch.";
//   } 
//   else if (msg.includes("Services")||msg.includes("Service") ||msg.includes("service") || msg.includes("services") || msg.includes("offer") ||  msg.includes("Offer") ||  msg.includes("what can you do") )  {
//     reply = `Here are the services we offer:<br/>${servicesList}<br/><br/>Want more details about any of them?`;
//   } 
//   else if (msg.includes("price") || msg.includes("cost") || msg.includes("quote") || msg.includes("How much") || msg.includes("Cost") || msg.includes("Price")) {
//     reply = `💰 Prices depend on project scope. Please reach us via our ${contactLink} for a quote.`;
//   } 
//   else if (msg.includes("contact") ||msg.includes("Contact")|| msg.includes("reach you") || msg.includes("email") || msg.includes("phone")) {
//     reply = `📞 You can reach us here: ${contactLink}<br/>Or message us directly on ${whatsappLink}.`;
//   } 
//   else if (
//     (msg.includes("services") && msg.includes("prices")) ||
//     (msg.includes("service") && msg.includes("price")) ||
//     (msg.includes("cost") && msg.includes("contact")) ||
//     msg.split(" ").length > 20 // long/complex message
//   ) {
//     reply = `🤖 That sounds like a detailed request! For faster help, ${whatsappLink} or use our ${contactLink}.`;
//   }

//   res.json({ reply });
// };
export const handleChatMessage = (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message is required." });
  }

  const msg = message.toLowerCase().trim();

  const contactLink = `<a href="https://leaptechkw.com/ContactUs" target="_blank">Contact Us</a>`;
  const whatsappLink = `<a href="https://wa.me/96525713432" target="_blank">WhatsApp us</a>`;
  const consultLink = `<a href="/#consult-us"target="_blank">Consult Us</a>`;
  const quoteLink = `<a href="https://leaptechkw.com/services" target="_blank">Request a Quotation</a>`;
  const careerLink = `<a href="https://leaptechkw.com/career" target="_blank">Career Opportunities</a>`;

  const servicesList = [
    "• 🏠 Smart Home",
    "• ☁️ Cloud Storage",
    "• 🌐 Web Development",
    "• 📱 Mobile App Development",
    "• 📣 Digital Marketing",
    "• 🛍️ E-Business Solutions"
  ].join("<br/>");

  let reply = `👋 Welcome to Leap Tech! We're excited to help you.<br/><br/>
Here are some of the services we offer:<br/>${servicesList}<br/><br/>
You can ask about:<br/>
• 💼 More details about a service<br/>
• 🧠 Project consultation (no pricing)<br/>
• 💰 Quotation with budget & deadline<br/>
• 📞 How to contact us<br/>
• 👨‍💻 Job or career opportunities<br/>
• 🛠️ Help with a problem or support<br/><br/>
Ask me anything below 👇`;

  // Greeting keywords
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg.includes("start") || msg.includes("begin")) {
    // keep reply as is (it's already the welcome message)
  }

  // Services
  else if (
    msg.includes("services") || 
    msg.includes("service") || 
    msg.includes("offer") || 
    msg.includes("what can you do") || 
    msg.includes("solutions")
  ) {
    reply = `💼 Here are the services we offer:<br/>${servicesList}<br/><br/>Want more details about any of them?`;
  }

  // Consult Us
  else if (
    msg.includes("consult") || 
    msg.includes("consultation") || 
    msg.includes("discuss project") || 
    msg.includes("idea") || 
    msg.includes("need help with a project")
  ) {
    reply = `🧠 You can ${consultLink} to consult with our team about your project — no budget or time estimate needed.`;
  }

  // Request Quotation / Budget / Estimate
  else if (
    msg.includes("quotation") || 
    msg.includes("quote") || 
    msg.includes("budget") || 
    msg.includes("estimate") || 
    msg.includes("how much") || 
    msg.includes("pricing") || 
    msg.includes("price") || 
    msg.includes("cost")
  ) {
    reply = `💰 To get a budget, timeline, and full estimate for your project, please ${quoteLink}.`;
  }

  // Contact
  else if (
    msg.includes("contact") ||
    msg.includes("email") ||
    msg.includes("phone") ||
    msg.includes("reach you") ||
    msg.includes("call") ||
    msg.includes("talk to you")
  ) {
    reply = `📞 You can reach us here: ${contactLink}<br/>Or message us directly on ${whatsappLink}.`;
  }

  // Job/Career
  else if (
    msg.includes("job") || 
    msg.includes("career") || 
    msg.includes("vacancy") || 
    msg.includes("work with you") || 
    msg.includes("hiring")
  ) {
    reply = `👨‍💻 We're always open to talented individuals! Check out our ${careerLink} page for openings.`;
  }

  // Technical support
  else if (
    msg.includes("support") || 
    msg.includes("problem") || 
    msg.includes("issue") || 
    msg.includes("bug") || 
    msg.includes("help me")
  ) {
    reply = `🛠️ We're here to help! Please reach out via ${whatsappLink} and describe your issue, for faster support.`;
  }

  // Complex or mixed input
  else if (
    (msg.includes("services") && msg.includes("prices")) ||
    (msg.includes("service") && msg.includes("quote")) ||
    (msg.includes("cost") && msg.includes("contact")) ||
    msg.split(" ").length > 20
  ) {
    reply = `🤖 That sounds like a detailed request! For faster help, feel free to ${whatsappLink} or use our ${contactLink}.`;
  }

  // No match / fallback
  else {
    reply = `❓ I didn’t quite catch that. You can ask about:<br/>
• Our services<br/>
• Consultation or quotation<br/>
• Project cost and timeline<br/>
• Job openings<br/>
• Support issues<br/><br/>
Or simply ${whatsappLink} for instant help.`;
  }

  res.json({ reply });
};
