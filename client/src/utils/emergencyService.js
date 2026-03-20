import axios from "axios";
import { addAlert } from "./recentAlerts";

// Send emergency alert emails to all contacts
export const sendEmergencyAlert = async (type, userEmail) => {
  try {
    const res = await axios.get(
      "https://helpmate-production.up.railway.app/api/emergency-contacts",
      { params: { email: userEmail } }
    );

    const contacts = res.data || [];

    // Call backend API to send emails
    await axios.post("https://helpmate-production.up.railway.app/api/send-emails", {
      type,
      contacts,
      userEmail
    });

    addAlert(`🚨 ${type} alert sent to ${contacts.length} contacts`);
    return true;
  } catch (err) {
    console.error(err);
    addAlert("❌ Failed to send emergency alert");
    return false;
  }
};

// Cancel emergency
export const cancelEmergency = (reason) => {
  addAlert(`❌ Emergency cancelled: ${reason}`);
};