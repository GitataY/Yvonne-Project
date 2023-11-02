const mongoose = require("mongoose");

const ussdSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
      trim: true,
      maxlength: [20, "maximum characters reached"],
    },
    donation: {
      type: String,
      required: [true, "product name is required"],
      trim: true,
      maxlength: [20, "maximum characters reached"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Ussd", ussdSchemaSchema);
