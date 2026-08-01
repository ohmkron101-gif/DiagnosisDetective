import { Patient } from './patient.js';
import { diseases } from './diseases.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800; 
canvas.height = 600;

const assets = { 
    bg: { 
        src: 'assets/background/hospital.png', 
        img: new Image() 
      } 
};

const titleScreen = document.getElementById('title-screen');
const btnStartGame = document.getElementById('btn-start-game');
const btnHowToPlay = document.getElementById('btn-how-to-play'); 
const langSelectModal = document.getElementById('lang-select-modal');
const btnChooseTh = document.getElementById('btn-choose-th');
const btnChooseEn = document.getElementById('btn-choose-en');
const btnLangToggleFixed = document.getElementById('btn-lang-toggle-fixed');

const caseSelectModal = document.getElementById('case-select-modal');
const caseBtns = document.querySelectorAll('.case-folder');
const btnBackFromCase = document.getElementById('btn-back-from-case');
const btnBackFromFeedback = document.getElementById('btn-back-from-feedback');

const introModal = document.getElementById('intro-modal');
const btnStartShift = document.getElementById('btn-start-shift');
const dossierModal = document.getElementById('dossier-modal');
const gameUI = document.getElementById('game-ui');
const feedbackModal = document.getElementById('feedback-modal');

const tutorialModal = document.getElementById('tutorial-modal');
const tutTitle = document.getElementById('tut-title');
const tutText = document.getElementById('tut-text');
const tutDotsContainer = document.getElementById('tut-dots');
const btnTutSkip = document.getElementById('btn-tut-skip');
const btnTutNext = document.getElementById('btn-tut-next');
const tutImage = document.getElementById('tut-image');

const timerDisplay = document.getElementById('timer');
const coinDisplay = document.getElementById('coin-count');
const doctorLog = document.getElementById('doctor-log');
const diagnosisInput = document.getElementById('diagnosis-input');

let patientStability = 100; 
const healthBarFill = document.getElementById('health-bar-fill');
const healthText = document.getElementById('health-text');

const introTitle = document.getElementById('intro-title');
const introText = document.querySelector('.intro-text');
const cutsceneModal = document.getElementById('cutscene-modal');
const cutsceneText = document.getElementById('cutscene-text');
const speakerName = document.getElementById('speaker-name');
const actionLoading = document.getElementById('action-loading');
const loadingBarFill = document.getElementById('loading-bar-fill');

const imageResultModal = document.getElementById('image-result-modal');
const imageResultTitle = document.getElementById('image-result-title');
const cssXrayView = document.getElementById('css-xray-view');
const cssBloodView = document.getElementById('css-blood-view');
const cssTempView = document.getElementById('css-temp-view');
const btnCloseImage = document.getElementById('btnClose-image'); // Fallback map inside button close
const btnCloseImageActual = document.getElementById('btn-close-image');

const btnViewXray = document.getElementById('btn-view-xray');
const btnViewBlood = document.getElementById('btn-view-blood');
const btnViewTemp = document.getElementById('btn-view-temp');
const btnViewBp = document.getElementById('btn-view-bp');
const btnViewGlucose = document.getElementById('btn-view-glucose');
const cssBpView = document.getElementById('css-bp-view');
const cssGlucoseView = document.getElementById('css-glucose-view');
const btnHint = document.getElementById('btn-hint'); 
const btnConsult = document.getElementById('btn-consult');
const btnInGameWiki = document.getElementById('btn-in-game-wiki');
const drugLibraryModal = document.getElementById('drug-library-modal');
const btnCloseDrugLibrary = document.getElementById('btn-close-drug-library');
const drugLibraryContent = document.getElementById('drug-library-content');

const btnMedRefs = document.getElementById('btn-med-refs');
const medRefsModal = document.getElementById('med-refs-modal');
const btnCloseMedRefs = document.getElementById('btn-close-med-refs');
const medRefsContent = document.getElementById('med-refs-content');

const sfxClick = document.getElementById('sfx-click');
const sfxType = document.getElementById('sfx-type');
const sfxScan = document.getElementById('sfx-scan');
const sfxSuccess = document.getElementById('sfx-success');
const sfxFail = document.getElementById('sfx-fail');

const btnShowAchievements = document.getElementById('btn-show-achievements');
const achievementsModal = document.getElementById('achievements-modal');
const btnCloseAchievements = document.getElementById('btn-close-achievements');
const achievementsList = document.getElementById('achievements-list');
const achievementToast = document.getElementById('achievement-toast');
const achDescText = document.getElementById('ach-desc-text');

const chiefWarningToast = document.getElementById('chief-warning-toast');
const chiefWarningText = document.getElementById('chief-warning-text');
const chiefWarningTitle = document.getElementById('chief-warning-title');

let gameState = 'LOADING'; 
let currentPatient = null;
let currentDifficulty = 'normal'; 
let coins = 50;
let timeElapsed = 0;
let timerInterval = null;
let currentAskCost = 5; 
let isThai = false; 

let lastResult = { 
    isCorrect: false, 
    time: 0, 
    coins: 0, 
    grade: "C",
    messageEN: "",
    messageTH: ""
};

const dynamicDict = {
    "Fever": "มีไข้", 
    "High Fever": "ไข้สูง", 
    "Cough": "ไอ", 
    "Dry Cough": "ไอแห้ง",
    "Headache": "ปวดหัว", 
    "Sore throat": "เจ็บคอ", 
    "Runny nose": "น้ำมูกไหล",
    "Fatigue": "อ่อนเพลีย", 
    "Shortness of breath": "หายใจลำบาก", 
    "Chest pain": "เจ็บหน้าอก",
    "Numbness": "ชาตามร่างกาย", 
    "Confusion": "สับสน", 
    "Shivering": "หนาวสั่น", 
    "Chills": "หนาวสั่น",
    "Muscle ache": "ปวดเมื่อยกล้ามเนื้อ", 
    "Loss of taste": "สูญเสียการรับรส", 
    "Loss of smell": "ไม่ได้กลิ่น",
    "Slight Chest Pain": "เจ็บหน้าอกนิดหน่อย", 
    "Stomach ache": "ปวดท้องบิดๆ", 
    "Feverish feeling": "รู้สึกรุมๆ เหมือนมีไข้", 
    "Chest tightness": "แน่นหน้าอกหายใจไม่ออก", 
    "It's hard... to breathe... deep.": "หมอ... ฉันหายใจ... ลำบากมาก",
    "I have this sharp pain in my chest.": "ฉันเจ็บหน้าอกแปล๊บๆ เลยครับหมอ",
    "I feel very cold and I can't stop shivering.": "ฉันหนาวมาก... สั่นไปหมดแล้ว",
    "My head hurts and I feel so tired.": "ปวดหัวจังเลย แถมเพลียมากๆ",
    "I have a runny nose and a slight cough.": "ฉันมีน้ำมูกไหล แล้วก็ไอแห้งๆ นิดหน่อย",
    "Everything feels numb... I can't think straight.": "รู้สึกชาไปหมด... คิดอะไรไม่ออกเลย",
    "I feel like I'm burning up.": "รู้สึกตัวร้อนเป็นไฟเลยหมอ",
    "My throat hurts when I swallow.": "กลืนน้ำลายแล้วเจ็บคอมากๆ",
    "I've been coughing all night.": "ฉันไอทั้งคืนเลยหมอ ไม่ได้นอนเลย",
    "Doctor, I feel terrible... like I've been hit by a bus.": "หมอ... ฉันรู้สึกแย่มาก เหมือนโดนรถบัสชนมาเลย",
    "I feel terrible... like I've been hit by a bus.": "ฉันรู้สึกแย่มาก... เหมือนโดนรถบัสชนมาเลย",
    "I just feel a bit under the weather, Doctor.": "ฉันรู้สึกไม่ค่อยสบายเลยค่ะหมอ...",
    "My arm feels so heavy...": "แขนมันหนักอึ้งไปหมดเลยหมอ...",
    "I can't feel the right side of my face.": "ฉันไม่รู้สึกที่หน้าซีกขวาเลย",
    "So... cold... can't... move...": "หนาว... หนาวมาก... ขยับไม่ได้เลย...",
    "I was out in the cold for hours...": "ฉันตากความหนาวอยู่ข้างนอกมาหลายชั่วโมง...",
    "Everything is going dark...": "หน้ามืดไปหมดแล้ว...",
    "Dizziness": "เวียนศีรษะ",
    "Tense neck": "ตึงที่ท้ายทอย",
    "Itchy skin": "คันตามผิวหนัง",
    "Frequent urination": "ปัสสาวะบ่อย",
    "Thirst": "กระหายน้ำบ่อย",
    "Weight loss": "น้ำหนักลด",
    "Joint pain": "ปวดตามข้อ",
    "My head feels so heavy and dizzy.": "รู้สึกหัวหนักๆ เวียนหัวจังเลยค่ะหมอ",
    "I feel this tightness or tension at the back of my neck.": "มันรู้สึกตึงๆ ที่บริเวณท้ายทอยน่ะครับ",
    "My head is pounding, especially in the morning.": "ปวดหัวตุ๊บๆ โดยเฉพาะช่วงเช้าเลยหมอ",
    "I have to go to the bathroom so many times during the night.": "ช่วงนี้ต้องลุกไปปัสสาวะตอนกลางคืนบ่อยมากๆ เลยหมอ",
    "No matter how much water I drink, I'm always thirsty.": "กินน้ำเท่าไหร่ก็ยังรู้สึกคอแห้ง กระหายน้ำตลอดเวลาเลย",
    "I'm losing weight even though I eat normal, and I feel so tired.": "น้ำหนักลดลงทั้งๆ ที่กินเท่าเดิม แถมยังเพลียมากด้วย"
};

const reverseDynamicDict = {};
for (const en in dynamicDict) {
    const th = dynamicDict[en];
    if (th && !reverseDynamicDict[th]) {
        reverseDynamicDict[th] = en;
    }
}

let currentTutStep = 0;
const tutorialData = {
    th: [
        {
            title: "ยินดีต้อนรับคุณหมอ",
            image: "assets/tutorial/tut1.png", 
            text: "หน้าที่ของคุณคือการวิเคราะห์และแยกโรค (Differential Diagnosis) จากอาการของคนไข้ที่อยู่ตรงหน้า"
        },
        {
            title: "สังเกตหลอดเลือดคนไข้",
            image: "assets/tutorial/tut2.png", 
            text: "ระวังให้ดี! <span class='tut-highlight'>หลอดเลือด (HP) จะลดลงเรื่อยๆ</span> ตามเวลาที่ผ่านไป หากตัดสินใจช้าคนไข้จะอาการทรุดและ Game Over ทันที"
        },
        {
            title: "บริหารงบประมาณ",
            image: "assets/tutorial/tut3.png", 
            text: "การซักประวัติ หรือส่งแล็บตรวจ (X-Ray, Blood, Temp) ล้วนมี <span class='tut-highlight'>ค่าใช้จ่าย</span> บริหารเงินให้ดีเพื่อคว้า Rank S ตอนจบเคส"
        },
        {
            title: "การวินิจฉัย",
            image: "assets/tutorial/tut4.png", 
            text: "เมื่อรวบรวมข้อมูลจนมั่นใจแล้ว ให้เลือกโรคที่ช่อง DIAGNOSIS ด้านล่างแล้วกดปุ่ม SUBMIT ขอให้โชคดี!"
        }
    ],
    en: [
        {
            title: "Welcome, Doctor",
            image: "assets/tutorial/tut1.png",
            text: "Your duty is to perform a Differential Diagnosis based on the patient's symptoms."
        },
        {
            title: "Watch the Patient's HP",
            image: "assets/tutorial/tut2.png",
            text: "Be careful! The <span class='tut-highlight'>Patient Stability (HP) depletes over time</span>. If you take too long, the patient will flatline and it's Game Over."
        },
        {
            title: "Manage Your Budget",
            image: "assets/tutorial/tut3.png",
            text: "Asking questions or ordering lab tests costs <span class='tut-highlight'>money</span>. Manage your budget wisely to achieve an S Rank."
        },
        {
            title: "Diagnosis",
            image: "assets/tutorial/tut4.png",
            text: "Once you are confident, select the disease from the DIAGNOSIS dropdown and click SUBMIT. Good luck!"
        }
    ]
};

const langData = {
    en: { 
        title: "📋 DOCTOR'S BRIEFING", 
        text: `<p><strong>Welcome, Doctor.</strong></p><p>The winter wave is here. Patients are coming in with seasonal illnesses.</p><ul style="text-align:left; list-style:square; margin-left:20px;"><li>Diagnose correctly to save lives.</li><li><strong>Manage your Budget.</strong> Use tools wisely!</li><li><strong>ASK Tool:</strong> Costs more every time you ask (-5, -10, ...).</li></ul>`, 
        cutsceneSpeaker: "Chief Doctor", 
        cutsceneMsg: "Welcome, Doctor. The clinic is packed today. We are counting on your expertise. Don't let us down!", 
        analyzing: "ANALYZING..." 
    },
    th: { 
        title: "📋 ภารกิจของคุณหมอ", 
        text: `<p><strong>ยินดีต้อนรับครับคุณหมอ</strong></p><p>คลื่นความหนาวมาเยือนแล้ว คนไข้หลั่งไหลเข้ามาพร้อมโรคตามฤดูกาล...</p><ul style="text-align:left; list-style:square; margin-left:20px;"><li>วินิจฉัยให้ถูกต้องเพื่อรักษาชีวิตคนไข้</li><li><strong>บริหารงบประมาณให้ดี</strong> โปรดใช้เครื่องมืออย่างคุ้มค่า!</li><li><strong>การซักประวัติ (ASK):</strong> ยิ่งถามเยอะ ราคาจะยิ่งแพงขึ้น (-5, -10, ...)</li></ul>`, 
        cutsceneSpeaker: "ผู้อำนวยการ", 
        cutsceneMsg: "สวัสดีคุณหมอ... วันนี้คนไข้ล้นคลินิกเลยนะ ใช้ความรู้ของคุณช่วยพวกเขาทีล่ะ ฝากด้วยนะ!", 
        analyzing: "กำลังวิเคราะห์ผล..." 
    }
};

const uiTranslations = {
    en: { 
        "ui-start": "OPEN CLINIC", 
        "ui-click-cont": "▼ Click to continue", 
        "ui-case-title": "📂 SELECT PATIENT CASE", 
        "ui-case-easy": "BEGINNER", 
        "ui-case-normal": "INTERMEDIATE", 
        "ui-case-hard": "ADVANCED", 
        "ui-desc-easy": "High budget. Clear symptoms. Good for practice.", 
        "ui-desc-normal": "Complex symptoms. Manage your budget wisely.", 
        "ui-desc-hard": "Very low budget. One mistake and you fail!", 
        "ui-time": "<span class=\"hud-clock-tick\">⏱️</span> TIME:", 
        "ui-sec": "s", 
        "ui-budget": "<span class=\"hud-coin-glint\">🪙</span> BUDGET:", 
        "ui-livefeed": "PATIENT VIEW", 
        "ui-sys-wait": "System: Waiting...", 
        "ui-ask": "🗣️", 
        "ui-temp": "🌡️", 
        "ui-xray": "💀", 
        "ui-blood": "🩸", 
        "ui-hint": "📖", 
        "opt-diag": "-- DIAGNOSIS --", 
        "opt-cold": "Common Cold", 
        "opt-flu": "Influenza (Flu)", 
        "opt-pneu": "Pneumonia", 
        "opt-stroke": "Stroke", 
        "opt-hypo": "Hypothermia", 
        "ui-submit": "SUBMIT", 
        "ui-doc-title": "PATIENT SYMPTOM LOG", 
        "ui-doc-urg": "URGENT", 
        "ui-name": "NAME:", 
        "ui-age": "AGE:", 
        "ui-gender": "GENDER:", 
        "ui-pain": "PAIN (1-10):", 
        "ui-symp": "SYMPTOMS:", 
        "ui-decline": "❌ REJECT", 
        "ui-examine": "✅ ACCEPT CASE", 
        "ui-next": "BACK TO CASE FILES", 
        "ui-board-title": "📄 PATIENT INFO", 
        "ui-board-lab": "🗂️ LAB RESULTS", 
        "ui-board-name": "Name:", 
        "ui-board-age": "Age:", 
        "ui-board-symp": "Symptoms:", 
        "ui-view-xray": "📄 Chest X-Ray", 
        "ui-view-blood": "🔬 View Blood", 
        "ui-view-temp": "🌡️ Thermal Scan", 
        "ui-view-bp": "🩺 Blood Pressure",
        "ui-view-glucose": "🧪 Blood Glucose", 
        "ui-back-case": "🏠 MAIN MENU", 
        "ui-back-feedback": "🏠 MAIN MENU",
        "dossier-stamp-approved": "APPROVED",
        "dossier-stamp-rejected": "REJECTED",
        "ui-occupation": "OCCUPATION:",
        "ui-condition": "MED HISTORY:",
        "ui-allergy": "DRUG ALLERGY:",
        "ui-board-occ": "Occ:",
        "ui-board-cond": "History:",
        "ui-board-allergy": "Allergy:",
        "opt-treat": "-- TREATMENT --",
        "ui-bp": "🩺",
        "ui-glucose": "🧪",
        "opt-hypertension": "Hypertension",
        "opt-diabetes": "Diabetes",
        "ui-consult": "💊",
        "ui-wiki": "🧪"
    },
    th: { 
        "ui-start": "เปิดคลินิกเริ่มงาน", 
        "ui-click-cont": "▼ คลิกเพื่อไปต่อ", 
        "ui-case-title": "📂 เลือกแฟ้มผู้ป่วย", 
        "ui-case-easy": "มือใหม่ (BEGINNER)", 
        "ui-case-normal": "ทั่วไป (INTERMEDIATE)", 
        "ui-case-hard": "เชี่ยวชาญ (ADVANCED)", 
        "ui-desc-easy": "งบเยอะ อาการชัดเจน เหมาะสำหรับหมอมือใหม่", 
        "ui-desc-normal": "อาการซับซ้อนขึ้น ต้องวางแผนการใช้งบให้ดี", 
        "ui-desc-hard": "งบจำกัดสุดๆ ห้ามพลาดแม้แต่ก้าวเดียว!", 
        "ui-time": "<span class=\"hud-clock-tick\">⏱️</span> เวลา:", 
        "ui-sec": " วิ", 
        "ui-budget": "<span class=\"hud-coin-glint\">🪙</span> งบประมาณ:", 
        "ui-livefeed": "ภาพคนไข้", 
        "ui-sys-wait": "ระบบ: กำลังรอคนไข้...", 
        "ui-ask": "🗣️", 
        "ui-temp": "🌡️", 
        "ui-xray": "💀", 
        "ui-blood": "🩸", 
        "ui-hint": "📖", 
        "opt-diag": "-- เลือกโรค --", 
        "opt-cold": "ไข้หวัดทั่วไป (Common Cold)", 
        "opt-flu": "ไข้หวัดใหญ่ (Influenza)", 
        "opt-pneu": "ปอดบวม (Pneumonia)", 
        "opt-stroke": "หลอดเลือดสมอง (Stroke)", 
        "opt-hypo": "อุณหภูมิต่ำ (Hypothermia)", 
        "ui-submit": "วินิจฉัย", 
        "ui-doc-title": "บันทึกอาการผู้ป่วย", 
        "ui-doc-urg": "ด่วนมาก", 
        "ui-name": "ชื่อ:", 
        "ui-age": "อายุ:", 
        "ui-gender": "เพศ:", 
        "ui-pain": "ระดับความเจ็บปวด (1-10):", 
        "ui-symp": "อาการเบื้องต้น:", 
        "ui-decline": "❌ ปฏิเสธเคส", 
        "ui-examine": "✅ รับเคสตรวจ", 
        "ui-next": "กลับไปหน้าเลือกเคส", 
        "ui-board-title": "📄 ข้อมูลคนไข้", 
        "ui-board-lab": "🗂️ ผลตรวจแล็บ", 
        "ui-board-name": "ชื่อ:", 
        "ui-board-age": "อายุ:", 
        "ui-board-symp": "อาการ:", 
        "ui-view-xray": "📄 ดูฟิล์ม X-Ray ปอด", 
        "ui-view-blood": "🔬 ดูผลเลือด", 
        "ui-view-temp": "🌡️ ดูสแกนความร้อน", 
        "ui-view-bp": "🩺 ดูผลความดัน",
        "ui-view-glucose": "🧪 ดูผลน้ำตาล", 
        "ui-back-case": "🏠 กลับหน้าหลัก", 
        "ui-back-feedback": "🏠 กลับหน้าหลัก",
        "dossier-stamp-approved": "ผ่านอนุมัติ",
        "dossier-stamp-rejected": "ปฏิเสธเคส",
        "ui-occupation": "อาชีพ:",
        "ui-condition": "โรคประจำตัว:",
        "ui-allergy": "ประวัติแพ้ยา:",
        "ui-board-occ": "อาชีพ:",
        "ui-board-cond": "โรคประจำตัว:",
        "ui-board-allergy": "ประวัติแพ้ยา:",
        "opt-treat": "-- การรักษา --",
        "ui-bp": "🩺",
        "ui-glucose": "🧪",
        "opt-hypertension": "โรคความดันโลหิตสูง (Hypertension)",
        "opt-diabetes": "โรคเบาหวาน (Diabetes)",
        "ui-consult": "💊",
        "ui-wiki": "🧪"
    }
};

const drugLibraryData = {
    en: [
        { name: "Chlorpheniramine (CPM)", class: "Antihistamine (Sedating)", indication: "Runny nose, allergy symptoms", side: "Severe drowsiness, impaired focus", contra: "Dangerous for operators/drivers (Truck Driver, Crane Operator, Pilot, Construction Worker, Security Guard)" },
        { name: "Loratadine", class: "Antihistamine (Non-Sedating)", indication: "Runny nose, allergy symptoms", side: "Mild dry mouth, headache", contra: "None" },
        { name: "Ibuprofen", class: "NSAID (Pain/Fever Relief)", indication: "High fever, inflammation, muscle aches", side: "GI irritation, renal strain", contra: "Do NOT use if history has Peptic Ulcer, Asthma, or Kidney Disease" },
        { name: "Paracetamol", class: "Analgesic & Antipyretic", indication: "Mild fever, general pain", side: "Liver strain if overdosed", contra: "None" },
        { name: "Amoxicillin", class: "Antibiotic (Penicillin group)", indication: "Bacterial infection (e.g. Bacterial Pneumonia)", side: "Diarrhea, skin rashes", contra: "Do NOT use if patient has Penicillin Allergy" },
        { name: "Azithromycin", class: "Antibiotic (Macrolide group)", indication: "Bacterial infection (Safe for penicillin-allergic patients)", side: "Nausea, stomach cramps", contra: "None" },
        { name: "tPA (Alteplase)", class: "Thrombolytic agent", indication: "Acute ischemic Stroke (dissolves clots)", side: "High risk of bleeding", contra: "Do NOT use if patient has Severe Hypertension (risks fatal brain hemorrhage)" },
        { name: "Aspirin", class: "Antiplatelet / NSAID", indication: "Stroke prevention", side: "GI bleeding, hemolysis", contra: "Do NOT use if history has Peptic Ulcer or G6PD Deficiency" },
        { name: "Warm IV & Rewarming", class: "Physical Rewarming", indication: "Hypothermia (low body temperature)", side: "None", contra: "None" },
        { name: "Amlodipine", class: "Calcium Channel Blocker", indication: "Hypertension (high blood pressure)", side: "Ankle edema, headache", contra: "None" },
        { name: "Enalapril", class: "ACE Inhibitor", indication: "Hypertension (high blood pressure)", side: "Dry cough", contra: "Do NOT use in Pregnant patients (causes fatal fetal harm)" },
        { name: "Metformin", class: "Biguanide (Antidiabetic)", indication: "Diabetes (lowers blood glucose)", side: "GI discomfort", contra: "Do NOT use in patients with Kidney Disease (risks fatal lactic acidosis)" },
        { name: "Insulin", class: "Hormone Injection", indication: "Diabetes (lowers blood glucose)", side: "Hypoglycemia (low blood sugar)", contra: "None" }
    ],
    th: [
        { name: "Chlorpheniramine (CPM)", class: "ยาแก้แพ้ (ชนิดง่วงซึม)", indication: "ลดน้ำมูก แก้แพ้ แก้คัน", side: "ง่วงนอนรุนแรง สูญเสียการทรงตัวและการโฟกัส", contra: "ห้ามใช้ในผู้ปฏิบัติหน้าที่เสี่ยงภัยหรือขับขี่ (คนขับรถบรรทุก, คนคุมเครน, นักบิน, คนงานก่อสร้าง, รปภ.)" },
        { name: "Loratadine", class: "ยาแก้แพ้ (ชนิดไม่ง่วง)", indication: "ลดน้ำมูก แก้แพ้ทั่วไป", side: "ปากแห้ง คอแห้ง ปวดหัวเล็กน้อย", contra: "ไม่มีข้อห้ามเด็ดขาดทั่วไป" },
        { name: "Ibuprofen", class: "ยาแก้ปวดลดการอักเสบ (NSAID)", indication: "ลดไข้สูง ลดอักเสบ ปวดกล้ามเนื้อรุนแรง", side: "ระคายเคืองกระเพาะอาหารอย่างมาก ไตทำงานหนักขึ้น", contra: "ห้ามใช้ในคนไข้มีประวัติแผลในกระเพาะอาหาร (Peptic Ulcer), หอบหืด (Asthma), หรือโรคไต (Kidney Disease)" },
        { name: "Paracetamol", class: "ยาแก้ปวดลดไข้ทั่วไป", indication: "ลดไข้ แก้ปวดทั่วไป", side: "มีพิษต่อตับหากกินเกินขนาดหรือกินติดต่อกันนานเกินไป", contra: "ไม่มีข้อห้ามเด็ดขาดทั่วไป" },
        { name: "Amoxicillin", class: "ยาฆ่าเชื้อ (กลุ่มเพนิซิลลิน)", indication: "ติดเชื้อแบคทีเรีย (เช่น ปอดบวมจากแบคทีเรีย)", side: "ท้องเสีย ท้องเดิน ผื่นคันตามผิวหนัง", contra: "ห้ามใช้เด็ดขาดหากคนไข้มีประวัติแพ้ยาเพนิซิลลิน (Penicillin Allergy) เสี่ยงช็อกรุนแรง" },
        { name: "Azithromycin", class: "ยาฆ่าเชื้อ (กลุ่มแมคโครไลด์)", indication: "ติดเชื้อแบคทีเรีย (ปลอดภัยสำหรับผู้แพ้เพนิซิลลิน)", side: "คลื่นไส้ ปวดท้อง ท้องเสียเล็กน้อย", contra: "ไม่มีข้อห้ามเด็ดขาดทั่วไป" },
        { name: "tPA (Alteplase)", class: "ยาละลายลิ่มเลือด", indication: "หลอดเลือดสมองตีบเฉียบพลัน (ละลายลิ่มเลือดอุดตัน)", side: "เสี่ยงต่อภาวะเลือดออกในอวัยวะสำคัญ", contra: "ห้ามใช้ในผู้ป่วยที่มีภาวะความดันโลหิตสูงรุนแรง (Severe Hypertension) เสี่ยงสมองแตกเสียชีวิต" },
        { name: "Aspirin", class: "ยาต้านเกล็ดเลือด / ยาแก้ปวด", indication: "ป้องกันลิ่มเลือดอุดตันซ้ำซ้อนในโรคสมอง", side: "ระคายกระเพาะอาหาร เสี่ยงต่อเม็ดเลือดแดงแตก", contra: "ห้ามใช้ในคนไข้มีแผลในกระเพาะ (Peptic Ulcer) หรือภาวะพร่องเอนไซม์ G6PD (G6PD Deficiency)" },
        { name: "Warm IV & Rewarming", class: "การกู้คืนอุณหภูมิทางกายภาพ", indication: "ภาวะอุณหภูมิร่างกายต่ำมาก (Hypothermia)", side: "ไม่มี", contra: "ไม่มี" },
        { name: "Amlodipine", class: "ยาลดความดันโลหิตสูง", indication: "ลดความดันโลหิตสูงรุนแรง", side: "ข้อเท้าบวม หน้าแดง เวียนหัว", contra: "ไม่มีข้อห้ามเด็ดขาดทั่วไป" },
        { name: "Enalapril", class: "ยาลดความดันโลหิตสูง (ACE Inhibitor)", indication: "ลดความดันโลหิตสูงทั่วไป", side: "ไอแห้งระคายคอ", contra: "ห้ามใช้ในสตรีมีครรภ์/ตั้งครรภ์ (Pregnancy) เด็ดขาด ทารกอาจพิการหรือเสียชีวิตได้" },
        { name: "Metformin", class: "ยาลดน้ำตาลในเลือด (ชนิดเม็ด)", indication: "โรคเบาหวาน (ลดระดับน้ำตาลในกระแสเลือด)", side: "ไม่สบายท้อง คลื่นไส้ ท้องเสีย", contra: "ห้ามใช้เด็ดขาดในผู้ป่วยโรคไตเสื่อม (Kidney Disease) เสี่ยงต่อเลือดเป็นกรดเฉียบพลันอันตรายถึงชีวิต" },
        { name: "Insulin", class: "ฮอร์โมนอินซูลินชนิดฉีด", indication: "โรคเบาหวาน (ลดน้ำตาลในเลือดอย่างรวดเร็ว)", side: "เสี่ยงต่อภาวะน้ำตาลในเลือดต่ำเกินไป (Hypoglycemia)", contra: "ไม่มีข้อห้ามเด็ดขาดทั่วไป" }
    ]
};

const medRefsData = {
    en: [
        {
            title: "1. Common Cold & Influenza (Seasonal Viruses)",
            source: "Harrison's Principles of Internal Medicine, 21st Edition",
            guideline: "Chapter on Influenza and Respiratory Viruses. For patients in high-risk professions, sedating antihistamines (CPM) are contraindicated due to psychomotor impairment.",
            detail: "Alternative: Loratadine (non-sedating)."
        },
        {
            title: "2. Community-Acquired Pneumonia (CAP)",
            source: "IDSA/ATS Consensus Guidelines on the Management of Community-Acquired Pneumonia",
            guideline: "Amoxicillin is standard first-line beta-lactam. strictly contraindicated in Penicillin Allergy due to anaphylaxis risk.",
            detail: "Alternative: Azithromycin (macrolide)."
        },
        {
            title: "3. Acute Ischemic Stroke Management",
            source: "AHA/ASA Early Stroke Management Guidelines / Thai Neurological Society",
            guideline: "tPA (Alteplase) thrombolytic therapy must not be administered if blood pressure is severe (>185/110 mmHg) due to high risk of symptomatic intracranial hemorrhage. Aspirin (antiplatelet) is contraindicated in Peptic Ulcer or G6PD Deficiency (due to hemolysis risk).",
            detail: "BP must be lowered below 185/110 mmHg before tPA administration."
        },
        {
            title: "4. Hypertension Guidelines",
            source: "ACC/AHA Hypertension Guidelines / Thai Hypertension Society",
            guideline: "ACE Inhibitors (Enalapril) are strictly contraindicated in Pregnant patients due to severe risk of fetal RAAS blockade causing renal dysgenesis and miscarriage.",
            detail: "Alternative: Amlodipine (Calcium Channel Blocker) is safe."
        },
        {
            title: "5. Diabetes Mellitus (NCD Control)",
            source: "ADA Standards of Care in Diabetes / Thai Diabetes Association",
            guideline: "Metformin (Biguanide) must be discontinued or contraindicated in patients with severe Kidney Disease (eGFR < 30 mL/min) to prevent Metformin-Associated Lactic Acidosis (MALA), which has high mortality.",
            detail: "Alternative: Insulin therapy is safe in renal impairment."
        },
        {
            title: "6. Accidental Hypothermia Treatment",
            source: "Wilderness Medical Society (WMS) Practice Guidelines for Accidental Hypothermia",
            guideline: "Moderate to severe hypothermia requires active rewarming. Physical rewarming and administration of Warm IV Fluids (rewarmed to 38-42°C) is indicated.",
            detail: "Rewarm core before extremities to prevent 'afterdrop'."
        }
    ],
    th: [
        {
            title: "1. ไข้หวัดธรรมดาและไข้หวัดใหญ่ (โรคติดเชื้อไวรัสตามฤดูกาล)",
            source: "แนวทางการรักษาโรคไข้หวัดใหญ่และโรคติดเชื้อทางเดินหายใจเฉียบพลัน กรมควบคุมโรค กระทรวงสาธารณสุข / Harrison's Principles of Internal Medicine",
            guideline: "ยาแก้แพ้กลุ่มง่วงซึม (CPM) มีข้อห้ามใช้ขณะปฏิบัติงานเสี่ยงภัยหรือขับขี่ ยานพาหนะเนื่องจากผ่านแนวแผงกั้นเลือดสมอง (BBB) ไปยับยั้งระบบประสาทส่วนกลาง",
            detail: "ทางเลือก: ควรจ่ายยา Loratadine ซึ่งเป็นกลุ่มที่ไม่ผ่านสมอง (Non-sedating antihistamine)"
        },
        {
            title: "2. โรคปอดอักเสบชุมชน (Community-Acquired Pneumonia)",
            source: "แนวทางการรักษาโรคปอดอักเสบ สมาคมอุรเวชช์แห่งประเทศไทย ในพระบรมราชูปถัมภ์ / IDSA ATS Guidelines",
            guideline: "ยา Amoxicillin เป็นยาฆ่าเชื้อกลุ่มเพนิซิลลิน ห้ามใช้ในผู้ป่วยที่มีประวัติแพ้ยาเพนิซิลลินเด็ดขาดเนื่องจากเสี่ยงต่อภาวะช็อกจากการแพ้รุนแรง (Anaphylactic Shock)",
            detail: "ทางเลือก: เลี่ยงไปใช้ยา Azithromycin กลุ่มแมคโครไลด์ (Macrolide) แทน"
        },
        {
            title: "3. โรคหลอดเลือดสมองตีบเฉียบพลัน (Acute Ischemic Stroke)",
            source: "แนวทางการรักษาโรคหลอดเลือดสมองตีบเฉียบพลัน สถาบันประสาทวิทยา กรมการแพทย์ / AHA ASA Stroke Guidelines",
            guideline: "การให้ยาละลายลิ่มเลือด tPA มีข้อห้ามใช้เด็ดขาดหากผู้ป่วยมีความดันโลหิตสูงรุนแรง (Systolic > 185 หรือ Diastolic > 110 mmHg) เนื่องจากผนังหลอดเลือดสมองเปราะบางและเสี่ยงเกิดเลือดออกในสมองแตกถึงชีวิต (ICH) และยา Aspirin ห้ามใช้ในโรคแผลในกระเพาะอาหาร (เสี่ยงเลือดออกทางเดินอาหารรุนแรง) และภาวะพร่อง G6PD (เสี่ยงเม็ดเลือดแดงแตกเฉียบพลัน)",
            detail: "การแก้ไข: ต้องควบคุมระดับความดันโลหิตให้ต่ำกว่า 185/110 mmHg ก่อนพิจารณาให้ tPA"
        },
        {
            title: "4. โรคความดันโลหิตสูง (Hypertension)",
            source: "แนวทางการรักษาโรคความดันโลหิตสูง สมาคมความดันโลหิตสูงแห่งประเทศไทย / ACC AHA Guidelines",
            guideline: "ยา Enalapril (กลุ่ม ACE Inhibitor) ห้ามใช้ในสตรีมีครรภ์/ตั้งครรภ์เด็ดขาดทุกไตรมาส เนื่องจากขัดขวางระบบ RAAS ของตัวอ่อนในครรภ์ ทำให้ไตทารกไม่พัฒนา (Renal Dysgenesis) และน้ำคร่ำน้อยลง",
            detail: "ทางเลือก: ใช้ยา Amlodipine (กลุ่ม Calcium Channel Blocker) แทนซึ่งปลอดภัยในการตั้งครรภ์"
        },
        {
            title: "5. โรคเบาหวาน (Diabetes Mellitus)",
            source: "แนวทางเวชปฏิบัติสำหรับโรคเบาหวาน สมาคมโรคเบาหวานแห่งประเทศไทยฯ / ADA Standards of Care",
            guideline: "ยา Metformin ห้ามใช้ในผู้ป่วยโรคไตเสื่อมรุนแรง (eGFR < 30 ml/min) เนื่องจากยาขับออกทางไต หากคั่งจะทำให้เกิดภาวะเลือดเป็นกรดเฉียบพลัน (Metformin-associated Lactic Acidosis - MALA)",
            detail: "ทางเลือก: เลี่ยงมาใช้ฮอร์โมนอินซูลิน (Insulin) ฉีดทดแทน ซึ่งปลอดภัยสำหรับผู้ป่วยไตเสื่อม"
        },
        {
            title: "6. ภาวะอุณหภูมิร่างกายต่ำมาก (Hypothermia)",
            source: "แนวทางการปฐมพยาบาลและการรักษา Accidental Hypothermia, Wilderness Medical Society",
            guideline: "การกู้คืนอุณหภูมิในระดับปานกลางถึงรุนแรง ต้องใช้สารน้ำอุ่นทางหลอดเลือดดำ (Warm IV Fluids 38-42°C) และการให้ความร้อนภายนอกแบบ Active เพื่อกู้คืนอุณหภูมิแกนกลาง (Core Temperature)",
            detail: "ข้อควรระวัง: หลีกเลี่ยงการนวดหรือขยับตัวรุนแรงเพราะอาจกระตุ้นหัวใจห้องล่างสั่นระริก (VF) จนหัวใจหยุดเต้น"
        }
    ]
};

let unlockedAchievements = JSON.parse(localStorage.getItem('clinic_achievements')) || { 
    speedster: false, 
    eagleEye: false, 
    legendary: false,
    ncdExpert: false,
    pharmacist: false
};

function saveAchievements() { 
    localStorage.setItem('clinic_achievements', JSON.stringify(unlockedAchievements)); 
}

function showAchievementToast(descTH, descEN) {
    playSound(sfxClick); 
    achDescText.innerText = isThai ? descTH : descEN;
    achievementToast.classList.remove('hidden'); 
    
    setTimeout(() => {
        achievementToast.classList.add('show');
    }, 100);
    
    setTimeout(() => { 
        achievementToast.classList.remove('show'); 
        setTimeout(() => {
            achievementToast.classList.add('hidden');
        }, 500); 
    }, 4000);
}

function logToScreen(type, msg) {
    const line = document.createElement('div'); 
    line.className = `log-line ${type}`;
    let prefix = ""; 
    
    if (type === "doctor") {
        prefix = isThai ? "เครื่องมือ: " : "Tool: "; 
    } else if (type === "patient") {
        prefix = isThai ? "คนไข้: " : "Patient: ";
    }
    
    line.innerText = prefix + msg; 
    doctorLog.appendChild(line); 
    doctorLog.scrollTop = doctorLog.scrollHeight;
}

function showChiefWarning(msgTH, msgEN) {
    playSound(sfxFail); 
    chiefWarningTitle.innerText = isThai ? "ผู้อำนวยการ:" : "CHIEF DOCTOR:";
    chiefWarningText.innerText = isThai ? msgTH : msgEN;
    
    chiefWarningToast.classList.remove('hidden');
    setTimeout(() => {
        chiefWarningToast.classList.add('show');
    }, 100);
    
    setTimeout(() => { 
        chiefWarningToast.classList.remove('show'); 
        setTimeout(() => {
            chiefWarningToast.classList.add('hidden');
        }, 500); 
    }, 4000);
    
    logToScreen('system', isThai ? `⚠️ ผอ.: ${msgTH}` : `⚠️ CHIEF: ${msgEN}`);
}

function renderAchievementsList() {
    achievementsList.innerHTML = "";
    const list = [
        { id: 'speedster', icon: '⚡', th: 'หมอสายฟ้าแลบ (วินิจฉัยถูกใน 15 วิ)', en: 'Speedster (Correct under 15s)' },
        { id: 'eagleEye', icon: '💰', th: 'หมอตาเพชร (ไม่ใช้เครื่องมือแล็บเลย)', en: 'Eagle Eye (No lab tools used)' },
        { id: 'legendary', icon: '👑', th: 'ระดับตำนาน (คว้าแรงค์ S สำเร็จ)', en: 'Legendary (Achieved S Rank)' },
        { id: 'ncdExpert', icon: '🩺', th: 'ผู้เชี่ยวชาญ NCDs (รักษาโรคเรื้อรังสำเร็จ)', en: 'NCD Expert (Treated chronic diseases)' },
        { id: 'pharmacist', icon: '💊', th: 'เภสัชกรระมัดระวัง (รักษาคนไข้กลุ่มเสี่ยงได้ปลอดภัย)', en: 'Careful Pharmacist (Safely treated a high-risk patient)' }
    ];
    
    list.forEach(item => {
        const isUnlocked = unlockedAchievements[item.id]; 
        const text = isThai ? item.th : item.en; 
        const li = document.createElement('li');
        
        if (isUnlocked) { 
            li.innerHTML = `<span style="color:#2e7d32;">✅ ${item.icon} ${text}</span>`; 
        } else { 
            li.innerHTML = `<span class="ach-locked">🔒 ❓❓❓ (ยังไม่ปลดล็อก)</span>`; 
        }
        
        achievementsList.appendChild(li);
    });
}

function renderTutorialStep() {
    const lang = isThai ? 'th' : 'en';
    const data = tutorialData[lang][currentTutStep];
    
    if(tutTitle) tutTitle.innerText = data.title;
    if(tutText) tutText.innerHTML = data.text;
    
    if(tutImage) {
        if (data.image) {
            tutImage.src = data.image;
            tutImage.style.display = "block";
        } else {
            tutImage.style.display = "none";
        }
    }
    
    if(tutDotsContainer) {
        tutDotsContainer.innerHTML = '';
        for (let i = 0; i < tutorialData[lang].length; i++) {
            const dot = document.createElement('div');
            dot.className = 'tut-dot';
            if (i === currentTutStep) {
                dot.classList.add('active');
            }
            tutDotsContainer.appendChild(dot);
        }
    }
    
    const nextText = document.getElementById('ui-tut-next');
    const skipText = document.getElementById('ui-tut-skip');
    
    if (skipText) skipText.innerText = isThai ? "SKIP (ข้าม)" : "SKIP";

    if (currentTutStep === tutorialData[lang].length - 1) {
        if (nextText) nextText.innerText = isThai ? "LET'S PLAY (เริ่มเลย)" : "LET'S PLAY";
        if (btnTutNext) {
            btnTutNext.style.backgroundColor = "#ff9800";
            btnTutNext.style.borderColor = "#e65100";
        }
    } else {
        if (nextText) nextText.innerText = isThai ? "NEXT (ถัดไป) >" : "NEXT >";
        if (btnTutNext) {
            btnTutNext.style.backgroundColor = ""; 
            btnTutNext.style.borderColor = "";
        }
    }
}

btnShowAchievements.onclick = () => { 
    playSound(sfxClick); 
    renderAchievementsList(); 
    achievementsModal.classList.remove('hidden'); 
};

btnCloseAchievements.onclick = () => { 
    playSound(sfxClick); 
    achievementsModal.classList.add('hidden'); 
};

function renderDrugLibrary() {
    drugLibraryContent.innerHTML = "";
    const list = isThai ? drugLibraryData.th : drugLibraryData.en;
    
    list.forEach(drug => {
        const drugDiv = document.createElement('div');
        drugDiv.style.marginBottom = "15px";
        drugDiv.style.padding = "10px";
        drugDiv.style.background = "#efebe9";
        drugDiv.style.border = "3px solid #8d6e63";
        drugDiv.style.borderRadius = "6px";
        
        drugDiv.innerHTML = `
            <div style="font-size: 1.5rem; font-weight: bold; color: #00796b; margin-bottom: 5px;">💊 ${drug.name}</div>
            <div style="font-size: 1.1rem; color: #5d4037; font-style: italic; margin-bottom: 5px;">(${drug.class})</div>
            <div style="margin-bottom: 4px;"><strong>${isThai ? "สรรพคุณ:" : "Indication:"}</strong> ${drug.indication}</div>
            <div style="margin-bottom: 4px;"><strong>${isThai ? "ผลข้างเคียง:" : "Side Effects:"}</strong> ${drug.side}</div>
            <div style="color: #c62828;"><strong>${isThai ? "❌ ข้อห้ามใช้:" : "❌ Contraindications:"}</strong> ${drug.contra}</div>
        `;
        drugLibraryContent.appendChild(drugDiv);
    });
}

function openDrugLibrary() {
    playSound(sfxClick);
    renderDrugLibrary();
    document.getElementById('wiki-title').innerText = isThai ? "📖 คลังข้อมูลยา (DRUG LIBRARY)" : "📖 DRUG LIBRARY";
    btnCloseDrugLibrary.innerText = isThai ? "ปิด" : "CLOSE";
    drugLibraryModal.classList.remove('hidden');
}

btnInGameWiki.onclick = openDrugLibrary;
btnCloseDrugLibrary.onclick = () => {
    playSound(sfxClick);
    drugLibraryModal.classList.add('hidden');
};

function renderMedReferences() {
    medRefsContent.innerHTML = "";
    const list = isThai ? medRefsData.th : medRefsData.en;
    
    list.forEach(ref => {
        const refDiv = document.createElement('div');
        refDiv.style.marginBottom = "15px";
        refDiv.style.padding = "10px";
        refDiv.style.background = "#e8f5e9";
        refDiv.style.border = "3px solid #4caf50";
        refDiv.style.borderRadius = "6px";
        
        refDiv.innerHTML = `
            <div style="font-size: 1.45rem; font-weight: bold; color: #2e7d32; margin-bottom: 5px;">${ref.title}</div>
            <div style="font-size: 1.15rem; color: #1b5e20; font-style: italic; margin-bottom: 5px;"><strong>${isThai ? "แหล่งอ้างอิง:" : "Source:"}</strong> ${ref.source}</div>
            <div style="margin-bottom: 4px; font-size: 1.25rem;"><strong>${isThai ? "เกณฑ์ / ตรรกะ:" : "Criteria / Logic:"}</strong> ${ref.guideline}</div>
            <div style="color: #e65100; font-size: 1.25rem;"><strong>${isThai ? "💡 คำแนะนำเพิ่มเติม:" : "💡 Clinical Note:"}</strong> ${ref.detail}</div>
        `;
        medRefsContent.appendChild(refDiv);
    });
}

function openMedReferences() {
    playSound(sfxClick);
    renderMedReferences();
    document.getElementById('refs-title').innerText = isThai ? "📚 แหล่งอ้างอิงทางการแพทย์ (REFERENCES)" : "📚 MEDICAL REFERENCES";
    btnCloseMedRefs.innerText = isThai ? "ปิด" : "CLOSE";
    medRefsModal.classList.remove('hidden');
}

if (btnMedRefs) btnMedRefs.onclick = openMedReferences;
if (btnCloseMedRefs) {
    btnCloseMedRefs.onclick = () => {
        playSound(sfxClick);
        medRefsModal.classList.add('hidden');
    };
}

function playSound(audioEl) { 
    if(audioEl) { 
        audioEl.currentTime = 0; 
        audioEl.play().catch(() => {}); 
    } 
}

function renderFeedbackScreen() {
    const title = document.getElementById('fb-title');
    const content = document.getElementById('fb-content');
    
    let timeComment = "";
    let budgetComment = ""; 
    let styleClass = lastResult.isCorrect ? "text-success" : "text-danger";

    if (lastResult.time <= 20) {
        timeComment = isThai ? "⚡ ความเร็ว: รวดเร็วมาก" : "⚡ Speed: Very Fast"; 
    } else if (lastResult.time <= 45) {
        timeComment = isThai ? "⏱️ ความเร็ว: ปานกลาง" : "⏱️ Speed: Average"; 
    } else {
        timeComment = isThai ? "🐢 ความเร็ว: ช้าเกินไป" : "🐢 Speed: Too Slow";
    }
    
    if (lastResult.coins >= 35) {
        budgetComment = isThai ? "💰 งบประมาณ: ประหยัดมาก" : "💰 Budget: Very Frugal"; 
    } else if (lastResult.coins >= 15) {
        budgetComment = isThai ? "💸 งบประมาณ: สมเหตุสมผล" : "💸 Budget: Reasonable"; 
    } else {
        budgetComment = isThai ? "📉 งบประมาณ: ใช้จ่ายเกินตัว" : "📉 Budget: Overspent";
    }

    if (lastResult.isCorrect) {
        title.innerText = isThai ? "ภารกิจสำเร็จ" : "MISSION SUCCESS"; 
        title.style.color = "#2e7d32";
    } else {
        title.innerText = isThai ? "ภารกิจล้มเหลว" : "MISSION FAILED"; 
        title.style.color = "#c62828";
        timeComment = isThai ? "⚠️ การรักษาวิกฤต / ผิดพลาด" : "⚠️ Critical Treatment / Diagnostic Error"; 
        budgetComment = isThai ? lastResult.messageTH : lastResult.messageEN;
    }

    const diseaseTranslate = { 
        "Common Cold": isThai ? "ไข้หวัดธรรมดา" : "Common Cold", 
        "Influenza": isThai ? "ไข้หวัดใหญ่" : "Influenza (Flu)", 
        "Pneumonia": isThai ? "ปอดบวม" : "Pneumonia", 
        "Stroke": isThai ? "หลอดเลือดสมองตีบ" : "Stroke", 
        "Hypothermia": isThai ? "ภาวะอุณหภูมิร่างกายต่ำ" : "Hypothermia",
        "Hypertension": isThai ? "โรคความดันโลหิตสูง" : "Hypertension",
        "Diabetes": isThai ? "โรคเบาหวาน" : "Diabetes"
    };
    
    let realDiseaseTranslated = diseaseTranslate[currentPatient.realDiseaseName] || currentPatient.realDiseaseName;
    
    let gradeTranslated = lastResult.grade;
    if (lastResult.grade === "Malpractice") {
        gradeTranslated = isThai ? "F (โดนยึดใบประกอบอาชีพแพทย์)" : "F (Malpractice / License Revoked)";
    } else if (lastResult.grade === "Wrong Diagnosis") {
        gradeTranslated = isThai ? "F (วินิจฉัยโรคผิดพลาด)" : "F (Wrong Diagnosis)";
    } else {
        gradeTranslated = isThai 
            ? lastResult.grade.replace('Legendary','ระดับตำนาน').replace('Professional','มืออาชีพ').replace('Good','ดี').replace('Passable','พอใช้') 
            : lastResult.grade;
    }

    content.innerHTML = `
        <div class="report-card">
            <div class="report-row">
                <span class="report-label">${isThai ? "คำวินิจฉัย:" : "Diagnosis:"}</span>
                <span class="report-value ${styleClass}">${lastResult.isCorrect ? (isThai ? "✅ ถูกต้อง" : "✅ CORRECT") : (isThai ? "❌ ผิดพลาด" : "❌ WRONG")}</span>
            </div>
            <div class="report-row">
                <span class="report-label">${isThai ? "โรคที่คนไข้เป็น:" : "Patient Had:"}</span>
                <span class="report-value">${realDiseaseTranslated}</span>
            </div>
            <hr class="pixel-divider">
            <div class="stats-grid">
                <div class="stat-box">
                    <span class="stat-icon">⏱️</span>
                    <span>${lastResult.time}${isThai ? " วิ" : "s"}</span>
                </div>
                <div class="stat-box">
                    <span class="stat-icon">🪙</span>
                    <span>${isThai ? "เหลือ " : ""}${lastResult.coins}${isThai ? "" : " left"}</span>
                </div>
                <div class="stat-box grade-box">
                    <span class="stat-icon">🎓</span>
                    <span style="font-size: 1.1rem;">${isThai ? "ระดับ:" : "Rank:"} <br>${gradeTranslated}</span>
                </div>
            </div>
            <div class="analysis-box">
                <p><strong>📝 ${isThai ? "สรุปผลงาน:" : "PERFORMANCE:"}</strong></p>
                <ul>
                    <li>${timeComment}</li>
                    <li>${budgetComment}</li>
                </ul>
            </div>
            ${!lastResult.isCorrect ? `<p class="hint-text">💡 ${isThai ? "คำแนะนำ:" : "Tip:"} "${getHint(currentPatient.realDiseaseName)}"</p>` : ""}
        </div>
    `;
}

function updateMedicationWarnings(selectedDrug) {
    const occRow = document.getElementById('ui-board-occ')?.parentElement || document.getElementById('b-occ')?.parentElement;
    const condRow = document.getElementById('ui-board-cond')?.parentElement || document.getElementById('b-cond')?.parentElement;
    const allergyRow = document.getElementById('ui-board-allergy')?.parentElement || document.getElementById('b-allergy')?.parentElement;

    const pOccVal = document.getElementById('p-occupation');
    const pCondVal = document.getElementById('p-condition');
    const pAllergyVal = document.getElementById('p-allergy');

    const bOccVal = document.getElementById('b-occ');
    const bCondVal = document.getElementById('b-cond');
    const bAllergyVal = document.getElementById('b-allergy');

    // Reset warnings
    [occRow, condRow, allergyRow, pOccVal, pCondVal, pAllergyVal, bOccVal, bCondVal, bAllergyVal].forEach(el => {
        el?.classList.remove('warning-glow');
    });

    if (!selectedDrug || !currentPatient) return;

    // Check Occupation Sensitivity
    const drowsySensitive = ["Truck Driver", "Construction Worker", "Pilot", "Crane Operator", "Security Guard"].includes(currentPatient.occupationEN);
    if (selectedDrug === "Chlorpheniramine" && drowsySensitive) {
        occRow?.classList.add('warning-glow');
        pOccVal?.classList.add('warning-glow');
        bOccVal?.classList.add('warning-glow');
    }

    // Check Penicillin Allergy
    const penicillinAllergic = currentPatient.allergyEN === "Penicillin Allergy";
    if (selectedDrug === "Amoxicillin" && penicillinAllergic) {
        allergyRow?.classList.add('warning-glow');
        pAllergyVal?.classList.add('warning-glow');
        bAllergyVal?.classList.add('warning-glow');
    }

    // Check Medical History / Contraindications
    const hasUlcer = currentPatient.conditionEN === "Peptic Ulcer";
    const hasAsthma = currentPatient.conditionEN === "Asthma";
    const hasKidney = currentPatient.conditionEN === "Kidney Disease";
    const hasSevereHT = currentPatient.conditionEN === "Severe Hypertension";
    const hasG6PD = currentPatient.conditionEN === "G6PD Deficiency";
    const hasPregnancy = currentPatient.conditionEN === "Pregnancy";

    let condUnsafe = false;
    if (selectedDrug === "Ibuprofen" && (hasUlcer || hasAsthma || hasKidney)) condUnsafe = true;
    if (selectedDrug === "tPA" && hasSevereHT) condUnsafe = true;
    if (selectedDrug === "Aspirin" && (hasG6PD || hasUlcer)) condUnsafe = true;
    if (selectedDrug === "Enalapril" && hasPregnancy) condUnsafe = true;
    if (selectedDrug === "Metformin" && hasKidney) condUnsafe = true;

    if (condUnsafe) {
        condRow?.classList.add('warning-glow');
        pCondVal?.classList.add('warning-glow');
        bCondVal?.classList.add('warning-glow');
    }
}

document.getElementById('treatment-input').onchange = (e) => {
    updateMedicationWarnings(e.target.value);
};

btnConsult.onclick = () => {
    playSound(sfxClick);
    const treat = document.getElementById('treatment-input').value;
    if (!treat) {
        const errorMsg = isThai ? "❌ เภสัชกร: กรุณาเลือกยาก่อนปรึกษาครับ!" : "❌ Pharmacist: Please select a medication first!";
        logToScreen("system", errorMsg);
        return;
    }

    if (coins < 10) {
        const coinError = isThai ? "❌ เงินไม่พอสำหรับการปรึกษาเภสัชกร (ต้องการ 10 🪙)" : "❌ Insufficient coins to consult pharmacist (10 🪙 required)";
        logToScreen("system", coinError);
        return;
    }

    coins -= 10;
    updateHUD();

    // Trigger board warnings animation
    updateMedicationWarnings(treat);

    // Pharmacist advice logic
    let hasAlert = false;
    let adviceTH = "";
    let adviceEN = "";

    // 1. Occupation Check
    const drowsySensitive = ["Truck Driver", "Construction Worker", "Pilot", "Crane Operator", "Security Guard"].includes(currentPatient.occupationEN);
    if (treat === "Chlorpheniramine" && drowsySensitive) {
        hasAlert = true;
        adviceTH = `❌ เภสัชกร: คนไข้ทำงานเป็น "${currentPatient.occupationTH}" ยา CPM ทำให้ง่วงนอนหนักมาก ห้ามใช้เด็ดขาด!`;
        adviceEN = `❌ Pharmacist: Patient is a "${currentPatient.occupationEN}". CPM causes severe drowsiness and is unsafe!`;
    }

    // 2. Allergy Check
    const penicillinAllergic = currentPatient.allergyEN === "Penicillin Allergy";
    if (treat === "Amoxicillin" && penicillinAllergic) {
        hasAlert = true;
        adviceTH = `❌ เภสัชกร: คนไข้มีประวัติ "${currentPatient.allergyTH}" ยา Amoxicillin จัดเป็นกลุ่มเพนิซิลลิน ห้ามใช้เด็ดขาด!`;
        adviceEN = `❌ Pharmacist: Patient has "${currentPatient.allergyEN}". Amoxicillin is Penicillin and contraindicated!`;
    }

    // 3. Condition Check
    const hasUlcer = currentPatient.conditionEN === "Peptic Ulcer";
    const hasAsthma = currentPatient.conditionEN === "Asthma";
    const hasKidney = currentPatient.conditionEN === "Kidney Disease";
    const hasSevereHT = currentPatient.conditionEN === "Severe Hypertension";
    const hasG6PD = currentPatient.conditionEN === "G6PD Deficiency";
    const hasPregnancy = currentPatient.conditionEN === "Pregnancy";

    if (treat === "Ibuprofen") {
        if (hasUlcer) {
            hasAlert = true;
            adviceTH = "❌ เภสัชกร: คนไข้เป็นโรคแผลในกระเพาะ ยา Ibuprofen อาจระคายเคืองจนกระเพาะทะลุได้!";
            adviceEN = "❌ Pharmacist: Patient has Peptic Ulcer. Ibuprofen risks severe stomach irritation/perforation!";
        } else if (hasAsthma) {
            hasAlert = true;
            adviceTH = "❌ เภสัชกร: คนไข้เป็นหอบหืด ยา Ibuprofen อาจกระตุ้นให้หลอดเกร็งตัวเฉียบพลัน!";
            adviceEN = "❌ Pharmacist: Patient has Asthma. Ibuprofen can trigger acute bronchospasms!";
        } else if (hasKidney) {
            hasAlert = true;
            adviceTH = "❌ เภสัชกร: คนไข้เป็นโรคไต ยา Ibuprofen ส่งผลต่อไตเสื่อมเฉียบพลัน!";
            adviceEN = "❌ Pharmacist: Patient has Kidney Disease. Ibuprofen can trigger acute renal failure!";
        }
    } else if (treat === "tPA" && hasSevereHT) {
        hasAlert = true;
        adviceTH = "❌ เภสัชกร: คนไข้มีความดันสูงรุนแรง การให้ยา tPA เสี่ยงต่อเลือดออกในสมองแตกถึงชีวิต!";
        adviceEN = "❌ Pharmacist: Severe Hypertension. Giving tPA risks fatal cerebral hemorrhage!";
    } else if (treat === "Aspirin") {
        if (hasG6PD) {
            hasAlert = true;
            adviceTH = "❌ เภสัชกร: คนไข้มีภาวะพร่อง G6PD ยา Aspirin กระตุ้นให้เกิดเม็ดเลือดแดงแตกเฉียบพลัน!";
            adviceEN = "❌ Pharmacist: G6PD Deficiency. Aspirin risks severe acute hemolysis!";
        } else if (hasUlcer) {
            hasAlert = true;
            adviceTH = "❌ เภสัชกร: คนไข้มีแผลในกระเพาะอาหาร ยา Aspirin เพิ่มความเสี่ยงเลือดออกรุนแรง!";
            adviceEN = "❌ Pharmacist: Peptic Ulcer. Aspirin risks massive gastrointestinal bleeding!";
        }
    } else if (treat === "Enalapril" && hasPregnancy) {
        hasAlert = true;
        adviceTH = "❌ เภสัชกร: คนไข้ตั้งครรภ์ ยา Enalapril ห้ามใช้เด็ดขาดเพราะทำให้ทารกในครรภ์พิการหรือแท้ง!";
        adviceEN = "❌ Pharmacist: Pregnant patient. Enalapril is strictly contraindicated due to fetal toxicity!";
    } else if (treat === "Metformin" && hasKidney) {
        hasAlert = true;
        adviceTH = "❌ เภสัชกร: คนไข้เป็นโรคไตเสื่อม ยา Metformin ห้ามใช้เด็ดขาดเพราะเสี่ยงต่อภาวะกรดแลกติกคั่งเฉียบพลัน!";
        adviceEN = "❌ Pharmacist: Kidney Disease. Metformin is contraindicated due to fatal lactic acidosis risk!";
    }

    if (hasAlert) {
        playSound(sfxFail);
        logToScreen("system", isThai ? adviceTH : adviceEN);
    } else {
        playSound(sfxSuccess);
        const safeMsg = isThai 
            ? "✅ เภสัชกร: ยานี้ดูเหมาะสมและปลอดภัยดี ไม่มีปัญหากับประวัติคนไข้รายนี้ครับ" 
            : "✅ Pharmacist: This medication seems safe. No conflicts detected with patient's record.";
        logToScreen("system", safeMsg);
    }
};

function applyLanguage() {
    const lang = isThai ? langData.th : langData.en;
    
    if(introTitle) introTitle.innerText = lang.title;
    if(introText) introText.innerHTML = lang.text;
    if(speakerName) speakerName.innerText = lang.cutsceneSpeaker;
    if(document.getElementById('loading-text')) document.getElementById('loading-text').innerText = lang.analyzing;

    const uiTexts = isThai ? uiTranslations.th : uiTranslations.en;
    
    for(const id in uiTexts) { 
        const el = document.getElementById(id); 
        if(el) el.innerHTML = uiTexts[id]; 
    }

    if (btnStartGame) btnStartGame.innerText = isThai ? "เริ่มเกม" : "START GAME";
    if (btnHowToPlay) btnHowToPlay.innerText = isThai ? "❓ วิธีเล่น" : "❓ HOW TO PLAY";
    if (btnShowAchievements) btnShowAchievements.innerText = isThai ? "🏆 ความสำเร็จ" : "🏆 ACHIEVEMENTS";
    if (btnMedRefs) btnMedRefs.innerText = isThai ? "📚 แหล่งอ้างอิง" : "📚 REFERENCES";

    const achievementsTitleEl = document.querySelector('#achievements-modal h2');
    if (achievementsTitleEl) achievementsTitleEl.innerText = isThai ? "🏆 ห้องเกียรติยศ 🏆" : "🏆 HALL OF FAME 🏆";
    if (btnCloseAchievements) btnCloseAchievements.innerText = isThai ? "ปิด" : "CLOSE";

    const achToastTitleEl = achievementToast ? achievementToast.querySelector('.ach-title') : null;
    if (achToastTitleEl) achToastTitleEl.innerText = isThai ? "ปลดล็อกความสำเร็จ!" : "ACHIEVEMENT UNLOCKED!";
    if (chiefWarningTitle) chiefWarningTitle.innerText = isThai ? "ผู้อำนวยการ:" : "CHIEF DOCTOR:";
    if (imageResultTitle) imageResultTitle.innerText = isThai ? "ผลตรวจ" : "RESULT";
    if (btnCloseImageActual) btnCloseImageActual.innerText = isThai ? "ปิด" : "CLOSE";
    
    if (tutorialModal && !tutorialModal.classList.contains('hidden')) {
        renderTutorialStep();
    }

    // Dynamic Select Option Translation with Risk Warning Tags
    const treatSelect = document.getElementById('treatment-input');
    if (treatSelect) {
        const currentSelectedVal = treatSelect.value;
        treatSelect.innerHTML = "";

        const optEmpty = document.createElement('option');
        optEmpty.value = "";
        optEmpty.innerText = isThai ? "-- การรักษา --" : "-- TREATMENT --";
        treatSelect.appendChild(optEmpty);

        const options = [
            { val: "Chlorpheniramine", th: "Chlorpheniramine (CPM)", en: "Chlorpheniramine (CPM)" },
            { val: "Loratadine", th: "Loratadine", en: "Loratadine" },
            { val: "Ibuprofen", th: "Ibuprofen", en: "Ibuprofen" },
            { val: "Paracetamol", th: "Paracetamol", en: "Paracetamol" },
            { val: "Amoxicillin", th: "Amoxicillin", en: "Amoxicillin" },
            { val: "Azithromycin", th: "Azithromycin", en: "Azithromycin" },
            { val: "tPA", th: "tPA (Alteplase)", en: "tPA (Alteplase)" },
            { val: "Aspirin", th: "Aspirin", en: "Aspirin" },
            { val: "Warm IV Fluids", th: "น้ำเกลืออุ่น & ห่มผ้าอุ่น", en: "Warm IV & Rewarming" }
        ];

        options.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o.val;
            opt.innerText = isThai ? o.th : o.en;
            treatSelect.appendChild(opt);
        });

        const divider = document.createElement('option');
        divider.disabled = true;
        divider.innerText = "──────────";
        treatSelect.appendChild(divider);

        const ncdOptions = [
            { val: "Amlodipine", th: "Amlodipine", en: "Amlodipine" },
            { val: "Enalapril", th: "Enalapril", en: "Enalapril" },
            { val: "Metformin", th: "Metformin", en: "Metformin" },
            { val: "Insulin", th: "Insulin", en: "Insulin" }
        ];

        ncdOptions.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o.val;
            opt.innerText = isThai ? o.th : o.en;
            treatSelect.appendChild(opt);
        });

        treatSelect.value = currentSelectedVal;
    }
    
    if (currentPatient && (gameState === 'DOSSIER' || gameState === 'PLAYING')) {
        const displayName = isThai ? (currentPatient.nameTH || currentPatient.name) : (currentPatient.nameEN || currentPatient.name);
        document.getElementById('p-name').innerText = displayName;
        document.getElementById('b-name').innerText = displayName;

        const displayOcc = isThai ? currentPatient.occupationTH : currentPatient.occupationEN;
        const displayCond = isThai ? currentPatient.conditionTH : currentPatient.conditionEN;
        const displayAllergy = isThai ? currentPatient.allergyTH : currentPatient.allergyEN;
        
        document.getElementById('p-occupation').innerText = displayOcc;
        document.getElementById('b-occ').innerText = displayOcc;
        document.getElementById('p-condition').innerText = displayCond;
        document.getElementById('b-cond').innerText = displayCond;
        document.getElementById('p-allergy').innerText = displayAllergy;
        document.getElementById('b-allergy').innerText = displayAllergy;

        let symps = isThai ? (currentPatient.symptomsTH || currentPatient.symptoms || []) : (currentPatient.symptomsEN || currentPatient.symptoms || []);
        document.getElementById('p-symptoms').innerText = symps.join(", ");
        document.getElementById('b-symp').innerText = symps.slice(0, 2).join(", ") + "...";
        
        if (currentDifficulty === 'hard') {
            btnHint.querySelector('.cost').innerText = isThai ? "(โดนแบน)" : "(Locked)";
            btnHint.classList.add('locked-hint');
        } else {
            btnHint.querySelector('.cost').innerText = "(+15s)";
            btnHint.classList.remove('locked-hint');
        }
    }

    if (document && document.body) {
        document.body.classList.toggle('thai-lang', isThai);
    }

    if (doctorLog) {
        const lines = doctorLog.querySelectorAll('.log-line');
        lines.forEach(line => {
            if (line.classList.contains('system')) {
                const txt = line.innerText.trim();
                
                if (isThai && txt === "System: Patient is waiting.") { 
                    line.innerText = "ระบบ: ผู้ป่วยมารอที่เตียงแล้ว"; 
                    return; 
                } else if (!isThai && txt === "ระบบ: ผู้ป่วยมารอที่เตียงแล้ว") { 
                    line.innerText = "System: Patient is waiting."; 
                    return; 
                }

                if (txt.startsWith("[📖 HANDBOOK]:") || txt.startsWith("[📖 เปิดตำราแพทย์]:")) {
                    if (currentPatient) {
                        const hintMsg = getHint(currentPatient.realDiseaseName);
                        line.innerText = isThai ? `[📖 เปิดตำราแพทย์]: ${hintMsg}` : `[📖 HANDBOOK]: ${hintMsg}`;
                    }
                    return;
                }
                return;
            }

            let prefix = "";
            let body = line.innerText;

            if (line.classList.contains('doctor')) {
                body = body.replace(/^เครื่องมือ:\s*/,'').replace(/^Tool:\s*/,'').trim();
                prefix = isThai ? "เครื่องมือ: " : "Tool: ";
            } else if (line.classList.contains('patient')) {
                body = body.replace(/^คนไข้:\s*/,'').replace(/^Patient:\s*/,'').trim();
                prefix = isThai ? "คนไข้: " : "Patient: ";
            } else { 
                return; 
            }

            let quoted = false;
            if (body.startsWith('"') && body.endsWith('"')) { 
                quoted = true; 
                body = body.slice(1, -1).trim(); 
            }

            let newBody = body;
            if (isThai && dynamicDict[body]) { 
                newBody = dynamicDict[body]; 
            } else if (!isThai && reverseDynamicDict[body]) { 
                newBody = reverseDynamicDict[body]; 
            }

            line.innerText = prefix + (quoted ? `"${newBody}"` : newBody);
        });
    }
    
    if (gameState === 'END') {
        renderFeedbackScreen();
    }
}

btnLangToggleFixed.onclick = () => { 
    playSound(sfxClick); 
    isThai = !isThai; 
    applyLanguage(); 
    if (drugLibraryModal && !drugLibraryModal.classList.contains('hidden')) {
        renderDrugLibrary();
        document.getElementById('wiki-title').innerText = isThai ? "📖 คลังข้อมูลยา (DRUG LIBRARY)" : "📖 DRUG LIBRARY";
        btnCloseDrugLibrary.innerText = isThai ? "ปิด" : "CLOSE";
    }
    // Auto collapse drawer on language change
    const langDrawer = document.getElementById('lang-drawer');
    const btnLangDrawerToggle = document.getElementById('btn-lang-drawer-toggle');
    if (langDrawer && btnLangDrawerToggle) {
        langDrawer.classList.add('collapsed');
        btnLangDrawerToggle.innerHTML = '🌐 ◀';
    }
};

const langDrawer = document.getElementById('lang-drawer');
const btnLangDrawerToggle = document.getElementById('btn-lang-drawer-toggle');
if (btnLangDrawerToggle && langDrawer) {
    btnLangDrawerToggle.onclick = () => {
        playSound(sfxClick);
        const isCollapsed = langDrawer.classList.toggle('collapsed');
        btnLangDrawerToggle.innerHTML = isCollapsed ? '🌐 ◀' : '🌐 ▶';
    };
}

const setupCloseHandler = (btn) => {
    if(btn) {
        btn.onclick = () => { 
            playSound(sfxClick); 
            imageResultModal.classList.add('hidden'); 
        };
    }
};
setupCloseHandler(btnCloseImage);
setupCloseHandler(btnCloseImageActual);

function showLightboxView(viewElement) {
    cssXrayView.classList.add('hidden');
    cssBloodView.classList.add('hidden');
    cssTempView.classList.add('hidden');
    cssBpView.classList.add('hidden');
    cssGlucoseView.classList.add('hidden');
    viewElement.classList.remove('hidden');
}

btnViewXray.onclick = () => { 
    playSound(sfxClick); 
    imageResultTitle.innerText = isThai ? "ฟิล์มเอกซเรย์ปอด" : "CHEST X-RAY"; 
    showLightboxView(cssXrayView);
    
    const lungs = document.querySelectorAll('.lung'); 
    if (currentPatient && currentPatient.realDiseaseName === "Pneumonia") {
        lungs.forEach(l => l.classList.add('infected')); 
    } else {
        lungs.forEach(l => l.classList.remove('infected')); 
    }
    imageResultModal.classList.remove('hidden'); 
};

btnViewBlood.onclick = () => { 
    playSound(sfxClick); 
    imageResultTitle.innerText = isThai ? "กล้องจุลทรรศน์" : "MICROSCOPE VIEW"; 
    showLightboxView(cssBloodView);
    
    const viruses = document.querySelectorAll('.virus'); 
    const bloodLabel = document.getElementById('blood-status-label'); 
    const disease = currentPatient ? currentPatient.realDiseaseName : ""; 
    
    if (disease === "Influenza" || disease === "Pneumonia") { 
        viruses.forEach(v => v.classList.remove('hidden')); 
        bloodLabel.innerText = isThai ? "⚠️ STATUS: พบเชื้อไวรัส/แบคทีเรีย!" : "⚠️ STATUS: Pathogens Detected!"; 
        bloodLabel.style.color = "#ff5252"; 
    } else { 
        viruses.forEach(v => v.classList.add('hidden')); 
        bloodLabel.innerText = isThai ? "✅ STATUS: ปกติ" : "✅ STATUS: Normal"; 
        bloodLabel.style.color = "#b2ff59"; 
    } 
    imageResultModal.classList.remove('hidden'); 
};

btnViewTemp.onclick = () => { 
    playSound(sfxClick); 
    imageResultTitle.innerText = isThai ? "กล้องจับความร้อน" : "THERMAL SCAN"; 
    showLightboxView(cssTempView);
    
    let tempNum = parseFloat(currentPatient ? currentPatient.labResults.temp : "36.5"); 
    const display = document.getElementById('thermal-digital-display'); 
    const body = document.getElementById('thermal-body'); 
    
    display.innerText = tempNum.toFixed(1) + "°C"; 
    body.className = "thermal-silhouette"; 
    
    if(tempNum >= 37.5) { 
        body.classList.add('thermal-hot'); 
        display.style.color = "#ff5252"; 
        display.style.borderColor = "#ff5252"; 
    } else if(tempNum <= 35.5) { 
        body.classList.add('thermal-cold'); 
        display.style.color = "#40c4ff"; 
        display.style.borderColor = "#40c4ff"; 
    } else { 
        body.classList.add('thermal-normal'); 
        display.style.color = "#fff"; 
        display.style.borderColor = "#fff"; 
    } 
    imageResultModal.classList.remove('hidden'); 
};

btnViewBp.onclick = () => {
    playSound(sfxClick);
    imageResultTitle.innerText = isThai ? "เครื่องวัดความดัน" : "SPHYGMOMANOMETER";
    showLightboxView(cssBpView);
    
    const bpVal = currentPatient ? currentPatient.labResults.bp : "120/80 mmHg";
    const parts = bpVal.split(' ')[0].split('/');
    document.getElementById('bp-sys-val').innerText = parts[0];
    document.getElementById('bp-dia-val').innerText = parts[1];
    
    let basePulse = 70;
    if (currentPatient && currentPatient.realDiseaseName === "Hypertension") basePulse = 80;
    if (currentPatient && currentPatient.realDiseaseName === "Hypothermia") basePulse = 50;
    document.getElementById('bp-pulse-val').innerText = Math.floor(Math.random() * 15) + basePulse;
    
    imageResultModal.classList.remove('hidden');
};

btnViewGlucose.onclick = () => {
    playSound(sfxClick);
    imageResultTitle.innerText = isThai ? "เครื่องตรวจระดับน้ำตาล" : "GLUCOSE METER";
    showLightboxView(cssGlucoseView);
    
    const glucoseNumVal = currentPatient ? currentPatient.labResults.glucose : 90;
    document.getElementById('glucose-num-val').innerText = glucoseNumVal;
    
    const statusText = document.getElementById('glucose-status-text');
    if (glucoseNumVal >= 126) {
        statusText.innerText = isThai ? "สูง (HIGH)" : "HIGH";
        statusText.style.color = "#ff5252";
    } else if (glucoseNumVal < 70) {
        statusText.innerText = isThai ? "ต่ำ (LOW)" : "LOW";
        statusText.style.color = "#40c4ff";
    } else {
        statusText.innerText = isThai ? "ปกติ (NORMAL)" : "NORMAL";
        statusText.style.color = "#004d40";
    }
    imageResultModal.classList.remove('hidden');
};

function resetGameUI() {
    const langDrawer = document.getElementById('lang-drawer');
    if (langDrawer) langDrawer.classList.remove('side-mode');
    langSelectModal.classList.add('hidden'); 
    introModal.classList.add('hidden'); 
    caseSelectModal.classList.add('hidden');
    dossierModal.classList.add('hidden'); 
    feedbackModal.classList.add('hidden'); 
    gameUI.classList.add('hidden');
    cutsceneModal.classList.add('hidden'); 
    actionLoading.classList.add('hidden'); 
    imageResultModal.classList.add('hidden');
    if (tutorialModal) tutorialModal.classList.add('hidden');
    if (drugLibraryModal) drugLibraryModal.classList.add('hidden');
    if (medRefsModal) medRefsModal.classList.add('hidden');
}

let loadedCount = 0; 
const totalAssets = 1;

assets.bg.img.onload = () => { 
    loadedCount++; 
    if (loadedCount === totalAssets) { 
        gameState = 'TITLE'; 
        requestAnimationFrame(gameLoop); 
    } 
};

assets.bg.img.onerror = () => { 
    loadedCount++; 
    if (loadedCount === totalAssets) { 
        gameState = 'TITLE'; 
        requestAnimationFrame(gameLoop); 
    } 
};

assets.bg.img.src = assets.bg.src;

function gameLoop() { 
    ctx.imageSmoothingEnabled = true; 
    if (assets.bg.img.complete && assets.bg.img.naturalWidth !== 0) { 
        ctx.drawImage(assets.bg.img, 0, 0, canvas.width, canvas.height); 
    } 
    requestAnimationFrame(gameLoop); 
}

btnStartGame.onclick = () => { 
    playSound(sfxClick); 
    titleScreen.classList.add('hidden'); 
    langSelectModal.classList.remove('hidden'); 
};

btnChooseTh.onclick = () => { 
    isThai = true; 
    applyLanguage(); 
    playSound(sfxClick); 
    langSelectModal.classList.add('hidden'); 
    introModal.classList.remove('hidden'); 
};

btnChooseEn.onclick = () => { 
    isThai = false; 
    applyLanguage(); 
    playSound(sfxClick); 
    langSelectModal.classList.add('hidden'); 
    introModal.classList.remove('hidden'); 
};

btnBackFromCase.onclick = () => { 
    playSound(sfxClick); 
    caseSelectModal.classList.add('hidden'); 
    titleScreen.classList.remove('hidden'); 
};

btnBackFromFeedback.onclick = () => { 
    playSound(sfxClick); 
    feedbackModal.classList.add('hidden'); 
    titleScreen.classList.remove('hidden'); 
    const langDrawer = document.getElementById('lang-drawer');
    if (langDrawer) langDrawer.classList.remove('side-mode');
};

btnStartShift.onclick = () => { 
    playSound(sfxClick); 
    introModal.classList.add('hidden'); 
    const lang = isThai ? langData.th : langData.en; 
    playCutscene(lang.cutsceneMsg, () => { 
        caseSelectModal.classList.remove('hidden'); 
    }); 
};

function playCutscene(message, callback) {
    if (!message) { 
        if(callback) callback(); 
        return; 
    } 
    cutsceneModal.classList.remove('hidden'); 
    cutsceneText.innerHTML = ""; 
    let i = 0;
    let isTyping = true;
    
    function typeChar() { 
        if (!isTyping) return; 
        if (i < message.length) { 
            cutsceneText.innerHTML += message.charAt(i); 
            if(i % 3 === 0) playSound(sfxType); 
            i++; 
            setTimeout(typeChar, 40); 
        } 
    }
    
    typeChar();
    
    cutsceneModal.onclick = () => { 
        if(isTyping && i < message.length) { 
            isTyping = false; 
            cutsceneText.innerHTML = message; 
        } else { 
            playSound(sfxClick); 
            cutsceneModal.classList.add('hidden'); 
            if(callback) callback(); 
        } 
    };
}

caseBtns.forEach(btn => {
    btn.onclick = (e) => {
        playSound(sfxClick);
        currentDifficulty = btn.closest('.case-folder').dataset.difficulty;
        
        if(currentDifficulty === 'easy') {
            coins = 80; 
        } else if(currentDifficulty === 'normal') {
            coins = 50; 
        } else if(currentDifficulty === 'hard') {
            coins = 30;
        }
        
        caseSelectModal.classList.add('hidden'); 
        startGame(); 
    };
});

function startGame() {
    timeElapsed = 0; 
    currentAskCost = 5; 
    
    patientStability = 100;
    if(healthBarFill) { 
        healthBarFill.style.width = '100%'; 
        healthBarFill.style.backgroundColor = '#ff5252'; 
    }
    if(healthText) {
        healthText.innerText = '100%';
    }
    
    updateHUD();
    updateECGHeartbeat();
    
    doctorLog.innerHTML = '';
    logToScreen("system", isThai ? "ระบบ: ผู้ป่วยมารอที่เตียงแล้ว" : "System: Patient is waiting.");
    
    diagnosisInput.value = "";
    document.getElementById('treatment-input').value = "";

    // Reset warnings
    [document.getElementById('b-occ'), document.getElementById('b-cond'), document.getElementById('b-allergy'),
     document.getElementById('p-occupation'), document.getElementById('p-condition'), document.getElementById('p-allergy')].forEach(el => {
        el?.classList.remove('warning-glow');
     });

    btnViewXray.classList.add('hidden'); 
    btnViewBlood.classList.add('hidden'); 
    btnViewTemp.classList.add('hidden');
    btnViewBp.classList.add('hidden');
    btnViewGlucose.classList.add('hidden');
    
    const approvedStamp = document.getElementById('dossier-stamp-approved');
    const rejectedStamp = document.getElementById('dossier-stamp-rejected');
    if (approvedStamp) {
        approvedStamp.classList.add('hidden-stamp');
        approvedStamp.classList.remove('stamp-slam');
    }
    if (rejectedStamp) {
        rejectedStamp.classList.add('hidden-stamp');
        rejectedStamp.classList.remove('stamp-slam');
    }

    gameState = 'DOSSIER';
    currentPatient = new Patient(isThai, currentDifficulty); 
    
    btnHint.disabled = false; 
    btnHint.style.opacity = "1"; 
    btnHint.classList.remove('locked-hint');
    
    if (currentDifficulty === 'hard') {
        btnHint.disabled = true; 
        btnHint.style.opacity = "0.5";
        btnHint.querySelector('.cost').innerText = isThai ? "(โดนแบน)" : "(Locked)";
        btnHint.classList.add('locked-hint');
    } else {
        btnHint.querySelector('.cost').innerText = "(+15s)";
    }
    
    document.getElementById('p-name').innerText = currentPatient.name;
    document.getElementById('p-age').innerText = currentPatient.age;
    document.getElementById('p-gender').innerText = currentPatient.gender;
    document.getElementById('p-pain').innerText = currentPatient.painLevel;
    
    document.getElementById('p-occupation').innerText = currentPatient.occupation;
    document.getElementById('b-occ').innerText = currentPatient.occupation;
    document.getElementById('p-condition').innerText = currentPatient.condition;
    document.getElementById('b-cond').innerText = currentPatient.condition;
    document.getElementById('p-allergy').innerText = currentPatient.allergy;
    document.getElementById('b-allergy').innerText = currentPatient.allergy;
    
    let symps = isThai ? (currentPatient.symptomsTH || currentPatient.symptoms || []) : (currentPatient.symptomsEN || currentPatient.symptoms || []);
    document.getElementById('p-symptoms').innerText = symps.join(", ");
    document.getElementById('b-symp').innerText = symps.slice(0, 2).join(", ") + "...";
    document.getElementById('b-name').innerText = currentPatient.name;
    document.getElementById('b-age').innerText = currentPatient.age;
    
    const dossierImg = document.getElementById('patient-img');
    const dashImg = document.getElementById('dashboard-patient-img');
    dossierImg.src = currentPatient.imagePath; 
    dashImg.src = currentPatient.imagePath;

    dossierModal.classList.remove('hidden'); 
    gameUI.classList.add('hidden'); 
    feedbackModal.classList.add('hidden');
}

function startTimer() { 
    if (timerInterval) clearInterval(timerInterval); 
    timerInterval = setInterval(() => { 
        timeElapsed++; 
        timerDisplay.innerText = timeElapsed; 
        
        patientStability -= 2; 
        if (patientStability <= 0) {
            patientStability = 0;
            finishGame(false, "Patient flatlined!", "คนไข้ทนอาการไม่ไหวแล้ว!", false); 
        }
        
        if(healthBarFill) {
            healthBarFill.style.width = patientStability + '%';
        }
        if(healthText) {
            healthText.innerText = Math.floor(patientStability) + '%';
        }
        
        if (patientStability <= 30 && healthBarFill) {
            healthBarFill.style.backgroundColor = '#ff9800'; 
        }

        updateECGHeartbeat();

    }, 1000); 
}

function updateECGHeartbeat() {
    const ecg = document.querySelector('.ecg-line');
    if (!ecg) return;
    ecg.classList.remove('ecg-normal', 'ecg-fast', 'ecg-critical', 'ecg-flatline');
    if (patientStability <= 0) {
        ecg.classList.add('ecg-flatline');
    } else if (patientStability <= 30) {
        ecg.classList.add('ecg-critical');
    } else if (patientStability <= 60) {
        ecg.classList.add('ecg-fast');
    } else {
        ecg.classList.add('ecg-normal');
    }
}

function updateHUD() {
    timerDisplay.innerText = timeElapsed; 
    coinDisplay.innerText = coins;
    document.querySelector('#btn-ask .cost').innerText = `(-${currentAskCost})`;
    
    const costs = { 'btn-temp': 10, 'btn-xray': 20, 'btn-blood': 15, 'btn-bp': 5, 'btn-glucose': 10, 'btn-consult': 10 };
    document.getElementById('btn-ask').disabled = coins < currentAskCost;
    
    for (let id in costs) {
        const el = document.getElementById(id);
        if (el) el.disabled = coins < costs[id];
    }
}

function checkAchievements(isCorrect, time, coinsLeft, grade, patient, disease, treatment) {
    if (!isCorrect) return; 
    let delays = 500;
    
    if (time <= 15 && !unlockedAchievements.speedster) { 
        unlockedAchievements.speedster = true; 
        setTimeout(() => showAchievementToast("⚡ หมอสายฟ้าแลบ: วินิจฉัยถูกภายใน 15 วิ!", "⚡ Speedster: Correct diagnosis under 15s!"), delays); 
        delays += 4500; 
    }
    
    if (coinsLeft >= 45 && !unlockedAchievements.eagleEye) { 
        unlockedAchievements.eagleEye = true; 
        setTimeout(() => showAchievementToast("💰 หมอตาเพชร: ไม่พึ่งเครื่องมือแล็บเลย!", "💰 Eagle Eye: No expensive lab tools used!"), delays); 
        delays += 4500; 
    }
    
    if ((grade.includes("S") || grade.includes("ระดับตำนาน")) && !unlockedAchievements.legendary) { 
        unlockedAchievements.legendary = true; 
        setTimeout(() => showAchievementToast("👑 ระดับตำนาน: คว้าแรงค์ S สำเร็จ!", "👑 Legendary: Achieved S Rank!"), delays); 
        delays += 4500;
    }

    // NCD Expert: Successfully diagnosed and treated Hypertension or Diabetes
    if ((disease === "Hypertension" || disease === "Diabetes") && !unlockedAchievements.ncdExpert) {
        unlockedAchievements.ncdExpert = true;
        setTimeout(() => showAchievementToast("🩺 ผู้เชี่ยวชาญ NCDs: รักษาโรคเรื้อรังสำเร็จ!", "🩺 NCD Expert: Treated chronic diseases!"), delays);
        delays += 4500;
    }

    // Pharmacist: Successfully treated patient with high risk conditions or occupation sensitivity
    const drowsySensitive = ["Truck Driver", "Construction Worker", "Pilot", "Crane Operator", "Security Guard"].includes(patient.occupationEN);
    const hasHistoryContraindications = ["Peptic Ulcer", "Asthma", "Kidney Disease", "Severe Hypertension", "G6PD Deficiency", "Pregnancy"].includes(patient.conditionEN);
    const penicillinAllergic = patient.allergyEN === "Penicillin Allergy";

    if ((drowsySensitive || hasHistoryContraindications || penicillinAllergic) && !unlockedAchievements.pharmacist) {
        unlockedAchievements.pharmacist = true;
        setTimeout(() => showAchievementToast("💊 เภสัชกรระมัดระวัง: รักษาคนไข้กลุ่มเสี่ยงได้ปลอดภัย!", "💊 Careful Pharmacist: Safely treated a high-risk patient!"), delays);
    }
    
    saveAchievements(); 
}

function finishGame(isCorrect, msgEN, msgTH, isMalpractice = false) {
    clearInterval(timerInterval); 
    gameState = 'END'; 
    gameUI.classList.add('hidden'); 
    feedbackModal.classList.remove('hidden');
    const langDrawer = document.getElementById('lang-drawer');
    if (langDrawer) langDrawer.classList.add('side-mode');

    let grade = "C";
    if (isCorrect) {
        if (coins >= 40 && timeElapsed < 30) {
            grade = "S (Legendary)"; 
        } else if (coins >= 30) {
            grade = "A (Professional)"; 
        } else if (coins >= 15) {
            grade = "B (Good)"; 
        } else {
            grade = "C (Passable)";
        }
    } else { 
        grade = isMalpractice ? "Malpractice" : "Wrong Diagnosis"; 
    }

    lastResult = { 
        isCorrect: isCorrect, 
        time: timeElapsed, 
        coins: coins, 
        grade: grade,
        messageEN: msgEN,
        messageTH: msgTH
    };

    renderFeedbackScreen();
    checkAchievements(isCorrect, timeElapsed, coins, grade, currentPatient, currentPatient.realDiseaseName, document.getElementById('treatment-input').value);
}

function getHint(disease) {
    if (disease.includes("Cold")) {
        return isThai 
            ? "อาการหวัดธรรมดา ลองเช็คอุณหภูมิ หากประกอบอาชีพเสี่ยงภัยหรือคนขับรถ ห้ามให้ยาที่ทำให้ง่วงซึม (CPM) เด็ดขาด!" 
            : "Common Cold. Check temperature. If patient has a high-risk occupation (e.g. drivers), avoid sedating antihistamines (CPM)!";
    }
    if (disease.includes("Flu") || disease.includes("Influenza")) {
        return isThai 
            ? "โรคไข้หวัดใหญ่ จะมีไข้สูงและปวดเมื่อย ระวังยา Ibuprofen ห้ามใช้ในคนไข้โรคกระเพาะอาหาร หอบหืด หรือโรคไต!" 
            : "Influenza causes high fever and muscle aches. Avoid Ibuprofen in patients with Peptic Ulcers, Asthma, or Kidney Disease!";
    }
    if (disease.includes("Pneumonia")) {
        return isThai 
            ? "ปอดบวม ต้องตรวจฟิล์มเอกซเรย์ (X-Ray) ปอด และระวังหากคนไข้มีประวัติแพ้ยาเพนิซิลลิน ห้ามให้ยา Amoxicillin!" 
            : "Pneumonia requires a chest X-Ray. Avoid Amoxicillin if the patient is allergic to Penicillin!";
    }
    if (disease.includes("Stroke")) {
        return isThai 
            ? "หลอดเลือดสมองตีบ มีชาหรือสับสน ยา tPA ห้ามให้หากความดันสูงรุนแรง และ Aspirin ห้ามใช้ในคนไข้มีแผลในกระเพาะหรือพร่องเอนไซม์ G6PD!" 
            : "Stroke presents with numbness or confusion. tPA is contraindicated in severe hypertension. Aspirin is contraindicated in Peptic Ulcers/G6PD!";
    }
    if (disease.includes("Hypertension")) {
        return isThai 
            ? "โรคความดันโลหิตสูง ควรวัดความดัน (BP Cuff) เพื่อยืนยัน ยา Enalapril ห้ามใช้ในหญิงตั้งครรภ์เพราะเป็นอันตรายต่อทารก!" 
            : "Hypertension requires BP Cuff verification. Avoid Enalapril in pregnant patients as it causes fetal harm!";
    }
    if (disease.includes("Diabetes")) {
        return isThai 
            ? "โรคเบาหวาน ควรเจาะวัดน้ำตาล (Glucose Meter) ยา Metformin มีข้อห้ามใช้เด็ดขาดในผู้ป่วยโรคไตเสื่อม!" 
            : "Diabetes requires Glucose Meter test. Metformin is strictly contraindicated in patients with Kidney Disease!";
    }
    if (disease.includes("Hypothermia")) {
        return isThai 
            ? "ภาวะอุณหภูมิร่างกายต่ำมาก เช็คสแกนความร้อนและวัดไข้ ใช้การประคับประคองอุณหภูมิด้วยน้ำเกลืออุ่นและผ้าห่มอุ่น" 
            : "Hypothermia has very low body temp. Check thermal scan. Rewarm using warm IV fluids and blankets.";
    }
    return isThai ? "ซักประวัติและเช็คอาการให้ละเอียด ตรวจสอบข้อห้ามใช้ยาแต่ละชนิดด้วยนะหมอ!" : "Check symptoms carefully and review medication contraindications!";
}

const staticCosts = { 'btn-temp': 10, 'btn-xray': 20, 'btn-blood': 15, 'btn-bp': 5, 'btn-glucose': 10 };

document.getElementById('btn-ask').onclick = () => {
    playSound(sfxClick);
    
    if (currentPatient.dialogueIndex >= currentPatient.hiddenInfo.length) { 
        logToScreen("patient", isThai ? "ฉัน... ไม่มีอะไรจะบอกแล้วล่ะหมอ" : "I... I don't have anything else to say."); 
        return; 
    }
    
    if (coins >= currentAskCost) {
        coins -= currentAskCost;
        let rawMsg = currentPatient.hiddenInfo[currentPatient.dialogueIndex].trim();
        let translatedMsg = (isThai && dynamicDict[rawMsg]) ? dynamicDict[rawMsg] : rawMsg;
        logToScreen("patient", `"${translatedMsg}"`);
        currentPatient.dialogueIndex++; 
        currentAskCost += 5; 
        updateHUD();
    }
};

btnHint.onclick = () => {
    playSound(sfxClick); 
    timeElapsed += 15; 
    updateHUD(); 
    btnHint.disabled = true; 
    btnHint.style.opacity = "0.5";
    
    let hintMsg = getHint(currentPatient.realDiseaseName);
    logToScreen("system", isThai ? `[📖 เปิดตำราแพทย์]: ${hintMsg}` : `[📖 HANDBOOK]: ${hintMsg}`);
};

for (let id in staticCosts) {
    document.getElementById(id).onclick = () => {
        if (coins >= staticCosts[id]) {
            playSound(sfxClick); 
            let disease = currentPatient.realDiseaseName;
            
            if (id === 'btn-xray' && (disease === "Common Cold" || disease === "Hypothermia")) { 
                showChiefWarning("หมอ! อาการแบบนี้ไม่ต้องถึงขั้นเอกซเรย์หรอก เปลืองงบโรงพยาบาล!", "Doctor! No need for X-Ray for this condition. Don't waste budget!"); 
            }
            if (id === 'btn-blood' && disease === "Stroke") { 
                showChiefWarning("นี่หมอ! หลอดเลือดสมองเจาะเลือดไปก็ไม่เจออะไรหรอกนะ ไปเช็คอาการชาดีกว่า!", "Doctor! A blood test won't help with a Stroke. Check for numbness!"); 
            }
            if (id === 'btn-bp' && (disease === "Common Cold" || disease === "Hypothermia" || disease === "Influenza" || disease === "Pneumonia")) {
                showChiefWarning("หมอ! สำหรับอาการหวัดหรือไข้ ไม่จำเป็นต้องวัดความดันตลอดเวลาหรอก!", "Doctor! For cold or flu symptoms, checking blood pressure constantly isn't necessary!");
            }
            if (id === 'btn-glucose' && (disease === "Common Cold" || disease === "Hypothermia" || disease === "Influenza" || disease === "Stroke" || disease === "Pneumonia")) {
                showChiefWarning("หมอ! อาการแบบนี้ไม่เห็นความสัมพันธ์ที่ต้องตรวจน้ำตาลเลย เปลืองงบ!", "Doctor! This condition doesn't call for checking blood glucose. Don't waste budget!");
            }

            coins -= staticCosts[id]; 
            updateHUD();
            
            actionLoading.classList.remove('hidden'); 
            loadingBarFill.classList.remove('animate-load');
            void loadingBarFill.offsetWidth; 
            loadingBarFill.classList.add('animate-load'); 
            playSound(sfxScan);
            
            setTimeout(() => {
                actionLoading.classList.add('hidden'); 
                let type = "doctor"; 
                let msg = "";
                
                if (id === 'btn-xray') { 
                    let val = currentPatient.labResults.xray;
                    if (isThai && val === "Clear") val = "ปกติ (Clear)";
                    if (isThai && val === "Opacities in lungs") val = "พบฝ้าขาวในปอด";
                    msg = isThai ? `ผลเอกซเรย์: ${val}` : `X-Ray: ${currentPatient.labResults.xray}`; 
                    btnViewXray.classList.remove('hidden'); 
                    btnViewXray.click(); 
                } 
                else if (id === 'btn-blood') { 
                    let val = currentPatient.labResults.blood;
                    if (isThai && val === "Normal WBC") val = "เม็ดเลือดขาวปกติ";
                    if (isThai && val.includes("Viral")) val = "เม็ดเลือดขาวสูง (ติดเชื้อไวรัส)";
                    if (isThai && val.includes("Bacterial")) val = "เม็ดเลือดขาวสูง (ติดเชื้อแบคทีเรีย)";
                    msg = isThai ? `ผลเลือด: ${val}` : `Lab: ${currentPatient.labResults.blood}`; 
                    btnViewBlood.classList.remove('hidden'); 
                    btnViewBlood.click(); 
                }
                else if (id === 'btn-temp') { 
                    msg = isThai ? `อุณหภูมิ: ${currentPatient.labResults.temp}` : `Temp: ${currentPatient.labResults.temp}`; 
                    btnViewTemp.classList.remove('hidden'); 
                    btnViewTemp.click(); 
                }
                else if (id === 'btn-bp') {
                    msg = isThai ? `ความดันโลหิต: ${currentPatient.labResults.bp}` : `Blood Pressure: ${currentPatient.labResults.bp}`;
                }
                else if (id === 'btn-glucose') {
                    msg = isThai ? `ระดับน้ำตาลในเลือด: ${currentPatient.labResults.glucose} mg/dL` : `Blood Glucose: ${currentPatient.labResults.glucose} mg/dL`;
                }
                
                logToScreen(type, msg);
            }, 1500);
        }
    };
}

document.getElementById('btn-accept').onclick = () => { 
    const stamp = document.getElementById('dossier-stamp-approved');
    if (stamp) {
        stamp.classList.remove('hidden-stamp');
        stamp.classList.add('stamp-slam');
        playSound(sfxSuccess);
        
        setTimeout(() => {
            stamp.classList.add('hidden-stamp');
            stamp.classList.remove('stamp-slam');
            dossierModal.classList.add('hidden'); 
            gameUI.classList.remove('hidden'); 
            gameState = 'PLAYING'; 
            startTimer(); 
            applyLanguage(); // Ensures options get initialized with warnings
        }, 600);
    } else {
        playSound(sfxClick); 
        dossierModal.classList.add('hidden'); 
        gameUI.classList.remove('hidden'); 
        gameState = 'PLAYING'; 
        startTimer();
        applyLanguage();
    }
};

document.getElementById('btn-reject').onclick = () => { 
    const stamp = document.getElementById('dossier-stamp-rejected');
    if (stamp) {
        stamp.classList.remove('hidden-stamp');
        stamp.classList.add('stamp-slam');
        playSound(sfxFail);
        
        setTimeout(() => {
            stamp.classList.add('hidden-stamp');
            stamp.classList.remove('stamp-slam');
            dossierModal.classList.add('hidden'); 
            caseSelectModal.classList.remove('hidden'); 
        }, 600);
    } else {
        playSound(sfxClick); 
        dossierModal.classList.add('hidden'); 
        caseSelectModal.classList.remove('hidden'); 
    }
};

