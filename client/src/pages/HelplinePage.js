import React, { useState } from "react";
import { IoCallOutline } from "react-icons/io5";
import "../styles/Helpline.css";
import { addAlert } from "../utils/recentAlerts";

const emergencyServices = [
  { category: "National & General Emergencies", name: "Unified Emergency (Police / Fire / Ambulance)", number: "112" },
  { category: "National & General Emergencies", name: "Police Control Room", number: "100" },
  { category: "National & General Emergencies", name: "Fire Brigade", number: "101" },
  { category: "National & General Emergencies", name: "Ambulance", number: "102 / 108" },
  { category: "National & General Emergencies", name: "Traffic Police", number: "103" },
  { category: "National & General Emergencies", name: "Disaster Management / Flood Control", number: "1070" },
  { category: "National & General Emergencies", name: "Emergency Relief Commissioner", number: "1071" },

  { category: "Medical & Health Helplines", name: "Emergency Ambulance (National)", number: "108" },
  { category: "Medical & Health Helplines", name: "Health Helpline / Blood Requirement", number: "104" },
  { category: "Medical & Health Helplines", name: "Poison Control", number: "1066 / 011-1066" },
  { category: "Medical & Health Helplines", name: "AIDS Helpline", number: "1097" },
  { category: "Medical & Health Helplines", name: "Epidemic / COVID Helpline", number: "1075" },
  { category: "Medical & Health Helplines", name: "Air Ambulance (Paid Service)", number: "9540161344" },
  { category: "Medical & Health Helplines", name: "Mental Health Helpline (KIRAN)", number: "1800-599-0019" },
  { category: "Medical & Health Helplines", name: "Suicide Prevention Helpline", number: "9152987821" },

  { category: "Women, Children & Social Helplines", name: "Women Helpline", number: "181" },
  { category: "Women, Children & Social Helplines", name: "Women Police Help", number: "1091 / 1092" },
  { category: "Women, Children & Social Helplines", name: "Child Helpline", number: "1098" },
  { category: "Women, Children & Social Helplines", name: "Senior Citizen Helpline", number: "14567 / 1291" },
  { category: "Women, Children & Social Helplines", name: "Domestic Violence Support", number: "181" },
  { category: "Women, Children & Social Helplines", name: "Anti-Drug / Narcotics Helpline", number: "1095" },
  { category: "Women, Children & Social Helplines", name: "SC / ST Atrocity Helpline", number: "14566" },
  { category: "Women, Children & Social Helplines", name: "Labour & Employment Helpline", number: "155214" },

  { category: "Travel, Rail & Roads", name: "Indian Railways Enquiry / Emergency", number: "139" },
  { category: "Travel, Rail & Roads", name: "Railway Security (RPF)", number: "182" },
  { category: "Travel, Rail & Roads", name: "National Highway Emergency", number: "1033" },
  { category: "Travel, Rail & Roads", name: "Road Accident Emergency", number: "1073" },
  { category: "Travel, Rail & Roads", name: "Tourist Helpline (India)", number: "1363 / 1800-11-1363" },
  { category: "Travel, Rail & Roads", name: "Civil Aviation Emergency", number: "155260" },

  { category: "Utilities & Public Services", name: "LPG Gas Leak Emergency", number: "1906" },
  { category: "Utilities & Public Services", name: "Electricity Emergency", number: "1912" },
  { category: "Utilities & Public Services", name: "Water Supply Complaint", number: "1916" },
  { category: "Utilities & Public Services", name: "Telephone Complaint (Telecom)", number: "198" },
  { category: "Utilities & Public Services", name: "Directory Enquiry", number: "197" },

  { category: "Other Important Helplines", name: "Cyber Crime Helpline", number: "1930" },
  { category: "Other Important Helplines", name: "Voter Helpline", number: "1950" },
  { category: "Other Important Helplines", name: "Anti-Corruption Helpline", number: "1064 / 1031" },
  { category: "Other Important Helplines", name: "Animal Rescue Helpline", number: "1962" },
  { category: "Other Important Helplines", name: "Consumer Complaint Helpline", number: "1915" },
];

const HelplinePage = () => {
  const [calling, setCalling] = useState(false); // ✅ Prevent double alert

  const handleCall = (service) => {
    if (calling) return; // Stop if already calling

    setCalling(true);

    // ✅ Add alert safely
    addAlert(`📞 Called ${service.name}`);

    // ✅ Take only first number
    const phoneNumber = service.number.split(" / ")[0].replace(/-/g, "").trim();

    // ✅ Open dialer
    window.open(`tel:${phoneNumber}`);

    // ✅ Unlock after 1 second
    setTimeout(() => setCalling(false), 1000);
  };

  return (
    <div className="helpline-page">
      <div className="contact-card">
        <div className="contact-header">
          <h2>Emergency Helpline Numbers</h2>
        </div>

        {emergencyServices.map((service, index) => (
          <div className="contact-row" key={index}>
            <div className="contact-left">
              <div className="contact-avatar">{service.name.charAt(0)}</div>
              <div className="contact-info">
                <h4>{service.name}</h4>
                <p>{service.number}</p>
              </div>
            </div>

            <div className="contact-actions">
              <button
                className="action-btn call"
                onClick={() => handleCall(service)}
                disabled={calling}
              >
                <IoCallOutline />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelplinePage;