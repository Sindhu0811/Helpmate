import React, { useState, useEffect } from "react";
import "../styles/quickaid.css";
import { addAlert } from "../utils/recentAlerts";

// Quick Aid List (shortened example, you can keep full 100 items)
const quickAidList = [
{ id: 1, title: "CPR", icon: "❤️", text: "If someone needs CPR, begin with 30 firm chest compressions to the center of the chest. Follow with 2 rescue breaths. Keep a steady rhythm at 100-120 compressions per minute to maintain circulation. Call emergency services immediately." },
  { id: 2, title: "Bleeding", icon: "🩸", text: "For bleeding, apply firm pressure directly on the wound with a clean cloth. Elevate the injured part if possible. Keep pressure constant until bleeding stops. Seek medical care if bleeding is severe." },
  { id: 3, title: "Burns", icon: "🔥", text: "If someone has a burn, immediately cool the burned area under running water for 10–20 minutes. Avoid using ice directly. Cover with a clean, non-stick cloth. Seek medical attention for serious burns." },
  { id: 4, title: "Fracture", icon: "🦴", text: "For a fracture, immobilize the injured area with a splint or sturdy support. Do not attempt to realign the bone. Keep the person still and comfortable. Call emergency services for professional care." },
  { id: 5, title: "Choking", icon: "😮‍💨", text: "If a person is choking, give 5 firm back blows between the shoulder blades. Follow with 5 abdominal thrusts if needed. Repeat until the airway is clear. Call emergency help if the person cannot breathe." },
  { id: 6, title: "Snake Bite", icon: "🐍", text: "For a snake bite, keep the person calm and as still as possible to slow venom spread. Do not cut or suck the wound. Immobilize the bitten limb. Get medical attention immediately." },
  { id: 7, title: "Heat Stroke", icon: "🌡️", text: "If someone is suffering from heat stroke, move them to a cooler area immediately. Apply cool cloths or ice packs to key areas. Give small sips of water if conscious. Seek urgent medical care." },
  { id: 8, title: "Asthma Attack", icon: "🫁", text: "During an asthma attack, help the person sit upright to ease breathing. Assist them in using their inhaler as prescribed. Keep them calm and monitor breathing. Call emergency services if symptoms worsen." },
  { id: 9, title: "Heart Attack", icon: "💔", text: "If a person shows signs of a heart attack, call emergency services immediately. Have them chew aspirin if not allergic. Keep the person calm and seated. Monitor vital signs until help arrives." },
  { id: 10, title: "Stroke", icon: "🧠", text: "For a stroke, remember FAST: check Face drooping, Arm weakness, Speech difficulty, and Time to call emergency services. Keep the person calm and lying down. Do not give food or water. Immediate medical attention is critical." },
  { id: 11, title: "Seizure", icon: "⚡", text: "During a seizure, clear the area of hard objects. Do not restrain the person. After the seizure, gently turn them on their side. Stay with them and monitor breathing until fully alert." },
  { id: 12, title: "Fainting", icon: "😵", text: "If someone faints, lay them flat on their back. Elevate their legs slightly. Loosen tight clothing around the neck and waist. Monitor until they regain consciousness." },
  { id: 13, title: "Electric Shock", icon: "⚡", text: "In case of electric shock, turn off the power source first. Do not touch the person until it is safe. Call emergency services immediately. Begin CPR if the person is unresponsive." },
  { id: 14, title: "Poisoning", icon: "☠️", text: "For poisoning, do not induce vomiting unless instructed. Call poison control immediately. Keep the person calm and provide any information about the substance. Seek medical help urgently." },
  { id: 15, title: "Allergic Reaction", icon: "🤧", text: "If someone has an allergic reaction, check for symptoms like swelling, hives, or difficulty breathing. Use an epinephrine auto-injector if available. Call emergency services if severe." },
  { id: 16, title: "Anaphylaxis", icon: "🚨", text: "Anaphylaxis is life-threatening. Use an EpiPen immediately. Call emergency services. Keep the person lying down with legs elevated and monitor until help arrives." },
  { id: 17, title: "Nosebleed", icon: "👃", text: "For a nosebleed, lean the person forward slightly. Pinch the soft part of the nose for about 10 minutes. Keep calm and avoid tilting the head back. Seek medical care if bleeding persists." },
  { id: 18, title: "Sprain", icon: "🦵", text: "For a sprain, follow RICE: Rest the injured area, apply Ice, use Compression bandage, and Elevate above heart level. Avoid putting weight on the limb. Seek care if severe pain occurs." },
  { id: 19, title: "Hypothermia", icon: "❄️", text: "In hypothermia, move the person to a warm environment. Remove wet clothing and cover with blankets. Offer warm drinks if conscious. Seek emergency medical care." },
  { id: 20, title: "Drowning", icon: "🌊", text: "If someone is drowning, remove them safely from water. Check breathing immediately. Start CPR if needed. Call emergency services for urgent care." },
  { id: 21, title: "Eye Injury", icon: "👁️", text: "For an eye injury, avoid rubbing the eye. Flush gently with clean water. Cover lightly if needed and seek professional medical help. Monitor for vision changes." },
  { id: 22, title: "Chemical Burn", icon: "🧪", text: "If a chemical burns the skin or eyes, rinse with water continuously for at least 20 minutes. Remove contaminated clothing. Seek medical care immediately. Avoid neutralizing chemicals unless instructed." },
  { id: 23, title: "Head Injury", icon: "🪖", text: "For a head injury, keep the person still and monitor for confusion or vomiting. Apply gentle pressure if there is bleeding. Seek medical attention immediately for severe symptoms." },
  { id: 24, title: "Diabetic Emergency", icon: "🍬", text: "In a diabetic emergency with low blood sugar, give sugar orally if the person is conscious. Monitor for improvement. Keep them calm and seek medical care if symptoms persist." },
  { id: 25, title: "Dehydration", icon: "💧", text: "For dehydration, encourage the person to drink water or oral rehydration solution. Rest in a cool place. Monitor urine output. Seek care if severe dehydration occurs." },
  { id: 26, title: "Food Poisoning", icon: "🤢", text: "For food poisoning, provide plenty of fluids. Avoid solid foods initially. Rest and monitor for worsening symptoms. Seek medical attention if severe vomiting or dehydration occurs." },
  { id: 27, title: "Chest Pain", icon: "🫀", text: "If someone experiences chest pain, have them rest and remain calm. Monitor for shortness of breath or sweating. Call emergency services immediately. Provide aspirin if not allergic." },
  { id: 28, title: "Insect Sting", icon: "🐝", text: "For an insect sting, remove the stinger carefully. Apply a cold pack to reduce swelling. Monitor for allergic reactions. Seek medical attention if symptoms worsen." },
  { id: 29, title: "Dog Bite", icon: "🐕", text: "After a dog bite, wash the wound thoroughly with soap and water. Apply a clean dressing. Seek medical attention for rabies vaccination if necessary. Monitor for infection." },
  { id: 30, title: "Cat Bite", icon: "🐈", text: "For a cat bite, clean the wound thoroughly with soap and water. Apply an antiseptic dressing. Monitor for signs of infection. Seek medical care if severe or deep wound." },
  { id: 31, title: "Broken Tooth", icon: "🦷", text: "For a broken tooth, rinse the mouth gently. Save any broken piece in milk if possible. Avoid chewing on that side. Seek dental care immediately." },
  { id: 32, title: "Ear Injury", icon: "👂", text: "For an ear injury, avoid inserting objects into the ear canal. Apply gentle pressure for bleeding. Seek medical help for severe pain or hearing loss." },
  { id: 33, title: "Severe Vomiting", icon: "🤮", text: "If vomiting is severe, give small sips of clear fluids. Keep the person hydrated. Rest in a comfortable position. Seek medical care if it persists." },
  { id: 34, title: "Diarrhea", icon: "🚽", text: "For diarrhea, provide oral rehydration salts to prevent dehydration. Maintain hygiene to prevent spread. Monitor for worsening symptoms. Seek care if severe or prolonged." },
  { id: 35, title: "High Fever", icon: "🌡️", text: "For high fever, keep the person comfortable. Use lukewarm sponging to cool. Ensure fluids are given. Seek medical attention if fever persists or is very high." },
  { id: 36, title: "Low Blood Pressure", icon: "🩺", text: "If blood pressure is low, lay the person flat. Raise legs slightly. Keep them calm. Seek medical attention if symptoms persist or worsen." },
  { id: 37, title: "Panic Attack", icon: "😰", text: "During a panic attack, help the person slow their breathing. Reassure them calmly. Provide a quiet environment. Seek help if attacks are severe or frequent." },
  { id: 38, title: "Shock", icon: "🚑", text: "For shock, keep the person lying flat. Elevate legs if possible. Keep them warm and calm. Call emergency services immediately." },
  { id: 39, title: "Severe Cut", icon: "✂️", text: "For a severe cut, apply firm pressure to stop bleeding. Cover with a clean dressing. Keep the injured part elevated. Seek immediate medical attention." },
  { id: 40, title: "Tetanus Risk", icon: "💉", text: "If a wound is dirty and at risk of tetanus, clean thoroughly. Seek a booster shot if needed. Watch for signs of infection. Consult a healthcare professional." },
  { id: 41, title: "Sunburn", icon: "☀️", text: "For sunburn, move the person to a shaded area. Apply cool compresses or aloe gel. Keep skin hydrated. Seek medical care for severe burns." },
  { id: 42, title: "Heat Cramps", icon: "🥵", text: "For heat cramps, rest in a cool place. Drink electrolyte fluids. Stretch affected muscles gently. Seek medical attention if cramps persist." },
  { id: 43, title: "Altitude Sickness", icon: "⛰️", text: "For altitude sickness, descend to a lower altitude. Rest and hydrate. Monitor for severe symptoms like shortness of breath. Seek medical care if necessary." },
  { id: 44, title: "Motion Sickness", icon: "🚗", text: "For motion sickness, sit facing forward and get fresh air. Take small sips of water. Avoid reading or screens. Rest until feeling better." },
  { id: 45, title: "Food Choking Infant", icon: "👶", text: "If an infant is choking on food, give 5 gentle back blows. Follow with 5 chest thrusts. Repeat until airway is clear. Call emergency services if needed." },
  { id: 46, title: "Poison Ivy Rash", icon: "🌿", text: "For poison ivy rash, wash the skin with soap and water immediately. Apply calamine lotion to soothe. Avoid scratching. Seek care if rash spreads or blisters severely." },
  { id: 47, title: "Blisters", icon: "🩹", text: "For blisters, cover with a clean dressing. Do not pop or break the blister. Keep area clean and dry. Seek care if signs of infection appear." },
  { id: 48, title: "Muscle Cramps", icon: "💪", text: "For muscle cramps, gently stretch the affected muscle. Hydrate with water or electrolyte drinks. Massage lightly. Rest until relieved." },
  { id: 49, title: "Back Pain", icon: "🪑", text: "For back pain, rest on a firm surface. Apply heat or cold packs as needed. Avoid heavy lifting. Seek medical care if severe or persistent." },
  { id: 50, title: "Neck Injury", icon: "🦺", text: "For a neck injury, do not move the neck. Keep the person still. Call emergency services. Use support if needed until help arrives." },
  { id: 51, title: "Jaw Injury", icon: "😬", text: "For a jaw injury, support the jaw gently and apply a cold compress to reduce swelling. Avoid moving the jaw or chewing. Keep the person calm and still. Seek medical care immediately." },
  { id: 52, title: "Foreign Object in Eye", icon: "👁️", text: "If a foreign object is in the eye, encourage blinking and gently rinse with clean water. Avoid rubbing the eye. Cover lightly if necessary. Seek professional help if discomfort persists." },
  { id: 53, title: "Splinter", icon: "🪵", text: "For a splinter, clean the area with soap and water. Remove the splinter carefully with sterilized tweezers. Apply antiseptic and cover with a clean bandage. Monitor for signs of infection." },
  { id: 54, title: "Toenail Injury", icon: "🦶", text: "If a toenail is injured, clean the area thoroughly. Apply a sterile dressing to prevent infection. Avoid putting pressure on the toe. Seek medical care if bleeding or pain is severe." },
  { id: 55, title: "Finger Cut", icon: "✋", text: "For a finger cut, apply firm pressure to stop bleeding. Clean the wound with soap and water. Cover with a sterile bandage. Seek medical attention if the cut is deep or bleeding persists." },
  { id: 56, title: "Shoulder Dislocation", icon: "🏥", text: "For a shoulder dislocation, immobilize the arm in the current position. Avoid trying to pop it back in place. Apply ice to reduce swelling. Call emergency services for professional care." },
  { id: 57, title: "Knee Injury", icon: "🦵", text: "For a knee injury, rest the joint and avoid putting weight on it. Apply ice to reduce swelling. Use a compression bandage if needed. Seek medical attention for severe pain or instability." },
  { id: 58, title: "Wrist Injury", icon: "⌚", text: "For a wrist injury, immobilize the wrist using a splint or support. Apply ice to reduce swelling. Keep the hand elevated if possible. Seek medical attention for severe pain or deformity." },
  { id: 59, title: "Toe Fracture", icon: "🦶", text: "For a suspected toe fracture, buddy tape it to the adjacent toe. Rest and avoid putting pressure on the foot. Apply ice to reduce swelling. Seek medical care for proper assessment." },
  { id: 60, title: "Nail Puncture", icon: "🔩", text: "For a nail puncture wound, clean thoroughly with soap and water. Apply antiseptic and cover with a sterile bandage. Monitor for signs of infection. Seek tetanus booster if needed." },
  { id: 61, title: "Smoke Inhalation", icon: "🚬", text: "If someone inhales smoke, move them immediately to fresh air. Keep the person calm and sitting upright. Monitor breathing and oxygen levels. Seek medical care urgently for severe cases." },
  { id: 62, title: "Carbon Monoxide", icon: "🏠", text: "If carbon monoxide exposure is suspected, get the person outside immediately. Call emergency services. Monitor breathing and consciousness. Do not re-enter the area until it is safe." },
  { id: 63, title: "Chemical Inhalation", icon: "🧫", text: "For chemical inhalation, move to fresh air immediately. Loosen tight clothing to ease breathing. Monitor the person for coughing or difficulty breathing. Seek medical attention urgently." },
  { id: 64, title: "Alcohol Poisoning", icon: "🍺", text: "If someone has alcohol poisoning, do not let them sleep alone. Keep them sitting up if conscious. Monitor breathing and responsiveness. Call emergency services immediately." },
  { id: 65, title: "Drug Overdose", icon: "💊", text: "In case of drug overdose, call emergency services immediately. Provide naloxone if trained and available. Keep the person on their side to prevent choking. Monitor breathing and consciousness." },
  { id: 66, title: "Severe Headache", icon: "🤕", text: "For a severe headache, rest in a quiet, dark room. Drink water and stay hydrated. Apply cold compress to the forehead if needed. Seek medical help if the headache is sudden or intense." },
  { id: 67, title: "Migraine", icon: "🧠", text: "During a migraine, rest in a dark and quiet room. Apply a cold or warm compress to the head. Stay hydrated and avoid triggers. Seek medical attention if the migraine is severe or persistent." },
  { id: 68, title: "Eye Strain", icon: "💻", text: "For eye strain, rest eyes and take regular breaks from screens. Blink frequently to keep eyes moist. Adjust lighting to reduce glare. Seek professional care if discomfort continues." },
  { id: 69, title: "Dehydration Child", icon: "🧃", text: "For a dehydrated child, give frequent sips of oral rehydration solution. Keep the child in a cool, comfortable environment. Monitor for signs of severe dehydration. Seek medical care if symptoms worsen." },
  { id: 70, title: "Heat Rash", icon: "🌞", text: "For heat rash, keep the skin cool and dry. Dress in loose clothing. Apply gentle, soothing creams if needed. Avoid scratching to prevent infection." },
  { id: 71, title: "Athlete’s Foot", icon: "🦶", text: "For athlete’s foot, keep feet clean and dry. Apply antifungal cream as instructed. Wear breathable footwear. Seek medical attention if the infection spreads or worsens." },
  { id: 72, title: "Ringworm", icon: "⭕", text: "For ringworm, apply antifungal cream to the affected area. Keep the skin clean and dry. Avoid sharing personal items. Seek medical advice if infection persists." },
  { id: 73, title: "Tick Bite", icon: "🕷️", text: "If bitten by a tick, remove it carefully with tweezers. Clean the area with soap and water. Monitor for rash or fever. Seek medical attention if symptoms appear." },
  { id: 74, title: "Scorpion Sting", icon: "🦂", text: "For a scorpion sting, apply a cold pack to reduce pain and swelling. Keep the person calm and still. Monitor vital signs. Seek medical care immediately for severe symptoms." },
  { id: 75, title: "Jellyfish Sting", icon: "🪼", text: "For a jellyfish sting, rinse with vinegar or seawater to neutralize toxins. Avoid fresh water as it can worsen pain. Remove tentacles carefully. Seek medical help if reaction is severe." },
  { id: 76, title: "Fish Hook Injury", icon: "🎣", text: "For a fish hook injury, avoid forcing it out. Clean the area and apply antiseptic. Cover with a sterile dressing. Seek medical attention for proper removal." },
  { id: 77, title: "Road Rash", icon: "🏍️", text: "For road rash, clean the affected area gently with water. Remove debris and apply antiseptic. Cover with a clean dressing. Seek medical attention for deep abrasions." },
  { id: 78, title: "Burning Eyes", icon: "👀", text: "For burning eyes, rinse continuously with clean water for at least 15 minutes. Avoid rubbing. Remove contact lenses if applicable. Seek professional help if pain persists." },
  { id: 79, title: "Sore Throat", icon: "🗣️", text: "For a sore throat, drink warm fluids and rest the voice. Gargle with warm salt water. Avoid irritants like smoke. Seek medical advice if pain or fever persists." },
  { id: 80, title: "Coughing Fit", icon: "😷", text: "During a coughing fit, sit upright to ease breathing. Take slow, controlled breaths. Drink small sips of water. Seek medical help if coughing is severe or persistent." },
  { id: 81, title: "Nausea", icon: "🤢", text: "If feeling nauseous, take small sips of ginger tea or water. Rest in a comfortable position. Avoid strong smells or heavy meals. Seek medical care if vomiting is severe or persistent." },
  { id: 82, title: "Constipation", icon: "🚽", text: "For constipation, increase fluid intake and dietary fiber. Engage in light physical activity. Avoid straining during bowel movements. Seek medical advice if condition persists." },
  { id: 83, title: "Dizziness", icon: "💫", text: "If someone feels dizzy, have them sit or lie down immediately. Keep the head level with the body. Drink water if dehydration is suspected. Seek medical care if dizziness persists or worsens." },
  { id: 84, title: "Shortness of Breath", icon: "🫁", text: "If someone has shortness of breath, have them sit upright. Keep calm and monitor breathing. Use inhaler if prescribed. Call emergency services if severe or sudden." },
  { id: 85, title: "Chest Tightness", icon: "🫀", text: "For chest tightness, have the person rest and stay calm. Monitor for additional symptoms like sweating or shortness of breath. Seek emergency care if symptoms are severe or sudden." },
  { id: 86, title: "High Blood Sugar", icon: "🍭", text: "For high blood sugar, encourage the person to drink water and monitor levels. Rest in a comfortable position. Watch for signs of confusion or fatigue. Seek medical care if symptoms persist." },
  { id: 87, title: "Low Blood Sugar", icon: "🍬", text: "For low blood sugar, give fast-acting sugar orally if the person is conscious. Monitor for improvement. Keep them seated or lying down. Seek medical help if symptoms continue." },
  { id: 88, title: "Frostbite", icon: "🥶", text: "For frostbite, warm the affected area gradually. Avoid rubbing as it can damage tissue. Keep the area elevated if possible. Seek urgent medical care for severe frostbite." },
  { id: 89, title: "Burning Urination", icon: "🚻", text: "For burning urination, encourage drinking plenty of water. Maintain hygiene. Avoid irritants such as caffeine or alcohol. Seek medical advice if symptoms persist or worsen." },
  { id: 90, title: "Abdominal Pain", icon: "🤰", text: "For abdominal pain, have the person rest in a comfortable position. Monitor for severe or worsening symptoms. Avoid giving food or medications unless advised. Seek medical care if pain is severe." },
  { id: 91, title: "Appendicitis Signs", icon: "⚠️", text: "For suspected appendicitis, watch for severe pain in the lower right abdomen. Monitor for nausea or fever. Avoid giving food or drink. Seek emergency medical attention immediately." },
  { id: 92, title: "Testicular Pain", icon: "⚠️", text: "For sudden testicular pain, monitor for swelling and severe discomfort. Avoid physical activity. Seek immediate medical attention. Early diagnosis is critical." },
  { id: 93, title: "Severe Back Injury", icon: "🦺", text: "For severe back injury, avoid moving the person. Keep them lying flat and still. Apply support if necessary. Call emergency services immediately." },
  { id: 94, title: "Severe Allergies", icon: "🌸", text: "For severe allergies, avoid the trigger. Take prescribed antihistamines. Monitor for swelling or breathing difficulties. Seek emergency care if symptoms escalate." },
  { id: 95, title: "Eye Redness", icon: "🔴", text: "For eye redness, rinse the eyes gently. Avoid rubbing. Apply soothing eye drops if available. Seek medical advice if redness persists or worsens." },
  { id: 96, title: "Foot Swelling", icon: "🦶", text: "For foot swelling, elevate the foot above heart level. Apply gentle compression if advised. Rest and avoid standing for long periods. Seek care if swelling is severe or sudden." },
  { id: 97, title: "Hand Swelling", icon: "✋", text: "For hand swelling, remove rings or tight items. Elevate the hand. Apply cold compress if needed. Monitor for pain or discoloration. Seek medical attention if symptoms worsen." },
  { id: 98, title: "Persistent Vomiting", icon: "🤮", text: "For persistent vomiting, give small sips of clear fluids. Keep the person comfortable and upright if possible. Avoid solid foods temporarily. Seek medical care if vomiting continues." },
  { id: 99, title: "Severe Diarrhea", icon: "🚨", text: "For severe diarrhea, provide oral rehydration solutions to prevent dehydration. Keep the person rested. Monitor for fever or blood in stool. Seek medical care if symptoms persist." },
  { id: 100, title: "Unconscious Person", icon: "🆘", text: "If a person is unconscious, check breathing immediately. Call emergency services. Begin CPR if needed. Keep the airway clear and monitor until help arrives." }

  
];
const QuickAidPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  // stop voice when leaving page
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const speakText = (title, text) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setCurrentlyPlaying(title);

      // 🔔 Recent Updates (depends on what user clicks)
      addAlert(`🔊 Listened to Quick Aid: ${title}`);
    };

    utterance.onend = () => {
      setCurrentlyPlaying(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setCurrentlyPlaying(null);
  };

  const filteredList = quickAidList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="quick-aid-page">
      <div className="quick-aid-container">
        <h2>🚑 Quick Aid Guide</h2>

        <input
          type="text"
          placeholder="Search Quick Aid..."
          className="quick-aid-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="quick-aid-grid">
          {filteredList.map((item) => (
            <div key={item.id} className="quick-aid-card">
              <div className="quick-aid-header">
                <div className="quick-aid-icon">{item.icon}</div>
                <h3>{item.title}</h3>
              </div>

              <p className="quick-aid-text">{item.text}</p>

              <div className="quick-aid-actions">
                <button
                  className="listen-btn"
                  onClick={() => speakText(item.title, item.text)}
                  disabled={currentlyPlaying === item.title}
                >
                  {currentlyPlaying === item.title ? "🔊 Playing..." : "🔊 Start"}
                </button>

                <button
                  className="stop-btn"
                  onClick={stopSpeaking}
                  disabled={!currentlyPlaying}
                >
                  ⏹ Stop
                </button>
              </div>
            </div>
          ))}

          {filteredList.length === 0 && (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#64748b" }}>
              No results found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickAidPage;