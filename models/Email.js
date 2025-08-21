import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  from: { type: String, required: true },
  bodyPreview: String,
  receivedDateTime: { type: Date, required: true },
  isRead: { type: Boolean, default: false },
  toRecipients: [String],
  attachments: [String]
}, { timestamps: true });

const EmailModel = mongoose.model('Email', emailSchema);
export default EmailModel