document.getElementById('btn-restart').onclick = () => { 
    playSound(sfxClick); 
    feedbackModal.classList.add('hidden'); 
    caseSelectModal.classList.remove('hidden'); 
    const langDrawer = document.getElementById('lang-drawer');
    if (langDrawer) langDrawer.classList.remove('side-mode');
};

function validateTreatment(disease, treatment, patient) {
    if (!treatment) return false;
    if (disease === "Common Cold") {
        if (treatment === "Loratadine") return true;
        if (treatment === "Chlorpheniramine") {
            const isDrowsySensitive = [
                "Truck Driver", "Construction Worker", "Pilot", "Crane Operator", "Security Guard"
            ].includes(patient.occupationEN);
            return !isDrowsySensitive;
        }
        return false;
    }
    if (disease === "Influenza") {
        if (treatment === "Paracetamol") return true;
        if (treatment === "Ibuprofen") {
            const isContraindicated = [
                "Peptic Ulcer", "Asthma", "Kidney Disease"
            ].includes(patient.conditionEN);
            return !isContraindicated;
        }
        return false;
    }
    if (disease === "Pneumonia") {
        if (treatment === "Azithromycin") return true;
        if (treatment === "Amoxicillin") {
            return patient.allergyEN !== "Penicillin Allergy";
        }
        return false;
    }
    if (disease === "Stroke") {
        if (treatment === "Aspirin") {
            return !["G6PD Deficiency", "Peptic Ulcer"].includes(patient.conditionEN);
        }
        if (treatment === "tPA") {
            return patient.conditionEN !== "Severe Hypertension";
        }
        return false;
    }
    if (disease === "Hypothermia") {
        return treatment === "Warm IV Fluids";
    }
    if (disease === "Hypertension") {
        if (treatment === "Amlodipine") return true;
        if (treatment === "Enalapril") {
            return patient.conditionEN !== "Pregnancy";
        }
        return false;
    }
    if (disease === "Diabetes") {
        if (treatment === "Metformin") {
            return patient.conditionEN !== "Kidney Disease";
        }
        if (treatment === "Insulin") return true;
        return false;
    }
    return false;
}

function getTreatmentErrorMessage(disease, treatment, patient, forcedIsThai = null) {
    const useThai = (forcedIsThai !== null) ? forcedIsThai : isThai;
    if (!treatment) {
        return useThai ? "❌ กรุณาเลือกวิธีการรักษาหรือยาที่เหมาะสมด้วย!" : "❌ Please select a treatment or medication!";
    }
    if (disease === "Common Cold") {
        if (treatment === "Chlorpheniramine") {
            return useThai 
                ? `❌ ยา CPM ทำให้ง่วงซึม! เนื่องจากผ่านแนวแผงกั้นเลือดสมอง (Blood-Brain Barrier) ได้ดี ทำให้ประสิทธิภาพของระบบประสาทลดลง คนไข้ทำอาชีพ "${patient.occupationTH}" ห้ามใช้ขณะปฏิบัติหน้าที่เนื่องจากเสี่ยงต่ออุบัติเหตุร้ายแรง! [อ้างอิง: FDA Warning for Heavy Machinery Operators]` 
                : `❌ CPM causes severe drowsiness! It crosses the blood-brain barrier, impairing psychomotor performance. Unsafe for a "${patient.occupationEN}" to take while on duty! [Ref: FDA Heavy Machinery Warning]`;
        }
        return useThai ? "❌ ยารักษาโรคหวัดไม่เหมาะสมหรือไม่ได้ลดน้ำมูก!" : "❌ Inappropriate treatment for Cold!";
    }
    if (disease === "Influenza") {
        if (treatment === "Ibuprofen") {
            let reasonTH = "";
            let reasonEN = "";
            if (patient.conditionEN === "Peptic Ulcer") {
                reasonTH = "โรคแผลในกระเพาะอาหาร (เสี่ยงเกิดการระคายเคืองอย่างรุนแรงและกระเพาะทะลุเนื่องจาก Ibuprofen ยับยั้งสาร Prostaglandin ที่คอยปกป้องเมือกกระเพาะ) [อ้างอิง: Siriraj Medical Guideline]";
                reasonEN = "Peptic Ulcer (risks gastric irritation/perforation because Ibuprofen inhibits cytoprotective prostaglandins) [Ref: Siriraj Medical Guideline]";
            } else if (patient.conditionEN === "Asthma") {
                reasonTH = "โรคหอบหืด (เสี่ยงหลอดลมเกร็งตัวเฉียบพลันหรือภาวะ Aspirin-Induced Asthma เนื่องจากยาไปกระตุ้นการทำงานของ Lipoxygenase pathway เกิดสาร Leukotrienes ที่มีฤทธิ์หดหลอดลมรุนแรง) [อ้างอิง: GINA Guidelines]";
                reasonEN = "Asthma (risks acute bronchospasm / Aspirin-Induced Asthma due to shunting towards the lipoxygenase pathway and leukotriene synthesis) [Ref: GINA Guidelines]";
            } else if (patient.conditionEN === "Kidney Disease") {
                reasonTH = "โรคไตเสื่อม (เสี่ยงไตวายเฉียบพลันเนื่องจาก NSAIDs จะไปลดสาร Prostaglandins ส่งผลให้หลอดเลือดฝอยของไต (Afferent Arteriole) หดตัว และลดอัตราการกรองของไต eGFR) [อ้างอิง: KDIGO Guidelines]";
                reasonEN = "Kidney Disease (risks acute renal failure because NSAIDs decrease prostaglandins, causing constriction of afferent renal arterioles and reducing eGFR) [Ref: KDIGO Guidelines]";
            }
            return useThai 
                ? `❌ ยา Ibuprofen มีข้อห้ามใช้เด็ดขาดสำหรับคนไข้รายนี้เนื่องจากเป็น: ${reasonTH}` 
                : `❌ Ibuprofen is strictly contraindicated for this patient due to: ${reasonEN}`;
        }
        return useThai ? "❌ ยารักษาโรคไข้หวัดใหญ่ไม่เหมาะสม!" : "❌ Inappropriate treatment for Flu!";
    }
    if (disease === "Pneumonia") {
        if (treatment === "Amoxicillin") {
            return useThai 
                ? "❌ ยา Amoxicillin เป็นยาปฏิชีวนะกลุ่มเบต้า-แลคแตม (Beta-lactam)! คนไข้มีประวัติแพ้ยาเพนิซิลลินอย่างรุนแรง การใช้อาจกระตุ้นปฏิกิริยาภูมิแพ้เฉียบพลันรุนแรง (Anaphylactic Shock) ซึ่งเป็นอันตรายถึงชีวิตได้ภายในไม่กี่นาที! [อ้างอิง: Drug Allergy Clinical Practice Guidelines]" 
                : "❌ Amoxicillin is a Beta-lactam antibiotic! The patient has a severe Penicillin allergy, creating a high risk of fatal Anaphylactic Shock! [Ref: Drug Allergy Practice Guidelines]";
        }
        return useThai ? "❌ ยาฆ่าเชื้อสำหรับปอดบวมไม่ถูกต้อง!" : "❌ Inappropriate antibiotic for Pneumonia!";
    }
    if (disease === "Stroke") {
        if (treatment === "tPA") {
            return useThai 
                ? "❌ ให้ยาละลายลิ่มเลือด tPA ในขณะความดันโลหิตสูงรุนแรง มีความเสี่ยงอย่างรุนแรงต่อการเกิดภาวะสมองตกเลือดเฉียบพลัน (Intracerebral Hemorrhage - ICH) ส่งผลให้เสียชีวิตได้ทันที! [อ้างอิง: AHA/ASA Early Stroke Management Guidelines]" 
                : "❌ Administering tPA during severe hypertension is contraindicated as it poses a massive risk of symptomatic Intracerebral Hemorrhage (ICH) which can be fatal! [Ref: AHA/ASA Guidelines]";
        }
        if (treatment === "Aspirin") {
            if (patient.conditionEN === "G6PD Deficiency") {
                return useThai 
                    ? "❌ ห้ามให้ยา Aspirin ในผู้ป่วยที่มีภาวะพร่อง G6PD เด็ดขาด! เนื่องจากยาจะสร้างภาวะ Oxidative Stress ในเซลล์เม็ดเลือดแดง ทำให้เกิดภาวะเม็ดเลือดแดงแตกเฉียบพลัน (Acute Hemolysis) จนช็อกได้! [อ้างอิง: WHO guidelines for G6PD]" 
                    : "❌ Aspirin is strictly contraindicated in G6PD Deficiency! It induces oxidative stress in RBCs, leading to acute hemolytic anemia! [Ref: WHO G6PD Guidelines]";
            }
            if (patient.conditionEN === "Peptic Ulcer") {
                return useThai 
                    ? "❌ ห้ามให้ยา Aspirin ในผู้ป่วยที่มีแผลในกระเพาะอาหาร! เนื่องจากยายับยั้งเกล็ดเลือดและลดการป้องกันเยื่อบุกระเพาะ เสี่ยงทำให้แผลเปิดและเกิดภาวะเลือดออกในทางเดินอาหารรุนแรง (GI Bleeding)! [อ้างอิง: Siriraj Gastroenterology Guideline]" 
                    : "❌ Aspirin is contraindicated in Peptic Ulcer patients! It inhibits platelets and mucosal defense, risking massive gastrointestinal bleeding! [Ref: Siriraj Gastroenterology Guideline]";
            }
        }
        return useThai ? "❌ การรักษาโรคหลอดเลือดสมองไม่ถูกต้อง!" : "❌ Inappropriate treatment for Stroke!";
    }
    if (disease === "Hypothermia") {
        return useThai 
            ? "❌ การกู้คืนอุณหภูมิร่างกายไม่ถูกต้อง! ภาวะอุณหภูมิต่ำกว่า 35°C ต้องการสารน้ำอุ่นทางหลอดเลือดดำ (Warm IV Fluids 38-42°C) และการให้ความอบอุ่นแบบ Active เพื่อรักษาระดับอุณหภูมิแกนกลางให้คงที่! [อ้างอิง: Wilderness Medical Society Practice Guidelines]" 
            : "❌ Inappropriate rewarming treatment! Patients with moderate/severe hypothermia (<35°C) require Warm IV Fluids (38-42°C) and active core rewarming! [Ref: Wilderness Medical Society]";
    }
    if (disease === "Hypertension") {
        if (treatment === "Enalapril") {
            return useThai 
                ? "❌ ยา Enalapril (กลุ่ม ACE Inhibitor) ห้ามใช้ในสตรีมีครรภ์เด็ดขาด! เนื่องจากยับยั้งระบบ RAAS ของตัวอ่อน ส่งผลให้ทารกในครรภ์เกิดความดันโลหิตต่ำ ไตไม่พัฒนา (Renal Dysgenesis) และอาจทำให้ทารกเสียชีวิตในครรภ์! [อ้างอิง: ACOG Hypertension Guidelines]" 
                : "❌ Enalapril (ACE Inhibitor) is strictly contraindicated in pregnant patients! It blocks the fetal RAAS system, causing fetal renal dysgenesis, oligohydramnios, and potential fetal demise! [Ref: ACOG Guidelines]";
        }
        return useThai ? "❌ แผนการรักษาหรือยาลดความดันโลหิตไม่ถูกต้อง!" : "❌ Inappropriate treatment or medication for Hypertension!";
    }
    if (disease === "Diabetes") {
        if (treatment === "Metformin") {
            return useThai 
                ? "❌ ยา Metformin ห้ามใช้ในผู้ป่วยโรคไตเสื่อมรุนแรง (eGFR < 30 mL/min/1.73m²) เด็ดขาด! เนื่องจากยาขับออกทางไต หากเกิดการสะสมจะทำให้เกิดภาวะเลือดเป็นกรดจากกรดแลกติกคั่ง (Metformin-associated Lactic Acidosis - MALA) ซึ่งมีอัตราการเสียชีวิตสูงถึง 50%! [อ้างอิง: ADA Standards of Care / สมาคมโรคเบาหวานแห่งประเทศไทยฯ]" 
                : "❌ Metformin is strictly contraindicated in severe Kidney Disease (eGFR < 30 mL/min)! Decreased renal clearance leads to accumulation, risking fatal Metformin-associated Lactic Acidosis (MALA)! [Ref: ADA Standards of Care]";
        }
        return useThai ? "❌ แผนการรักษาหรือยารักษาเบาหวานไม่ถูกต้อง!" : "❌ Inappropriate treatment or medication for Diabetes!";
    }
    return useThai ? "❌ เลือกแผนการรักษาไม่ถูกต้อง!" : "❌ Inappropriate treatment plan!";
}

document.getElementById('btn-submit').onclick = () => { 
    playSound(sfxClick); 
    const diag = diagnosisInput.value;
    const treat = document.getElementById('treatment-input').value;
    
    const isDiagCorrect = (diag === currentPatient.realDiseaseName);
    const isTreatCorrect = validateTreatment(diag, treat, currentPatient);
    
    if (isDiagCorrect && isTreatCorrect) {
        finishGame(true, "Correct.", "ถูกต้อง.", false); 
    } else {
        let errorMsgEN = "";
        let errorMsgTH = "";
        let isMalpractice = false;
        
        if (!isDiagCorrect) {
            errorMsgEN = "❌ Wrong Diagnosis!";
            errorMsgTH = "❌ วินิจฉัยโรคผิดพลาด!";
            isMalpractice = false;
        } else {
            errorMsgEN = getTreatmentErrorMessage(diag, treat, currentPatient, false);
            errorMsgTH = getTreatmentErrorMessage(diag, treat, currentPatient, true);
            isMalpractice = true;
        }
        finishGame(false, errorMsgEN, errorMsgTH, isMalpractice); 
    }
};

if (btnHowToPlay) {
    btnHowToPlay.onclick = () => {
        playSound(sfxClick);
        currentTutStep = 0;
        renderTutorialStep();
        tutorialModal.classList.remove('hidden');
    };
}

if (btnTutNext) {
    btnTutNext.onclick = () => {
        playSound(sfxClick);
        const lang = isThai ? 'th' : 'en';
        if (currentTutStep < tutorialData[lang].length - 1) {
            currentTutStep++;
            renderTutorialStep();
        } else {
            tutorialModal.classList.add('hidden');
        }
    };
}

if (btnTutSkip) {
    btnTutSkip.onclick = () => {
        playSound(sfxClick);
        tutorialModal.classList.add('hidden');
    };
}