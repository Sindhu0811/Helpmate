import React, { useState } from "react";
import "../styles/FAQ.css";

const faqData = [
  {
    question: "What is Helpmate?",
    answer:
      "Helpmate is a web-based emergency support and safety platform designed to assist users during urgent situations. It provides quick access to emergency helpline numbers, nearby hospitals or police stations, first-aid guidance, SOS alerts, and personal safety features to ensure users stay protected and connected.",
  },
  {
    question: "How do I use the SOS feature?",
    answer:
      "The SOS feature allows you to quickly send an emergency alert when you are in danger. Once activated, Helpmate notifies your saved emergency contacts, shares your location details, and guides you toward immediate support, ensuring faster response during accidents or unsafe situations.",
  },
  {
    question: "Can I call helplines directly from the website?",
    answer:
      "Yes. Helpmate provides one-tap calling to important emergency numbers, including police, ambulance, fire services, and women’s helplines. This feature saves time during emergencies, so you don’t have to search for numbers manually.",
  },
  {
    question: "How does Nearby Help work?",
    answer:
      "Nearby Help helps users locate essential services close to their current location, such as hospitals, clinics, police stations, and pharmacies. It provides directions and contact details for quick access to physical assistance during medical or safety emergencies.",
  },
  {
    question: "Can I add my own emergency contacts?",
    answer:
      "Yes. Helpmate allows you to add trusted family members, friends, or guardians into the My Contacts section. These contacts can be alerted or called quickly during emergencies, giving you faster support from people you trust.",
  },
  {
    question: "What is Quick Aid?",
    answer:
      "Quick Aid provides basic first-aid guidance for emergencies. It includes instructions for handling injuries, burns, choking, CPR, and other urgent medical situations. This feature is useful until professional help arrives.",
  },
  {
    question: "Is Helpmate free to use?",
    answer:
      "Yes. Helpmate is currently free for all users, giving access to essential safety services like SOS alerts, helpline calling, emergency contact support, and Quick Aid guidance. Advanced features may be introduced later, but core services remain free.",
  },
  {
    question: "Do I need internet for Helpmate?",
    answer:
      "Some features, like direct calling, work without internet. However, functions like location tracking, Nearby Help search, and online notifications require an active internet connection. It is recommended to keep mobile data or Wi-Fi enabled for full functionality.",
  },
  {
    question: "Can I view my previous alerts?",
    answer:
      "Yes. The Alert History section stores records of your previous emergency alerts and actions. This helps you track when alerts were triggered, review emergency activity, and maintain a record of safety events for future reference.",
  },
  {
    question: "Is my data safe in Helpmate?",
    answer:
      "Helpmate prioritizes user privacy and security. Personal information, emergency contacts, and profile details are protected using secure authentication and safe data storage practices. Sensitive information is never shared without user consent.",
  },
  {
    question: "Can I update my profile details?",
    answer:
      "Yes. You can update personal information, contact details, and emergency preferences anytime through the Profile page. Keeping your profile updated ensures alerts and safety features work accurately when needed.",
  },
  {
    question: "How do I contact Helpmate support?",
    answer:
      "If you face any issues, you can contact Helpmate support via the Contact Us page or through the Settings section. The FAQ page also provides solutions for common problems, allowing users to resolve issues quickly.",
  },
  {
    question: "Can I receive alerts from multiple locations?",
    answer:
      "Yes. Helpmate allows you to set up multiple locations and receive alerts relevant to those areas. This is useful if you frequently travel or live in multiple places.",
  },
  {
    question: "How accurate is the location tracking?",
    answer:
      "Helpmate uses GPS and network-based location tracking to determine your position. While highly accurate, the precision may vary depending on device, signal strength, and environmental conditions.",
  },
  {
    question: "Can I customize my emergency contacts list?",
    answer:
      "Yes. You can add, remove, or edit emergency contacts at any time. You can also assign roles or relations (like family, friend, neighbor) to organize them better for alerts.",
  },
  {
    question: "Are there notifications for false alarms?",
    answer:
      "Yes. If an SOS alert is triggered accidentally, you can cancel it immediately within the app to prevent notifying your contacts unnecessarily.",
  },
  {
    question: "Can Helpmate track my real-time location for emergency services?",
    answer:
      "Yes. When an SOS alert is triggered, Helpmate shares your real-time location with your selected emergency contacts and relevant services to ensure rapid assistance.",
  },
  {
    question: "Does Helpmate work on all mobile devices?",
    answer:
      "Helpmate is compatible with most Android and iOS devices. Features may vary slightly depending on the device’s OS version and hardware capabilities.",
  },
  {
    question: "Can I receive SOS alerts from other users nearby?",
    answer:
      "Currently, Helpmate sends alerts only to your personal emergency contacts. Nearby Help helps you locate services, but alerts from other users are not shared directly to you to maintain privacy.",
  },
  {
    question: "Can I use Helpmate for non-emergency safety tips?",
    answer:
      "Yes. Helpmate provides information about first-aid, safety measures, and local emergency contacts which can be useful even in non-critical situations to stay prepared.",
  },
  {
    question: "How can I make my Helpmate account more secure?",
    answer:
      "Use a strong password, keep your app updated, and avoid sharing your login credentials. Always update your emergency contacts and ensure your location services are enabled for accurate tracking.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="faq-card-box">
        <div className="faq-header">
          <h2>FAQ</h2>
          <p>Frequently asked questions about Helpmate and how to use it safely</p>
        </div>

        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <h4>{item.question}</h4>
              <span className="faq-plus">{openIndex === index ? "−" : "+"}</span>
            </div>

            {openIndex === index && (
              <div className="faq-answer">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}