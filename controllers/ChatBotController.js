// export const handleChatMessage = (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ reply: "Message is required." });
//   }

//   const msg = message.toLowerCase().trim();

//   const whatsappLink = `<a href="https://wa.me/96525713432" target="_blank">WhatsApp us</a>`;
//   const consultLink = `<a href="/#consult-us" target="_blank">Consult Us</a>`;
//   const quoteLink = `<a href="https://leaptechkw.com/services" target="_blank">Request a Quotation</a>`;
//   const careerLink = `<a href="https://leaptechkw.com/career" target="_blank">Career Opportunities</a>`;
//   const contactLink = `<a href="tel:+96525713432">Contact Us</a>`;
//   const servicesPageLink = `<a href="https://leaptechkw.com/services" target="_blank">our Services page</a>`;

//   const services = [
//     {
//       title: "smart home",
//       description: `We offer cutting-edge Smart Home solutions to automate your security, lighting, and climate control, making your home safer and more comfortable. Discover all the possibilities on ${servicesPageLink}.`
//     },
//     {
//       title: "cloud storage",
//       description: `Our Cloud Storage services provide secure, scalable, and reliable data access anytime, anywhere, empowering your business with flexibility and peace of mind. Learn more on ${servicesPageLink}.`
//     },
//     {
//       title: "web development",
//       description: `Get a professional website or e-commerce platform tailored to your brand, designed to engage customers and grow your online presence. Explore details on ${servicesPageLink}.`
//     },
//     {
//       title: "mobile app development",
//       description: `We build robust and user-friendly mobile applications for both iOS and Android platforms to help you connect with your audience on the go. Visit ${servicesPageLink} for more info.`
//     },
//     {
//       title: "digital marketing",
//       description: `Boost your business growth with our targeted digital marketing strategies, including SEO, social media, and data-driven campaigns. Check out all offerings at ${servicesPageLink}.`
//     },
//     {
//       title: "e-business solutions",
//       description: `Our E-Business Solutions help enhance your online brand visibility and engagement through tailored digital strategies. Find out more on ${servicesPageLink}.`
//     }
//   ];

//   // Format list for general services
//   const servicesList = services
//     .map(s => `• ${capitalizeWords(s.title)}`)
//     .join("<br/>");

//   function capitalizeWords(str) {
//     return str
//       .split(' ')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   }

//   // Check if user asked about a specific service to reply with description + link
//   for (const service of services) {
//     if (msg.includes(service.title)) {
//       return res.json({
//         reply: `💼 <strong>${capitalizeWords(service.title)}</strong>: ${service.description}`
//       });
//     }
//   }

//   // Default chatbot logic (same as before)
//   let reply = `👋 Welcome to Leap Tech! We're excited to help you.<br/><br/>
// Here are some of the services we offer:<br/>${servicesList}<br/><br/>
// You can ask about:<br/>
// • 💼 More details about a service<br/>
// • 🧠 Project consultation (no pricing)<br/>
// • 💰 Quotation with budget & deadline<br/>
// • 📞 How to contact us<br/>
// • 👨‍💻 Job or career opportunities<br/>
// • 🛠️ Help with a problem or support<br/><br/>
// Ask me anything below 👇`;

//   if (
//     msg.includes("hello") ||
//     msg.includes("hi") ||
//     msg.includes("hey") ||
//     msg.includes("start") ||
//     msg.includes("begin")
//   ) {
//     // keep reply as welcome message
//   } else if (
//     msg.includes("services") ||
//     msg.includes("service") ||
//     msg.includes("offer") ||
//     msg.includes("what can you do") ||
//     msg.includes("solutions")
//   ) {
//     reply = `💼 Here are the services we offer:<br/>${servicesList}<br/><br/>Want more details about any of them?`;
//   } else if (
//     msg.includes("consult") ||
//     msg.includes("consultation") ||
//     msg.includes("discuss project") ||
//     msg.includes("idea") ||
//     msg.includes("need help with a project")
//   ) {
//     reply = `🧠 You can ${consultLink} to consult with our team about your project — no budget or time estimate needed.`;
//   } else if (
//     msg.includes("quotation") ||
//     msg.includes("quote") ||
//     msg.includes("budget") ||
//     msg.includes("estimate") ||
//     msg.includes("how much") ||
//     msg.includes("pricing") ||
//     msg.includes("price") ||
//     msg.includes("cost")
//   ) {
//     reply = `💰 To get a budget, timeline, and full estimate for your project, please ${quoteLink}.`;
//   } else if (
//     msg.includes("contact") ||
//     msg.includes("email") ||
//     msg.includes("phone") ||
//     msg.includes("reach you") ||
//     msg.includes("call") ||
//     msg.includes("talk to you")
//   ) {
//     reply = `📞 You can reach us here: ${contactLink}<br/>Or message us directly on ${whatsappLink}.`;
//   } else if (
//     msg.includes("job") ||
//     msg.includes("career") ||
//     msg.includes("vacancy") ||
//     msg.includes("work with you") ||
//     msg.includes("hiring")
//   ) {
//     reply = `👨‍💻 We're always open to talented individuals! Check out our ${careerLink} page for openings.`;
//   } else if (
//     msg.includes("support") ||
//     msg.includes("problem") ||
//     msg.includes("issue") ||
//     msg.includes("bug") ||
//     msg.includes("help me")
//   ) {
//     reply = `🛠️ We're here to help! Please reach out via ${whatsappLink} and describe your issue, for faster support.`;
//   } else if (
//     (msg.includes("services") && msg.includes("prices")) ||
//     (msg.includes("service") && msg.includes("quote")) ||
//     (msg.includes("cost") && msg.includes("contact")) ||
//     msg.split(" ").length > 20
//   ) {
//     reply = `🤖 That sounds like a detailed request! For faster help, feel free to ${whatsappLink} or use our ${contactLink}.`;
//   } else {
//     reply = `❓ I didn’t quite catch that. You can ask about:<br/>
// • Our services<br/>
// • Consultation or quotation<br/>
// • Project cost and timeline<br/>
// • Job openings<br/>
// • Support issues<br/><br/>
// Or simply ${whatsappLink} for instant help.`;
//   }

