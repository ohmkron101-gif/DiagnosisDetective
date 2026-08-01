export const diseases = {
    "Common Cold": {
        name: "Common Cold", nameTH: "ไข้หวัดธรรมดา",
        symptomsEN: ["Runny nose", "Sore throat", "Fatigue", "Mild Cough"],
        symptomsTH: ["น้ำมูกไหล", "เจ็บคอ", "อ่อนเพลีย", "ไอเล็กน้อย"],
        redHerringEN: "Slight Chest Pain", redHerringTH: "เจ็บหน้าอกนิดหน่อย",
        dialoguesEN: ["I just feel a bit under the weather, Doctor.", "My throat hurts when I swallow.", "I have a runny nose and a slight cough."],
        dialoguesTH: ["ฉันรู้สึกไม่ค่อยสบายเลยค่ะหมอ...", "กลืนน้ำลายแล้วเจ็บคอมากๆ", "ฉันมีน้ำมูกไหล แล้วก็ไอแห้งๆ นิดหน่อย"]
    },
    "Influenza": {
        name: "Influenza", nameTH: "ไข้หวัดใหญ่",
        symptomsEN: ["High Fever", "Muscle ache", "Chills", "Fatigue"],
        symptomsTH: ["ไข้สูง", "ปวดเมื่อยกล้ามเนื้อ", "หนาวสั่น", "อ่อนเพลียมาก"],
        redHerringEN: "Loss of smell", redHerringTH: "จมูกไม่ได้กลิ่น", 
        dialoguesEN: ["Doctor, I feel terrible... like I've been hit by a bus.", "I feel very cold and I can't stop shivering.", "My head hurts and I feel so tired."],
        dialoguesTH: ["หมอ... ฉันรู้สึกแย่มาก เหมือนโดนรถบัสชนมาเลย", "ฉันหนาวมาก... สั่นไปหมดแล้ว", "ปวดหัวจังเลย แถมเพลียมากๆ"]
    },
    "Pneumonia": {
        name: "Pneumonia", nameTH: "ปอดบวม",
        symptomsEN: ["Cough", "High Fever", "Shortness of breath", "Chest pain"],
        symptomsTH: ["ไอหนัก", "ไข้สูง", "หายใจลำบาก", "เจ็บหน้าอก"],
        redHerringEN: "Stomach ache", redHerringTH: "ปวดท้องบิดๆ", 
        dialoguesEN: ["It's hard... to breathe... deep.", "I have this sharp pain in my chest.", "I've been coughing all night."],
        dialoguesTH: ["หมอ... ฉันหายใจ... ลำบากมาก", "ฉันเจ็บหน้าอกแปล๊บๆ เลยครับหมอ", "ฉันไอทั้งคืนเลยหมอ ไม่ได้นอนเลย"]
    },
    "Stroke": {
        name: "Stroke", nameTH: "หลอดเลือดสมองตีบ",
        symptomsEN: ["Numbness", "Confusion", "Loss of balance"],
        symptomsTH: ["ชาตามร่างกาย", "สับสน", "ทรงตัวไม่อยู่"],
        redHerringEN: "Feverish feeling", redHerringTH: "รู้สึกรุมๆ เหมือนมีไข้", 
        dialoguesEN: ["Everything feels numb... I can't think straight.", "My arm feels so heavy...", "I can't feel the right side of my face."],
        dialoguesTH: ["รู้สึกชาไปหมด... คิดอะไรไม่ออกเลย", "แขนมันหนักอึ้งไปหมดเลยหมอ...", "ฉันไม่รู้สึกที่หน้าซีกขวาเลย"]
    },
    "Hypothermia": {
        name: "Hypothermia", nameTH: "ภาวะอุณหภูมิร่างกายต่ำ",
        symptomsEN: ["Shivering", "Confusion", "Fatigue"],
        symptomsTH: ["หนาวสั่นรุนแรง", "สับสน", "อ่อนเพลียจัด"],
        redHerringEN: "Chest tightness", redHerringTH: "แน่นหน้าอกหายใจไม่ออก", 
        dialoguesEN: ["So... cold... can't... move...", "I was out in the cold for hours...", "Everything is going dark..."],
        dialoguesTH: ["หนาว... หนาวมาก... ขยับไม่ได้เลย...", "ฉันตากความหนาวอยู่ข้างนอกมาหลายชั่วโมง...", "หน้ามืดไปหมดแล้ว..."]
    },
    "Hypertension": {
        name: "Hypertension", nameTH: "โรคความดันโลหิตสูง",
        symptomsEN: ["Headache", "Dizziness", "Tense neck"],
        symptomsTH: ["ปวดศีรษะ", "เวียนศีรษะ", "ตึงที่ท้ายทอย"],
        redHerringEN: "Itchy skin", redHerringTH: "คันตามผิวหนัง",
        dialoguesEN: ["My head feels so heavy and dizzy.", "I feel this tightness or tension at the back of my neck.", "My head is pounding, especially in the morning."],
        dialoguesTH: ["รู้สึกหัวหนักๆ เวียนหัวจังเลยค่ะหมอ", "มันรู้สึกตึงๆ ที่บริเวณท้ายทอยน่ะครับ", "ปวดหัวตุ๊บๆ โดยเฉพาะช่วงเช้าเลยหมอ"]
    },
    "Diabetes": {
        name: "Diabetes", nameTH: "โรคเบาหวาน",
        symptomsEN: ["Frequent urination", "Thirst", "Weight loss", "Fatigue"],
        symptomsTH: ["ปัสสาวะบ่อย", "กระหายน้ำบ่อย", "น้ำหนักลด", "อ่อนเพลีย"],
        redHerringEN: "Joint pain", redHerringTH: "ปวดตามข้อ",
        dialoguesEN: ["I have to go to the bathroom so many times during the night.", "No matter how much water I drink, I'm always thirsty.", "I'm losing weight even though I eat normal, and I feel so tired."],
        dialoguesTH: ["ช่วงนี้ต้องลุกไปปัสสาวะตอนกลางคืนบ่อยมากๆ เลยหมอ", "กินน้ำเท่าไหร่ก็ยังรู้สึกคอแห้ง กระหายน้ำตลอดเวลาเลย", "น้ำหนักลดลงทั้งๆ ที่กินเท่าเดิม แถมยังเพลียมากด้วย"]
    }
};