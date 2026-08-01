import { diseases } from './diseases.js';

export class Patient {
    constructor(isThai = false, difficulty = 'normal') {
        const diseaseKeys = Object.keys(diseases);
        this.realDiseaseName = diseaseKeys[Math.floor(Math.random() * diseaseKeys.length)];
        const diseaseData = diseases[this.realDiseaseName];

        
        const baseSymEN = [...diseaseData.symptomsEN];
        const baseSymTH = [...diseaseData.symptomsTH];
        if (difficulty === 'hard') {
            if (diseaseData.redHerringEN) baseSymEN.push(diseaseData.redHerringEN);
            if (diseaseData.redHerringTH) baseSymTH.push(diseaseData.redHerringTH);
        }
        this.symptomsEN = baseSymEN;
        this.symptomsTH = baseSymTH;
        this.symptoms = isThai ? [...this.symptomsTH] : [...this.symptomsEN];

        
        this.hiddenInfo = isThai ? diseaseData.dialoguesTH : diseaseData.dialoguesEN;
        this.dialogueIndex = 0;
        
        const namesEN = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Brown"];
        const nameMapTH = {
            "John Doe": "จอห์น โด",
            "Jane Smith": "เจน สมิธ",
            "Alice Johnson": "อลิซ จอห์นสัน",
            "Bob Brown": "บ็อบ บราวน์"
        };
        const idx = Math.floor(Math.random() * namesEN.length);
        const chosenEN = namesEN[idx];
        this.nameEN = chosenEN;
        this.nameTH = nameMapTH[chosenEN] || chosenEN;
        this.name = isThai ? this.nameTH : this.nameEN;
        
        this.age = Math.floor(Math.random() * 60) + 18;
        this.gender = Math.random() > 0.5 ? (isThai ? "ชาย" : "Male") : (isThai ? "หญิง" : "Female");
        this.painLevel = Math.floor(Math.random() * 10) + 1;
        
        if (this.gender === "ชาย" || this.gender === "Male") {
            this.imagePath = "assets/character/patient_male.jpg"; 
        } else {
            this.imagePath = "assets/character/page9_img1.png"; 
        }
        
        // Generate random patient occupation
        const occupationsEN = [
            "Truck Driver", "Construction Worker", "Pilot", "Crane Operator", "Security Guard",
            "Office Worker", "Student", "Athlete", "Farmer", "Doctor"
        ];
        const occupationMapTH = {
            "Truck Driver": "คนขับรถบรรทุก",
            "Construction Worker": "คนงานก่อสร้าง",
            "Pilot": "นักบิน",
            "Crane Operator": "คนควบคุมเครน",
            "Security Guard": "พนักงานรักษาความปลอดภัย",
            "Office Worker": "พนักงานออฟฟิศ",
            "Student": "นักเรียน",
            "Athlete": "นักกีฬา",
            "Farmer": "ชาวนา/เกษตรกร",
            "Doctor": "แพทย์"
        };
        const chosenOcc = occupationsEN[Math.floor(Math.random() * occupationsEN.length)];
        this.occupationEN = chosenOcc;
        this.occupationTH = occupationMapTH[chosenOcc] || chosenOcc;
        this.occupation = isThai ? this.occupationTH : this.occupationEN;

        // Generate random underlying medical conditions / history
        const conditionsEN = [
            "Peptic Ulcer", "Asthma", "Kidney Disease", 
            "Severe Hypertension", "G6PD Deficiency", "None"
        ];
        if (this.gender === "Female" || this.gender === "หญิง") {
            conditionsEN.push("Pregnancy");
        }
        const conditionMapTH = {
            "Peptic Ulcer": "โรคแผลในกระเพาะอาหาร",
            "Asthma": "โรคหอบหืด",
            "Kidney Disease": "โรคไตเสื่อม",
            "Severe Hypertension": "ความดันโลหิตสูงรุนแรง",
            "G6PD Deficiency": "ภาวะพร่องเอนไซม์ G6PD",
            "Pregnancy": "ตั้งครรภ์",
            "None": "ไม่มี"
        };
        const chosenCond = conditionsEN[Math.floor(Math.random() * conditionsEN.length)];
        this.conditionEN = chosenCond;
        this.conditionTH = conditionMapTH[chosenCond] || chosenCond;
        this.condition = isThai ? this.conditionTH : this.conditionEN;

        // Generate random drug allergies
        const allergiesEN = [
            "Penicillin Allergy", "None"
        ];
        const allergyMapTH = {
            "Penicillin Allergy": "แพ้ยาเพนิซิลลิน",
            "None": "ไม่มี"
        };
        const chosenAllergy = allergiesEN[Math.floor(Math.random() * allergiesEN.length)];
        this.allergyEN = chosenAllergy;
        this.allergyTH = allergyMapTH[chosenAllergy] || chosenAllergy;
        this.allergy = isThai ? this.allergyTH : this.allergyEN;
        
        this.labResults = this.generateLabs(this.realDiseaseName);
    }

    generateLabs(disease) {
        let temp = (Math.random() * 1.5 + 36.5).toFixed(1); 
        let xray = "Clear";
        let blood = "Normal WBC";
        
        let sys = Math.floor(Math.random() * 15) + 110;
        let dia = Math.floor(Math.random() * 10) + 70;
        let bp = `${sys}/${dia} mmHg`;
        
        let glucose = Math.floor(Math.random() * 30) + 85; 
        
        if (disease === "Common Cold") {
            temp = (Math.random() * 1.0 + 37.0).toFixed(1);
        } else if (disease === "Influenza") {
            temp = (Math.random() * 1.5 + 38.5).toFixed(1);
            blood = "Elevated WBC (Viral)";
        } else if (disease === "Pneumonia") {
            temp = (Math.random() * 1.5 + 38.5).toFixed(1);
            xray = "Opacities in lungs";
            blood = "Elevated WBC (Bacterial)";
        } else if (disease === "Hypothermia") {
            temp = (Math.random() * 2.0 + 33.0).toFixed(1); 
        } else if (disease === "Hypertension") {
            sys = Math.floor(Math.random() * 20) + 155;
            dia = Math.floor(Math.random() * 10) + 95;
            bp = `${sys}/${dia} mmHg`;
        } else if (disease === "Diabetes") {
            glucose = Math.floor(Math.random() * 120) + 180;
        }
        return { temp, xray, blood, bp, glucose };
    }
}