//   res.json({ reply });
// };
export const handleChatMessage = (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message is required." });
  }

  const msg = message.toLowerCase().trim();

  const whatsappLink = `<a href="https://wa.me/96525713432" target="_blank">WhatsApp us</a>`;
  const consultLink = `<a href="/#consult-us" target="_blank">Consult Us</a>`;
  const quoteLink = `<a href="https://leaptechkw.com/services" target="_blank">Request a Quotation</a>`;
  const careerLink = `<a href="https://leaptechkw.com/career" target="_blank">Career Opportunities</a>`;
  const contactLink = `<a href="tel:+96525713432">Contact Us</a>`;
  const servicesPageLink = `<a href="https://leaptechkw.com/services" target="_blank">our Services page</a>`;

  const services = [
    {
      title: "Smart Home",
      description: `We offer cutting-edge Smart Home solutions to automate your security, lighting, and climate control, making your home safer and more comfortable. Discover all the possibilities on ${servicesPageLink}.`
    },
    {
      title: "Cloud Storage",
      description: `Our Cloud Storage services provide secure, scalable, and reliable data access anytime, anywhere, empowering your business with flexibility and peace of mind. Learn more on ${servicesPageLink}.`
    },
    {
      title: "Web Application",
      description: `Get a professional website or e-commerce platform tailored to your brand, designed to engage customers and grow your online presence. Explore details on ${servicesPageLink}.`
    },
    {
      title: "Mobile Application",
      description: `We build robust and user-friendly mobile applications for both iOS and Android platforms to help you connect with your audience on the go. Visit ${servicesPageLink} for more info.`
    },
    {
      title: "Digital Marketing",
      description: `Boost your business growth with our targeted digital marketing strategies, including SEO, social media, and data-driven campaigns. Check out all offerings at ${servicesPageLink}.`
    },
    {
      title: "E-Business",
      description: `Our E-Business Solutions help enhance your online brand visibility and engagement through tailored digital strategies. Find out more on ${servicesPageLink}.`
    },
    {
      title: "FinTech",
      description: `Transform your financial operations with our innovative FinTech solutions, offering secure transactions, smart analytics, and scalable platforms for modern businesses. Learn more on ${servicesPageLink}.`
    },
 
    
  ];

  // Capitalize words utility
  function capitalizeWords(str) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Normalize service titles for matching
  const normalizedServices = services.map(s => ({
    originalTitle: s.title,
    lowerTitle: s.title.toLowerCase(),
    description: s.description
  }));

  // Check if user message mentions a service
  for (const service of normalizedServices) {
    if (msg.includes(service.lowerTitle)) {
      return res.json({
        reply: `💼 <strong>${service.originalTitle}</strong>: ${service.description} `
      });
    }
  }
  // Array of keyword groups with their responses, for OR matching using some()
  const keywordResponses = [
    {
      keywords: ["hello", "hi", "hey", "start", "begin"],
      reply: `👋 Welcome to Leap Tech! We're excited to help you.<br/><br/>
Here are some of the services we offer:<br/>${services.map(s => `• ${capitalizeWords(s.title)}`).join("<br/>")}<br/><br/>
You can ask about:<br/>
• 💼 More details about a service<br/>
• 🧠 Project consultation (no pricing)<br/>
• 💰 Quotation with budget & deadline<br/>
• 📞 How to contact us<br/>
• 👨‍💻 Job or career opportunities<br/>
• 🛠️ Help with a problem or support<br/><br/>
Ask me anything below 👇`
    },
    {
      keywords: ["services", "service", "offer", "what can you do", "solutions"],
      reply: `💼 Here are the services we offer:<br/>${services.map(s => `• ${capitalizeWords(s.title)}`).join("<br/>")}<br/><br/>Want more details about any of them?`
    },
    {
      keywords: ["consult", "consultation", "discuss project", "idea", "need help with a project"],
      reply: `🧠 You can ${consultLink} to consult with our team about your project — no budget or time estimate needed.`
    },
    {
      keywords: ["quotation", "quote", "budget", "estimate", "how much", "pricing", "price", "cost"],
      reply: `💰 To get a budget, timeline, and full estimate for your project, please ${quoteLink}.`
    },
    {
      keywords: ["contact", "email", "phone", "reach you", "call", "talk to you"],
      reply: `📞 You can reach us here: ${contactLink}<br/>Or message us directly on ${whatsappLink}.`
    },
    {
      keywords: ["job", "career", "vacancy", "work with you", "hiring"],
      reply: `👨‍💻 We're always open to talented individuals! Check out our ${careerLink} page for openings.`
    },
    {
      keywords: ["support", "problem", "issue", "bug", "help me"],
      reply: `🛠️ We're here to help! Please reach out via ${whatsappLink} and describe your issue, for faster support.`
    },
    {
      keywords: ["services prices", "service quote", "cost contact"],
      reply: `🤖 That sounds like a detailed request! For faster help, feel free to ${whatsappLink} or use our ${contactLink}.`
    }
  ];

  // Try matching user message to any keyword group
  for (const group of keywordResponses) {
    if (group.keywords.some(keyword => msg.includes(keyword))) {
      return res.json({ reply: group.reply });
    }
  }

  // If no matches, fallback reply
  const fallbackReply = `❓ I didn’t quite catch that. You can ask about:<br/>
• Our services<br/>
• Consultation or quotation<br/>
• Project cost and timeline<br/>
• Job openings<br/>
• Support issues<br/><br/>
Or simply ${whatsappLink} for instant help.`;

  res.json({ reply: fallbackReply });
};
