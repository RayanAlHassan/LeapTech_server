import ContactModel from '../models/ContactModel.js';
import nodemailer from 'nodemailer';

export const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Save contact message first
    const contact = await ContactModel.create({ name, email, phone, subject, message });

    // Setup transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      }
    });

    // Try sending the email
    try {
      await transporter.sendMail({
        from: email,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Message: ${subject}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      });

      // Email sent successfully
      return res.status(201).json({ message: 'Contact message received and email sent', contact });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);

      // Email failed but contact saved
      return res.status(201).json({
        message: 'Contact message received but failed to send notification email',
        contact,
        emailError: emailError.message
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAllContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const contacts = await ContactModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ContactModel.countDocuments();

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      contacts
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching contact messages' });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contact = await ContactModel.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching contact' });
  }
};