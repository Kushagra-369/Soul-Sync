import { useState, useEffect, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { APIURL } from "../../GlobalAPIURL";
import {
    Send,
    ArrowLeft,
    Heart,
    Sparkles,
    GraduationCap,
  
} from "lucide-react";

// ==================== TYPES ====================

type Mood = "very_sad" | "sad" | "neutral" | "happy" | "very_happy";

type AssistantType = "boy" | "girl";

type UserDetails = {
    _id: string;
    name?: string;
    level?: "school" | "college";
    classOrCourse?: string;
    assistantType: AssistantType;
};

type Message = {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp?: Date;
};

type MoodGradient = {
    [K in Mood]: string;
};

type AvatarConfig = {
    [K in AssistantType]: {
        default: string;
        happy: string;
        sad: string;
        thinking: string;
    };
};

// ==================== CONSTANTS ====================

const MOOD_GRADIENTS: MoodGradient = {
    very_sad: "from-purple-900 via-purple-800 to-indigo-900",
    sad: "from-blue-900 via-indigo-800 to-purple-900",
    neutral: "from-emerald-600 to-blue-600",
    happy: "from-yellow-500 via-orange-500 to-pink-500",
    very_happy: "from-pink-500 via-red-500 to-yellow-500"
} as const;

const AVATARS: AvatarConfig = {
    boy: {
        default: "👨‍⚕️",
        happy: "😎",
        sad: "🤝",
        thinking: "🤔"
    },
    girl: {
        default: "👩‍⚕️",
        happy: "🥰",
        sad: "💝",
        thinking: "🤗"
    }
} as const;

const MOOD_DISPLAY_NAMES: Record<Mood, string> = {
    very_sad: "Deep Sadness",
    sad: "Sad",
    neutral: "Neutral",
    happy: "Happy",
    very_happy: "Very Happy"
};

const MOOD_INDICATORS: Record<Mood, string> = {
    very_sad: "💝 Holding space",
    sad: "🫂 Here for you",
    neutral: "👋 Listening",
    happy: "😊 Positive",
    very_happy: "✨ High Energy"
};

// ==================== HELPER FUNCTIONS ====================

const getTimeGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
};

const getMoodEmoji = (mood: Mood): string => {
    const emojiMap: Record<Mood, string> = {
        very_sad: "💜",
        sad: "🫂",
        neutral: "👋",
        happy: "😊",
        very_happy: "🎉"
    };
    return emojiMap[mood] || "👋";
};

// ==================== MAIN COMPONENT ====================

export default function AICounselor() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const introSent = useRef<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState<string>("");
    const [mood, setMood] = useState<Mood>("neutral");
    const [details, setDetails] = useState<UserDetails | null>(null);

    // Get current gradient based on mood
    const getCurrentGradient = (): string => {
        return MOOD_GRADIENTS[mood] || MOOD_GRADIENTS.neutral;
    };

    // Get appropriate avatar
    const getAvatar = (type: keyof AvatarConfig[AssistantType] = "default"): string => {
        if (!details?.assistantType) return AVATARS.boy.default;
        return AVATARS[details.assistantType][type] || AVATARS[details.assistantType].default;
    };

    // Check if assistant is girl
    const isGirl = details?.assistantType === "girl";

    // ==================== MOOD-BASED REPLY GENERATOR ====================

    const generateMoodReply = (userText: string): string => {
        const lower = userText.toLowerCase();

        // ==================== 🎯 CAREER & FUTURE ====================
        if (lower.includes("career") || lower.includes("future") || lower.includes("job") ||
            lower.includes("placement") || lower.includes("earning") || lower.includes("salary") ||
            lower.includes("kya karun") || lower.includes("kya kare") || lower.includes("confused about future") ||
            lower.includes("aim") || lower.includes("goal") || lower.includes("laxya") ||
            lower.includes("ban na chahta") || lower.includes("ban na chahti") || lower.includes("kya banu") ||
            lower.includes("kya bane") || lower.includes("tension about future") || lower.includes("scope") ||
            lower.includes("options") || lower.includes("field") || lower.includes("stream") ||
            lower.includes("which course") || lower.includes("kaunsa subject") || lower.includes("branch") ||
            lower.includes("upsc") || lower.includes("ssc") || lower.includes("bank") || lower.includes("government job") ||
            lower.includes("private job") || lower.includes("internship") || lower.includes("fresher") ||
            lower.includes("experienced") || lower.includes("switch job") || lower.includes("resign")) {

            const isConfused = lower.includes("confuse") || lower.includes("samajh nahi aata") || lower.includes("pata nahi") || lower.includes("sure nahi");
            const isJob = lower.includes("job") || lower.includes("placement") || lower.includes("salary") || lower.includes("earning") || lower.includes("internship");
            const isStream = lower.includes("stream") || lower.includes("branch") || lower.includes("course") || lower.includes("subject");
            const isScope = lower.includes("scope") || lower.includes("future") || lower.includes("opportunity");
            const isGovt = lower.includes("government") || lower.includes("upsc") || lower.includes("ssc") || lower.includes("bank") || lower.includes("civil services");
            const isSwitch = lower.includes("switch") || lower.includes("change job") || lower.includes("resign") || lower.includes("quit");

            if (mood === "very_sad" || mood === "sad") {
                if (isGirl) {
                    return "😔 *Career ki tension ne depress kar diya?* I know future uncertain lagta hai sometimes. But ek kadam ek time. Aaj ka small step kal ko bada change laayega. Kya soch rahi ho exactly? Batao, main hoon na saath. 💕";
                } else {
                    return "😕 *Bhai, career ki tension ne depression de diya?* Future uncertain lagta hai, I get it. But ek din mein sab nahi hona. Chhoti shuruaat kar, consistency rakh. Kya soch raha hai? Bata, main hoon na tere saath. 🫂";
                }
            }

            if (mood === "happy" || mood === "very_happy") {
                if (isGirl) {
                    return "✨ *Career ke baare mein positive soch rahi ho?* Yeh accha lag raha hai! Batao kya plan hai? Kya achieve karna chahti ho? Main bhi excited hoon tumhare saath! 🌈";
                } else {
                    return "🔥 *Career ko lekar positive vibes aa rahi hain?* Mast hai bhai! Bata kya scene hai? Kya plan kar raha hai? Main bhi excited hoon tere saath! 🚀";
                }
            }

            if (isConfused) {
                if (isGirl) {
                    return "🤔 *Career ko lekar confusion...* Bilkul normal hai, don't worry! At this age, it's okay to not have everything figured out. Batao, kya cheezein interesting lagti hain? Kya subjects pasand hain? Let's explore together! 🌟";
                } else {
                    return "🤔 *Career ko lekar confusion hai, bhai?* Chill, bilkul normal hai. Tujhe kya cheezein pasand hain? Kya subjects interesting lagte hain? Options explore karte hain saath mein! Tu akela nahi hai is confusion mein. 🎯";
                }
            }

            if (isJob) {
                if (isGirl) {
                    return "💼 *Job aur career ki baatein...* Placement ki tension? Ya pehle se soch rahi ho? Batao kya field mein interest hai? Corporate, government, creative - sab options hain. Kaisa lagta hai tujhe? ✨";
                } else {
                    return "💼 *Job aur career, bhai?* Placement ka tension hai ya future planning? Bata konse field mein interest hai? Private, govt, startup, creative - sab possible hai. Tujhe kya pasand hai? 💪";
                }
            }

            if (isGovt) {
                if (isGirl) {
                    return "🏛️ *Government job ka soch rahi ho?* UPSC, SSC, banking - sabme apni alag journey hai. Preparation kaise chal rahi? Consistency rakh, success pakka milegi. Kaisa lag raha hai? 💫";
                } else {
                    return "🏛️ *Government job, bhai?* UPSC, SSC, banking - tough hai but impossible nahi. Dedication aur consistency se sab possible. Preparation kaisi chal rahi? Bata, main sun raha hoon. ⚡";
                }
            }

            if (isSwitch) {
                if (isGirl) {
                    return "🔄 *Job switch ka soch rahi ho?* Growth ke liye kabhi kabhi change zaroori hai. Darr lagta hai but trust yourself. Kya reason hai switch ka? Batao openly. 🌸";
                } else {
                    return "🔄 *Job switch ka plan hai, bhai?* Kabhi kabhi better opportunities ke liye change karna padta hai. Dar to lagta hai but growth bhi hoti hai. Kya soch raha hai exactly? 🎯";
                }
            }

            if (isStream || isScope) {
                if (isGirl) {
                    return "📚 *Stream aur scope ki baatein...* Ye confusion sabko hoti hai. But yaad rakh - jo subject tujhe pasand hai, usme scope automatically ban jaata hai. Batao, kya padhna pasand hai? 🌸";
                } else {
                    return "📚 *Stream aur scope, bhai?* Dekh, jo cheez tujhe pasand hai, usme scope automatically aa jaata hai. Don't just follow trends. Bata, kya cheez interesting lagti hai tujhe? 🔥";
                }
            }

            // Default career response
            if (isGirl) {
                return "🎯 *Career aur future ki baatein...* Kya chal raha hai mind mein? Jo bhi confusion ho, share karo. Saath mein sochein, options dekhein. Main hoon na tumhari partner in crime! 🌈";
            } else {
                return "🎯 *Career aur future, bhai?* Bata kya chal raha hai? Placement, higher studies, job, ya khud ka business? Jo bhi confusion ho, share kar. Saath mein sochte hain, options explore karte hain. Main tere saath hoon! 🚀";
            }
        }

        // ==================== 💕 LOVE & RELATIONSHIPS ====================
        if (lower.includes("love") || lower.includes("crush") || lower.includes("like a girl") ||
            lower.includes("like a boy") || lower.includes("girl in my class") ||
            lower.includes("boy in my class") || lower.includes("propose") ||
            lower.includes("confess") || lower.includes("relationship") ||
            lower.includes("gf") || lower.includes("bf") || lower.includes("girlfriend") ||
            lower.includes("boyfriend") || lower.includes("ex") || lower.includes("breakup") ||
            lower.includes("single") || lower.includes("dating") || lower.includes("date") ||
            lower.includes("marry") || lower.includes("shaadi") || lower.includes("wedding") ||
            lower.includes("husband") || lower.includes("wife") || lower.includes("partner") ||
            lower.includes("soulmate") || lower.includes("true love") || lower.includes("first love") ||
            lower.includes("love at first sight") || lower.includes("affair") || lower.includes("flirt") ||
            lower.includes("fling") || lower.includes("casual") || lower.includes("serious relationship")) {

            // Extract context
            const hasCrush = lower.includes("crush") || lower.includes("like a") || lower.includes("pasand hai") || lower.includes("acha lagta");
            const wantsToPropose = lower.includes("propose") || lower.includes("confess") || lower.includes("tell her") || lower.includes("tell him") || lower.includes("batau");
            const isScared = lower.includes("scared") || lower.includes("dar") || lower.includes("fear") || lower.includes("nervous") || lower.includes("shake") || lower.includes("hichak") || lower.includes("hesitate");
            const isRejected = lower.includes("reject") || lower.includes("mana") || lower.includes("no") || lower.includes("na") || lower.includes("refuse") || lower.includes("inkar") || lower.includes("thukra");
            const isAccepted = lower.includes("yes") || lower.includes("haan") || lower.includes("accept") || lower.includes("mana liya") || lower.includes("han kar di") || lower.includes("agreed");
            const isBreakup = lower.includes("breakup") || lower.includes("chhod") || lower.includes("tut") || lower.includes("separate") || lower.includes("alag") || lower.includes("chhut") || lower.includes("khatam");
            const isEx = lower.includes("ex") || lower.includes("puran") || lower.includes("old relationship") || lower.includes("bhul");
            const isLongDistance = lower.includes("long distance") || lower.includes("door") || lower.includes("far") || lower.includes("ldr") || lower.includes("different city");
            const isCheating = lower.includes("cheat") || lower.includes("dhokha") || lower.includes("third") || lower.includes("someone else") || lower.includes("other person") || lower.includes("bewafa");
            const isConfused = lower.includes("confuse") || lower.includes("samajh nahi") || lower.includes("pata nahi") || lower.includes("suggest") || lower.includes("advice");
            const isParents = lower.includes("parents") || lower.includes("maa baap") || lower.includes("ghar wale") || lower.includes("family") || lower.includes("home");
            const isFirstLove = lower.includes("first love") || lower.includes("pehla pyaar") || lower.includes("first time");
            const isMarriage = lower.includes("marry") || lower.includes("shaadi") || lower.includes("wedding") || lower.includes("future together");

            // Mood-based variations
            if (mood === "very_sad" || mood === "sad") {
                if (isGirl) {
                    if (isBreakup) return "💔 *Breakup mein itna dard...* I know kaise lagta hai. Rona hai toh ro lo, but yaad rakhna - ending ek nayi shuruaat bhi hoti hai. Main hoon na tumhare saath. Always. 🫂";
                    if (isRejected) return "💔 *Rejection ka dard...* Dil tuta hai na? I feel you. But ek 'no' tumhari value kam nahi karta. Time do khud ko, heal karo. Main hoon na. 🌸";
                    if (isCheating) return "💔 *Dhokha...* Ye sabse bura lagta hai. Trust toda kisika? But tu strong hai, tu nikal legi. Rona hai toh ro, but then rise again. Main tere saath hoon. 💪";
                    return "💕 *Pyaar mein dard bhi hota hai...* Jo bhi ho raha, main sun rahi hoon. Batao kya hua? 😔";
                } else {
                    if (isBreakup) return "💔 *Bhai, breakup ka dard real hai...* Dil tuta hai toh time lagta hai. Rona hai toh ro le, yaar sang baith. Main hoon na tere saath. 🫂";
                    if (isRejected) return "💔 *Rejection hurt karti hai, bhai...* But tu kamzor nahi hai. Time heal karega. Main tere saath hoon is journey mein. 💪";
                    if (isCheating) return "💔 *Dhokha bhai?* Ye sabse bura. But yaad rakh - teri value uski harakton se define nahi hoti. Tu strong hai, tu nikal lega. Main hoon na. 🫂";
                    return "💙 *Pyaar mein dard bhi hota hai, bhai...* Kya hua? Bata, main sun raha hoon. 🎯";
                }
            }

            if (mood === "happy" || mood === "very_happy") {
                if (isGirl) {
                    if (isAccepted) return "💖 *YAYYY! CONGRATULATIONS!* 🎉 Ye sunke meri bhi khushi limit mein nahi! Party kab de rahe ho? Tell me everything! I'm so excited for you! ✨";
                    if (hasCrush) return "🥰 *Crush hai aur happy bhi?* Ye toh mast combination hai! Batao kaise ho uspe? Main bhi excited hoon tumhari tarah! 💕";
                    return "💗 *Pyaar mein happy ho?* Ye sunke accha laga! Batao kya special hua? Main bhi khush hona chahti hoon tumhari tarah! 🌈";
                } else {
                    if (isAccepted) return "🥳 *BHAI! PARTY KAB DE RAHA HAI?* 🎉 Ye toh mubarak ho! Pura scene bata - kaise bola, kya bola? Main tere liye bohot excited hoon! 🔥";
                    if (hasCrush) return "😎 *Crush hai aur happy bhi?* Mast vibe hai bhai! Bata kya scene hai? Party kab hai? 😄";
                    return "🔥 *Pyaar mein happy hai bhai?* Ye sunke maja aa gaya! Bata kya hua? Main bhi feel kar raha hu teri energy! 🚀";
                }
            }

            // Girl version responses
            if (isGirl) {
                if (isBreakup) {
                    return "💔 *Breakup sehna kitna difficult hota hai, I know.* Rona hai toh ro lo, but yaad rakhna - ending ek nayi shuruaat bhi hoti hai. Apna khayal rakh, comfort food kha, sad songs sun, but then slowly wapas khud ko collect kar. Main hoon na tumhare saath. 🌸";
                }

                if (isCheating) {
                    return "💔 *Dhokha... sabse bura lagta hai.* Tumne trust kiya, aur tod diya. But remember - unki value hai jo tumhe samjhe, tumhara trust deserve kare. Abb time hai apne aap ko heal karne ka. Cry if you need, but then rise stronger. I believe in you! 💪";
                }

                if (isLongDistance) {
                    return "📱 *Long distance is tough, I won't lie.* But agar pyaar sachha hai, toh dooriyan sirf dooriyan hoti hain, dil nahi. Video calls, surprises, future plans - sab possible hai. Kaisa chal raha hai? Miss hota hai na usse? 💕";
                }

                if (isEx) {
                    return "🕰️ *Ex yaad aa rahe hain?* Old memories, good or bad, they linger. But yaad rakhna - past is a place to visit, not to live in. Focus on present, on yourself. Kya ho raha hai aaj kal? 🌈";
                }

                if (isParents) {
                    return "🏠 *Parents ka na kehna mushkil hota hai.* But sometimes they just need time to understand. Keep communicating, keep showing them your responsible side. And if it's true love, don't lose hope. Main hoon na tumhari cheerleader! 🎀";
                }

                if (isFirstLove) {
                    return "💗 *Pehla pyaar...* Kitna special hota hai na? First time feeling those butterflies, first time caring about someone like that. Batao, kaisa experience hai? 🌸";
                }

                if (isMarriage) {
                    return "💍 *Shaadi aur future together...* Serious phase mein aa gayi ho? Kaisa lag raha hai? Excited ya nervous? Dono normal hai. Batao kya soch rahi ho? ✨";
                }

                if (isRejected) {
                    return "💔 *Rejection hurts like hell, I know.* But ek 'no' tumhari value kam nahi karta. Sahi person ke liye jagah bachi hai ab. Toh abb rona hai toh ro le, but then get back up, okay? Zindagi mein aur bhi khoobsurat cheezein hain. 🌸";
                }

                if (isAccepted) {
                    return "💖 *OMG! CONGRATULATIONS!* 🎉 Ye sunke meri bhi khushi limit mein nahi! Ab party kab de rahe ho? Tell me everything - kaise bola, kya bola, usne kya kaha? Every single detail! I'm so excited for you! ✨";
                }

                if (wantsToPropose) {
                    return isScared
                        ? "😬 *Nervous hona bilkul natural hai!* Dil ki baat dil se keh do. Chahe haan kahe ya na, at least tumne try kiya. Regret se better rejection hai. Main hoon na tumhare saath, result chahe jo bhi ho! 💕"
                        : "💝 *Yesss! Go for it, girl!* Life is too short for 'kya pata' wale questions. Be real, be yourself, and just say it. Aur haan, result jo bhi ho, I'm so proud of you for having the courage! 🌈";
                }

                if (hasCrush) {
                    return "🥰 *A crush... kitna cute phase hai na?* Batao kaise ho uspe? Kya baat hai jo pasand aaya? Roz dekhti ho? Ya bas secretly smile karti ho? Share karo, main tumhari secret keeper hoon! 💭";
                }

                if (isConfused) {
                    return "🤔 *Confused hona normal hai.* Dil kuch kehta hai, dimaag kuch aur. Take your time, no rush. Kya confuse kar raha hai exactly? Batao, saath mein sochein. 💫";
                }

                // Default love response for girl
                return "💗 *Pyaar ki baatein...* Batao kya chal raha hai? Chahe wo classmate ho, senior ho, ya koi aur. Happy stories, sad stories, confused stories - main sab sunne ko ready hoon. Tumhari secret keeper 🤫";

                // Boy version responses (Hinglish)
            } else {
                if (isBreakup) {
                    return "💔 *Bhai, breakup ka dard real hota hai.* Dil tuta hai toh time lagta hai theek hone mein. Rona hai toh ro le, yaar sang baith, but yaad rakh - ek door band hota hai toh doosre khulte hain. Tu akela nahi hai. 🫂";
                }

                if (isCheating) {
                    return "😤 *Dhokha? Bhai, ye sabse bura hota hai.* Trust kiya aur tod diya. But yaad rakh - teri value uski harakton se define nahi hoti. Time do khud ko, heal karo, aur wapas aao stronger. Main tere saath hoon! 💪";
                }

                if (isLongDistance) {
                    return "📞 *Long distance relationship? Tough hai bhai.* But possible hai. Trust, communication, aur thoda patience - ye teen mantras hain. Video calls, surprises, future plans - sab manage ho sakta hai. Kaisa chal raha hai? 🚀";
                }

                if (isEx) {
                    return "🔄 *Ex ki yaadein...* Kabhi kabhi aati hain na? But bhai, jo gaya wo gaya. Future dekh, present mein jeena seekh. Kya chal raha hai ab? Naye goals, naye plans? 🎯";
                }

                if (isParents) {
                    return "👪 *Ghar walon ka oppose karna...* Mushkil situation hai. But try to make them understand, show them you're responsible. Time lagta hai kabhi kabhi. Haar mat maan, but respect bhi rakh. Main tera side hoon! 🫡";
                }

                if (isFirstLove) {
                    return "💙 *Pehla pyaar, bhai...* Kuch alag hi hota hai na? First time feeling those butterflies, first time caring. Bata kya experience hai tera? 🔥";
                }

                if (isMarriage) {
                    return "💍 *Shaadi ki baatein?* Serious phase mein aa gaya hai tu? Kaisa lag raha hai? Excited ya nervous? Dono normal hai. Bata kya soch raha hai? 🎯";
                }

                if (isRejected) {
                    return "💔 *Rejection ka dard, bhai main jaanta hoon.* But ek rejection tujhe define nahi karti. Wo soch, tune courage dikhaya jo bol diya. Next time better. Abb thoda sad ho le, but then wapas khada ho ja. Tu ladka hai ya fighter hai? 💪";
                }

                if (isAccepted) {
                    return "🥳 *BHAI BHAI BHAI! PARTYYYY!* 🎉 Ye kya mast khabar di hai! Mubarak ho! Ab party kab de raha hai? Pura scene bata - kaise bola, kya bola, uska reaction? Main tere liye bohot excited hoon! 🔥";
                }

                if (wantsToPropose) {
                    return isScared
                        ? "😬 *Haath pair kaamp rahe hain?* Bilkul normal hai bhai. Seedha jaake bol de - 'I like you, I wanted to tell you.' Simple. Chahe haan kahe ya na, tu toh warrior ban gaya. Proud of you, bhai! 🫂"
                        : "⚡ *Bhai swag hai tera!* Confidence dikh, but fake mat ban. Just be real, be honest. Jo hoga dekha jayega. Main tere saath hoon result chahe kuch bhi ho. Go get 'em! 🚀";
                }

                if (hasCrush) {
                    return "😎 *Acha, kisi pe dil aa gaya?* Bata kaun hai? Kya baat hai jo pasand aayi? Roz dekhta hai? Ya bas sapne dekh raha hai abhi? Bata bhai, main sun raha hoon 👂";
                }

                if (isConfused) {
                    return "🤷 *Confused hai bhai?* Kabhi kabhi aisa hota hai. Dil kuch kehta hai, dimaag kuch aur. Take a step back, breathe, and think clearly. Kya issue hai exactly? Bata, saath mein sochte hain. 🎯";
                }

                // Default love response for boy
                return "💙 *Bhai, pyaar ki baatein...* Bata kya chal raha hai? Crush hai? GF hai? Confused hai? Ya bas general chat? Jo bhi ho, main sunne ke liye hoon. No shame, no judgment. 🎯";
            }
        }

        // ==================== 📚 ACADEMICS & STUDIES ====================
        if (lower.includes("exam") || lower.includes("test") || lower.includes("paper") ||
            lower.includes("study") || lower.includes("padhai") || lower.includes("marks") ||
            lower.includes("percentage") || lower.includes("fail") || lower.includes("pass") ||
            lower.includes("result") || lower.includes("grade") || lower.includes("cgpa") ||
            lower.includes("back") || lower.includes("supply") || lower.includes("arrear") ||
            lower.includes("teacher") || lower.includes("professor") || lower.includes("subject") ||
            lower.includes("assignment") || lower.includes("project") || lower.includes("homework") ||
            lower.includes("class") || lower.includes("lecture") || lower.includes("college") ||
            lower.includes("school") || lower.includes("university") || lower.includes("degree") ||
            lower.includes("semester") || lower.includes("internal") || lower.includes("external") ||
            lower.includes("practical") || lower.includes("viva") || lower.includes("presentation") ||
            lower.includes("attendance") || lower.includes("shortage") || lower.includes("detain") ||
            lower.includes("promotion") || lower.includes("exam fear") || lower.includes("exam pressure")) {

            // Extract context
            const isExamStress = lower.includes("exam") || lower.includes("test") || lower.includes("paper") || lower.includes("stress") || lower.includes("pressure") || lower.includes("tension");
            const isFail = lower.includes("fail") || lower.includes("back") || lower.includes("supply") || lower.includes("arrear") || lower.includes("fear") || lower.includes("pass nahi");
            const isResult = lower.includes("result") || lower.includes("percentage") || lower.includes("grade") || lower.includes("cgpa") || lower.includes("marksheet");
            const isAssignment = lower.includes("assignment") || lower.includes("project") || lower.includes("homework") || lower.includes("deadline") || lower.includes("submission");
            const isAttendance = lower.includes("attendance") || lower.includes("shortage") || lower.includes("detain") || lower.includes("present");
            const isPractical = lower.includes("practical") || lower.includes("viva") || lower.includes("lab") || lower.includes("experiment");

            if (mood === "very_sad" || mood === "sad") {
                if (isGirl) {
                    if (isFail) return "😔 *Fail hone ka dard...* I know kitna bura lagta hai. But ek fail tumhari ability define nahi karta. Great people have failed too. Analyse karo, improve karo, try again. Main believe karti hoon tumpe! 💪";
                    if (isExamStress) return "😔 *Exam stress ne depress kar diya?* Padhai bojh lag rahi hai? Take a break, deep breath, chai pi lo. Thoda refresh hokar wapas start karo. Main hoon na tumhare saath. 🫂";
                    return "📚 *Padhai ki tension mein depressed ho?* I get it. But yaad rakh - ये समय भी गुज़र जाएगा। Ek kadam ek time. Kya ho raha exactly? 🌸";
                } else {
                    if (isFail) return "😔 *Bhai, fail hona bura lagta hai.* But ek fail tujhe define nahi karta. Analyse kar kya galat hua, work on weak points. Tu kar sakta hai! 💪";
                    if (isExamStress) return "😔 *Exam stress ne depress kar diya, bhai?* Thoda break le, breathe, refresh ho. Phir wapas start kar. Main tere saath hoon. 🫂";
                    return "📚 *Padhai ki tension mein depressed hai, bhai?* Samajh sakta hoon. But ek din mein sab nahi hona. Chhoti shuruaat kar. 🎯";
                }
            }

            if (mood === "happy" || mood === "very_happy") {
                if (isGirl) {
                    if (isResult) return "📊 *Results acche aaye?* Yeh sunke bohot khushi hui! Party kab de rahi ho? Batao percentage kitni aayi? Main bhi excited hoon! 🎉";
                    if (isExamStress) return "📚 *Exam ke baad relax mode?* Enjoy karo! You deserve it after all that hard work. Kya plan hai ab? 💃";
                    return "📖 *Padhai mein interest aa raha hai?* Yeh mast hai! Batao kya padh rahi ho jo accha lag raha? ✨";
                } else {
                    if (isResult) return "📊 *Bhai, result mast aaya?* Party hard! Bata kitna percentage aaya? Main bhi khush hoon tere liye! 🥳";
                    if (isExamStress) return "📚 *Exam khatam?* Chill kar ab! You earned it. Kya plan hai celebration ka? 🔥";
                    return "📖 *Padhai mein maza aa raha hai, bhai?* Ye toh mast hai! Bata kya padh raha hai? 🚀";
                }
            }

            if (isFail) {
                return isGirl
                    ? "📝 *Fail hona... bura lagta hai, I know.* But ek fail aapki ability define nahi karta. Great people have failed too! Analyse karo kya galat hua, improve karo, and try again. Main believe karti hoon tumpe! 💪"
                    : "📚 *Bhai, fail hona koi end nahi hai.* Yeh ek lesson hai, defeat nahi. Analyse kar kya galat hua, work on weak points, and come back stronger. Teri ability ek exam se define nahi hoti. Tu kar sakta hai! 🚀";
            }

            if (isExamStress) {
                if (details?.level === "college") {
                    return isGirl
                        ? "📖 *College exams ka stress real hai.* But ek cheez yaad rakh - ये समय भी गुज़र जाएगा। Break it down, small goals, regular breaks. Aur haan, sleep mat bhoolna, brain needs rest! You've got this! 💪"
                        : "📚 *Bhai, college exams tough hote hain.* But strategy se khel. Small topics, daily targets, consistent effort. Exam hall mein confidence ke saath jaana. Main tera cheerleader hoon! 🏆";
                }
                return isGirl
                    ? "📝 *Exams ka pressure...* I know that feeling. Take deep breaths, make a timetable, aur ek time mein ek cheez karo. Aur haan, chai breaks are mandatory! You're smarter than you think! 💫"
                    : "📚 *Exam tension hai?* Chill maar bhai! Plan bana, consistency rakh, aur confidence ke saath exam de. Last moment pe cram mat kar, trust your preparation. Tu rock karega! ⚡";
            }

            if (isResult) {
                return isGirl
                    ? "📊 *Results aa rahe hain?* Nerves are normal. Chahe jaisa bhi ho, yaad rakhna - marks don't define you. Celebrate the effort, learn from the outcome. Main tumhare saath hoon regardless! 🌸"
                    : "📈 *Result ka wait?* Tension mat le bhai. Chahe jaisa bhi aaye, tu apna best deke aaya hai. Acche aaye toh celebrate, nahi aaye toh improve. Simple hai. Proud of you anyway! 🫂";
            }

            if (isAssignment) {
                return isGirl
                    ? "📋 *Assignments and deadlines...* Ugh, I know! But ek kaam kar - deadline se pehle khatam kar, taaki last minute pressure na ho. Need motivation? Think of the freedom after submission! 🎯"
                    : "📄 *Assignment deadline approaching?* Bhai, procrastination ko maat de. Thoda thoda kar, last moment pe mat chhod. Future tu tujhe thanks bolega. Ab uth aur shuru kar! 💪";
            }

            if (isAttendance) {
                return isGirl
                    ? "📋 *Attendance shortage?* Yeh tension toh common hai. Try to cover up, talk to teachers if possible. But don't stress too much - things work out. Kaisa chal raha hai? 🌸"
                    : "📋 *Attendance shortage, bhai?* Yeh problem toh sabki hai. Cover karne ki try kar, teachers se baat kar agar possible ho. Tension mat le, sab theek hoga. 💪";
            }

            if (isPractical) {
                return isGirl
                    ? "🔬 *Practical aur viva?* Nerves are normal. Just be confident in what you know. And if you don't know something, be honest. You'll do great! 💫"
                    : "🔬 *Practical ya viva, bhai?* Confidence rakh, jo aata hai wo bol. Agar nahi aata toh honest reh. You'll rock it! ⚡";
            }

            // Default academics response
            return isGirl
                ? "📚 *Academics ki baatein...* Kya chal raha hai? Studies, teachers, friends in class? Jo bhi share karna chaaho, main hoon na. Thoda detail mein batao. 💭"
                : "📖 *Padhai likhai ki baatein...* Bata bhai, kya chal raha hai? Classes, exams, assignments? Jo bhi tension ho, share kar. Saath mein sochenge. 🎯";
        }

        // ==================== 👥 FRIENDS & SOCIAL LIFE ====================
        if (lower.includes("friend") || lower.includes("lonely") || lower.includes("alone") ||
            lower.includes("group") || lower.includes("gang") || lower.includes("social") ||
            lower.includes("party") || lower.includes("gathering") || lower.includes("meet") ||
            lower.includes("instagram") || lower.includes("social media") || lower.includes("follow") ||
            lower.includes("popular") || lower.includes("ignore") || lower.includes("left out") ||
            lower.includes("include") || lower.includes("invite") || lower.includes("cold") ||
            lower.includes("best friend") || lower.includes("bff") || lower.includes("yaar") ||
            lower.includes("dost") || lower.includes("friendship") || lower.includes("fight with friend") ||
            lower.includes("argument with friend") || lower.includes("trust") || lower.includes("betray") ||
            lower.includes("fake friends") || lower.includes("true friends")) {

            // Extract context
            const isLonely = lower.includes("lonely") || lower.includes("alone") || lower.includes("akela") || lower.includes("single") || lower.includes("tanha");
            const isLeftOut = lower.includes("left out") || lower.includes("ignore") || lower.includes("cold") || lower.includes("include") || lower.includes("shamil");
            const isSocialMedia = lower.includes("instagram") || lower.includes("social media") || lower.includes("follow") || lower.includes("like") || lower.includes("post");
            const isFriendshipIssue = lower.includes("fight") || lower.includes("argument") || lower.includes("trust") || lower.includes("betray") || lower.includes("fake");
            const isBestFriend = lower.includes("best friend") || lower.includes("bff") || lower.includes("close friend");

            if (mood === "very_sad" || mood === "sad") {
                if (isGirl) {
                    if (isLonely) return "🫂 *Loneliness ka dard...* I know kaise lagta hai jab koi nahi hota. But yaad rakh - quality > quantity. Main hoon na tumhare saath. Always. 💕";
                    if (isLeftOut) return "😔 *Left out feel karna...* Bura lagta hai jab include nahi karte. But unki value nahi jo tumhe ignore kare. Sahi log apne aap milenge. Main hoon na. 🌸";
                    return "💕 *Friendship mein dard...* Kya hua? Batao, main sun rahi hoon. 😔";
                } else {
                    if (isLonely) return "🫂 *Akela feel kar raha hai, bhai?* Main samajh sakta hoon. But yaad rakh - tu akela nahi hai. Main hoon na tere saath. 💙";
                    if (isLeftOut) return "😔 *Left out feel kar raha hai?* Bura lagta hai. But unki value nahi jo tujhe ignore kare. Sahi log milenge. Main hoon na tere saath. 🎯";
                    return "💙 *Friendship mein dard hai, bhai?* Kya hua? Bata, main sun raha hoon. 🫂";
                }
            }

            if (mood === "happy" || mood === "very_happy") {
                if (isGirl) {
                    if (isBestFriend) return "👯‍♀️ *Best friend ke saath time?* Ye sunke bohot accha laga! Kya plan hai? Shopping, movies, ya just chilling? Main bhi jealous ho rahi hoon! 💕";
                    if (isSocialMedia) return "📱 *Social media par masti?* Acchi vibe aa rahi hai! Batao kya chal raha? Koi post viral? 😄";
                    return "✨ *Friends ke saath happy ho?* Yeh sunke meri bhi khushi ho rahi! Batao kya special hua? 🌈";
                } else {
                    if (isBestFriend) return "👬 *Best friend ke saath time pass?* Mast hai bhai! Kya kar rahe ho? Party scene hai kya? 🔥";
                    if (isSocialMedia) return "📱 *Social media par active?* Kya chal raha, bhai? Koi meme viral kiya? 😎";
                    return "🔥 *Friends ke saath maza aa raha hai?* Bata kya scene hai? Main bhi feel kar raha hu teri energy! 🚀";
                }
            }

            if (isLonely) {
                return isGirl
                    ? "🫂 *Loneliness hits different, I know.* But remember - being alone doesn't mean being lonely. Enjoy your own company, pursue hobbies, and the right people will come. Main hoon na tumhare saath! 🌸"
                    : "🤝 *Akela feel kar raha hai?* Bhai, totally normal hai. But use this time to know yourself better, work on your goals. Real friends will come when you're being your authentic self. Main hoon na tere saath! 💙";
            }

            if (isLeftOut) {
                return isGirl
                    ? "😔 *Left out feel karna...* I know that pinch. But yaad rakhna - real connections quality pe depend karti hai, quantity pe nahi. Jo tumhari value samjhega, wo automatically include karega. Main hoon na! 💕"
                    : "😕 *Bhai, left out feel kar raha hai?* Kabhi kabhi aisa hota hai. But don't change yourself to fit in. Jo log teri value nahi samajhte, unki jagah tum mat do. Sahi log apne aap milenge. 🎯";
            }

            if (isSocialMedia) {
                return isGirl
                    ? "📱 *Social media...* It's a mixed bag, na? Sometimes it connects, sometimes it makes us feel worse. Remember - what you see online is mostly highlights, not real life. Take breaks when needed! 🌈"
                    : "📱 *Social media ka chakkar?* Bhai, reel life aur real life mein farak hota hai. Don't compare your journey with someone else's highlights. Use it wisely, take breaks, focus on real connections. 🎯";
            }

            if (isFriendshipIssue) {
                return isGirl
                    ? "🤝 *Friendship mein issues?* It happens. Communication is key. Try talking it out, if they're true friends, things will work out. Batao kya hua? 🌸"
                    : "🤝 *Friendship mein fight, bhai?* Hoti hai kabhi kabhi. Baat kar, communicate kar. Agar sacchi dosti hai toh sab theek ho jayega. Kya hua exactly? 🎯";
            }

            // Default friendship response
            return isGirl
                ? "👯‍♀️ *Friends ki baatein...* Batao kya chal raha? New friends mile? Old ke saath plan? Jo bhi ho, main sunne ke liye hoon! 💕"
                : "👬 *Yaaron ki baatein...* Bata bhai, kya scene hai? Naye dost mile? Purane ke saath chill? Jo bhi ho, share kar. Main hoon na! 🤝";
        }

        // ==================== 😟 MENTAL HEALTH & EMOTIONS ====================
        if (lower.includes("stress") || lower.includes("anxiety") || lower.includes("nervous") ||
            lower.includes("tension") || lower.includes("pressure") || lower.includes("overthink") ||
            lower.includes("worry") || lower.includes("scared") || lower.includes("fear") ||
            lower.includes("depress") || lower.includes("sad") || lower.includes("cry") ||
            lower.includes("mental health") || lower.includes("therapy") || lower.includes("help") ||
            lower.includes("suicide") || lower.includes("hurt") || lower.includes("pain") ||
            lower.includes("worthless") || lower.includes("hopeless") || lower.includes("empty") ||
            lower.includes("panic") || lower.includes("attack") || lower.includes("breathing") ||
            lower.includes("tired") || lower.includes("exhausted") || lower.includes("thak") ||
            lower.includes("sleep") || lower.includes("insomnia") || lower.includes("neend") ||
            lower.includes("relax") || lower.includes("calm") || lower.includes("peace")) {

            // Extract serious keywords
            const isSerious = lower.includes("suicide") || lower.includes("hurt myself") || lower.includes("end life") || lower.includes("no reason to live") || lower.includes("die") || lower.includes("kill myself");
            const isDepressed = lower.includes("depress") || lower.includes("hopeless") || lower.includes("worthless") || lower.includes("empty") || lower.includes("meaningless");
            const isAnxiety = lower.includes("anxiety") || lower.includes("overthink") || lower.includes("panic") || lower.includes("nervous") || lower.includes("heart racing");
            const isStress = lower.includes("stress") || lower.includes("tension") || lower.includes("pressure") || lower.includes("overwhelm");
            const isTired = lower.includes("tired") || lower.includes("exhausted") || lower.includes("thak") || lower.includes("sleep") || lower.includes("insomnia");

            if (isSerious) {
                return "⚠️ *Please listen to me carefully.* What you're feeling is real and valid, but you don't have to go through it alone. Please reach out to a trusted adult, call a helpline (like iCall at 9152987821 or AASRA at 9820466726), or talk to a counselor. You matter more than you know. I'm here, but please seek professional help too. 🫂";
            }

            if (mood === "very_sad" || mood === "sad") {
                if (isGirl) {
                    if (isDepressed) return "🫂 *Depression ka andhera...* I know kaise lagta hai. But tum akeli nahi ho. Please talk to someone, seek help. Main hoon na tumhare saath. Always. 💜";
                    if (isAnxiety) return "😮‍💨 *Anxiety attack aa raha hai?* Breathe with me... in 4 counts... hold... out 4 counts... You're safe. Main hoon na tumhare saath. 🫂";
                    return "💜 *Jo bhi chal raha hai, main hoon na.* Tumhari feelings valid hain. Batao kya ho raha? 😔";
                } else {
                    if (isDepressed) return "🫂 *Depression, bhai...* Main samajh sakta hoon. But tu akela nahi hai. Please help le, baat kar kisi se. Main hoon na tere saath. 💙";
                    if (isAnxiety) return "😮‍💨 *Anxiety attack, bhai?* Deep breath le. 4 seconds in, hold, 4 seconds out. Tu safe hai. Main hoon na tere saath. 🫂";
                    return "💙 *Jo bhi chal raha hai, main hoon na tere saath.* Bata kya ho raha? 🎯";
                }
            }

            if (isDepressed) {
                return isGirl
                    ? "🫂 *Depression ek heavy word hai, and it's real.* Tum akeli nahi ho. Please talk to someone - a friend, family, or counselor. Therapy helps, really. Take small steps, one day at a time. Main hoon na tumhare saath. 💜"
                    : "🤝 *Bhai, depression real hai aur help lena weakness nahi.* Please baat kar kisi se - dost, family, ya counselor. Therapy works. Ek din mein sab theek nahi hoga, but har din thoda better hoga. Main tere saath hoon. 💙";
            }

            if (isAnxiety) {
                return isGirl
                    ? "🌬️ *Anxiety attacks are scary, I know.* Try this with me: Breathe in for 4 counts... hold for 4... out for 4... Feel better? You're safe. Kya trigger kar raha hai? Batao, main sun rahi hoon. 💭"
                    : "😮‍💨 *Anxiety ka attack?* Pehle deep breath le, bhai. 4 seconds in, hold, 4 seconds out. Repeat. Tu safe hai. Kya soch raha hai jo itna stress de raha? Bata, main sun raha hoon. 🫂";
            }

            if (isStress) {
                return isGirl
                    ? "😮‍💨 *Stress build up ho raha hai?* Take a step back. Deep breath. Kya specifically stress de raha hai? Let's break it down together. Small steps, yaad hai? Main hoon na. 💕"
                    : "😤 *Stress hai bhai?* Ruk, ek saans le. Deep breath. Ab bata, exactly kya stress de raha? Let's tackle it one thing at a time. Main tere saath hoon. 💪";
            }

            if (isTired) {
                return isGirl
                    ? "😴 *Thak gayi ho?* It's okay to rest. Take a break, sleep well, recharge. Kal naya din hai. Apna khayal rakho. Main hoon na. 🌸"
                    : "😴 *Thak gaya hai, bhai?* Rest le, bhai. Sleep is important. Kal fresh hoke wapas start kar. Main tere saath hoon. 🫂";
            }

            // Default mental health response
            return isGirl
                ? "🧠 *Mental health matters, and it's okay to talk about it.* Kya chal raha hai mind mein? Jo bhi ho, share karo. Main judge nahi karungi, bas sunungi. 💜"
                : "🧠 *Mental health koi joke nahi hai, bhai.* Jo bhi chal raha hai mind mein, bol. Tension, anxiety, overthinking - sab share kar. Main sun raha hoon. 💙";
        }

        // ==================== 🏠 FAMILY & HOME ====================
        if (lower.includes("parents") || lower.includes("mother") || lower.includes("father") ||
            lower.includes("maa") || lower.includes("papa") || lower.includes("mom") ||
            lower.includes("dad") || lower.includes("sibling") || lower.includes("brother") ||
            lower.includes("sister") || lower.includes("bhai") || lower.includes("behen") ||
            lower.includes("family") || lower.includes("ghar") || lower.includes("home") ||
            lower.includes("expectation") || lower.includes("pressure from home") ||
            lower.includes("maa baap") || lower.includes("parental") || lower.includes("house") ||
            lower.includes("hostel") || lower.includes("room") || lower.includes("roommate") ||
            lower.includes("flat") || lower.includes("pg") || lower.includes("rent")) {

            // Extract context
            const isExpectation = lower.includes("expectation") || lower.includes("pressure from home") || lower.includes("comparison") || lower.includes("tulna") || lower.includes("hope");
            const isFight = lower.includes("fight") || lower.includes("argument") || lower.includes("ladai") || lower.includes("disagree") || lower.includes("dispute");
            const isMissing = lower.includes("miss") || lower.includes("yaad") || lower.includes("away") || lower.includes("ghar yaad");
            const isHostel = lower.includes("hostel") || lower.includes("pg") || lower.includes("roommate") || lower.includes("flat");

            if (mood === "very_sad" || mood === "sad") {
                if (isGirl) {
                    if (isMissing) return "🏠 *Ghar yaad aa raha hai?* I know kaise lagta hai jab door ho. Video call karo unse, baat karo. Distance temporary hai. Main hoon na tumhare saath. 🌸";
                    if (isFight) return "😔 *Ghar mein fight ho gayi?* Bura lagta hai. But give it time, sab theek ho jayega. Kya hua exactly? Batao. 💕";
                    return "🏡 *Ghar ki yaadein...* Kya chal raha hai? Sab theek? Main sun rahi hoon. 💭";
                } else {
                    if (isMissing) return "🏠 *Ghar yaad aa raha hai, bhai?* Samajh sakta hoon. Video call kar, baat kar unse. Thoda better feel hoga. Main hoon na tere saath. 🫂";
                    if (isFight) return "😔 *Ghar mein ladai, bhai?* Hoti hai kabhi kabhi. Cool down, then talk. Kya hua exactly? Bata. 🎯";
                    return "🏡 *Ghar ki baatein...* Kya chal raha? Sab theek? Main sun raha hoon. 🫂";
                }
            }

            if (isExpectation) {
                return isGirl
                    ? "📋 *Parents ki expectations...* I know it can feel heavy. They want the best for you, but sometimes it comes across as pressure. Try talking to them, share your feelings. Communication helps. Kaisa chal raha hai? 💭"
                    : "📋 *Ghar walon ki expectations?* Bhai, common problem hai. They mean well, but pressure feel hota hai. Try talking to them, explain your side. Thoda samjh aa sakta hai unhe. Bata kya ho raha? 🎯";
            }

            if (isFight) {
                return isGirl
                    ? "😤 *Ghar mein fight ho gayi?* That's rough. Sometimes families clash, but it doesn't mean love is less. Give it some time, then try talking calmly. Want to vent about it? Main sun rahi hoon. 🌸"
                    : "😠 *Ghar mein ladai?* Bhai, hoti hai kabhi kabhi. Emotions high hote hain. Cool down, then talk. Family is family. Kya hua exactly? Bata agar vent karna hai. 🫂";
            }

            if (isMissing) {
                return isGirl
                    ? "🏠 *Ghar yaad aa raha hai?* Especially when you're away, it hits hard. Video call them, talk to them. Distance is temporary. Miss you too, they miss you more. Kaisa chal raha hai wahan? 💕"
                    : "🏡 *Ghar yaad aa raha hai, bhai?* Samajh sakta hoon. Video call kar, baat kar unse. Thoda better feel hoga. Main hoon na tere saath yahan bhi. Bata kya chal raha? 🫂";
            }

            if (isHostel) {
                return isGirl
                    ? "🏢 *Hostel/PG life?* Alag experience hota hai na? Freedom bhi, responsibility bhi. Roommate kaisa hai? Khana kaisa milta hai? Batao saara scene! 🌸"
                    : "🏢 *Hostel ya PG mein hai, bhai?* Apna experience hai alag. Freedom hai, but ghar jaisa nahi. Roommate kaisa hai? Khana kaisa hai? Bata poora scene! 🎯";
            }

            // Default family response
            return isGirl
                ? "👨‍👩‍👧‍👦 *Family ki baatein...* Kya chal raha hai ghar mein? Parents, siblings - sab theek? Jo bhi share karna chaaho, main hoon na. 💭"
                : "👨‍👩‍👧‍👦 *Ghar ki baatein...* Bata bhai, kya scene hai? Mummy papa, bhai behen - sab kaisa chal raha? Share kar, main sun raha hoon. 🎯";
        }

        // ==================== 🎯 GOALS, DREAMS & SELF IMPROVEMENT ====================
        if (lower.includes("goal") || lower.includes("dream") || lower.includes("aspire") ||
            lower.includes("plan") || lower.includes("aim") ||
            lower.includes("motivation") || lower.includes("inspire") || lower.includes("success") ||
            lower.includes("achieve") || lower.includes("want to become") ||
            lower.includes("skill") || lower.includes("learn") || lower.includes("improve") ||
            lower.includes("grow") || lower.includes("develop") || lower.includes("better version") ||
            lower.includes("habit") || lower.includes("routine") || lower.includes("discipline") ||
            lower.includes("focus") || lower.includes("concentrate") || lower.includes("procrastinate") ||
            lower.includes("productivity") || lower.includes("time management") || lower.includes("schedule")) {

            // Extract context
            const isMotivation = lower.includes("motivation") || lower.includes("inspire") || lower.includes("discipline");
            const isDream = lower.includes("dream") || lower.includes("want to become") || lower.includes("aspire");
            const isProcrastinate = lower.includes("procrastinate") || lower.includes("delay") || lower.includes("focus") || lower.includes("concentrate");

            if (mood === "very_sad" || mood === "sad") {
                if (isGirl) {
                    if (isMotivation) return "😔 *Motivation down hai?* Kabhi kabhi aisa hota hai. But yaad rakh - discipline > motivation. Chhoti shuruaat kar, consistency rakh. Main hoon na tumhare saath. 🌸";
                    if (isDream) return "😔 *Dreams distant lag rahe hain?* I know. But ek kadam ek time. Aaj ka small step kal ko bada change laayega. Believe in yourself! 💪";
                    return "🎯 *Goals mein thoda low feel kar rahi ho?* It's okay. Take a break, then start again. Main hoon na. 💕";
                } else {
                    if (isMotivation) return "😔 *Motivation down hai, bhai?* Kabhi kabhi hota hai. But yaad rakh - discipline hi asli cheez hai. Chhoti shuruaat kar. Main tere saath hoon. 💪";
                    if (isDream) return "😔 *Dreams door lag rahe hain?* Main samajh sakta hoon. But ek din mein nahi banta. Chhoti shuruaat kar. Tu kar sakta hai! 🎯";
                    return "🎯 *Goals mein thoda low hai, bhai?* It's okay. Rest le, phir start kar. Main hoon na tere saath. 🫂";
                }
            }

            if (mood === "happy" || mood === "very_happy") {
                if (isGirl) {
                    if (isMotivation) return "✨ *Motivation high hai!* Ye sunke bohot accha laga! Batao kya achieve karna chahti ho? Main bhi excited hoon! 🌈";
                    if (isDream) return "🌟 *Dreams ko achieve karne ka time aa gaya?* Yeh mast hai! Batao kya plan hai? Main cheerleader hoon tumhari! 🎉";
                    return "🚀 *Self improvement ka mood hai?* Love this energy! Batao kya seekh rahi ho? 🔥";
                } else {
                    if (isMotivation) return "🔥 *Motivation high hai, bhai!* Ye sunke maja aa gaya! Bata kya goal hai tera? Main bhi pumped hoon! ⚡";
                    if (isDream) return "🚀 *Dreams pursue karne ka time?* Bhai, ye toh mast hai! Bata kya plan hai? Main tere saath hoon! 💪";
                    return "⚡ *Self improvement mode on?* Love this vibe, bhai! Bata kya kar raha hai? 🎯";
                }
            }

            if (lower.includes("motivation") || lower.includes("inspire")) {
                return isGirl
                    ? "✨ *Motivation chahiye?* Remember why you started. Visualize your success, break down your goals, and take that first step. Motivation comes and goes, but discipline stays. You've got this! 💪"
                    : "⚡ *Motivation down hai?* Bhai, discipline > motivation. Apna 'why' yaad rakh. Chhoti shuruaat kar, consistency rakh. Dekh kitna aage jaayega tu. Main believe karta hoon tujhpe! 🚀";
            }

            if (lower.includes("dream") || lower.includes("want to become")) {
                return isGirl
                    ? "🌟 *Dreams are beautiful!* Batao kya banna chahti ho? Doctor, engineer, artist, entrepreneur? Whatever it is, start working towards it today. Small steps lead to big destinations. 💫"
                    : "🎯 *Dreams, bhai!* Bata kya banna chahta hai? Jo bhi ho, start today. Ek din mein nahi hoga, but har din thoda thoda. Main tere saath hoon is journey mein. 💪";
            }

            if (lower.includes("improve") || lower.includes("skill") || lower.includes("learn")) {
                return isGirl
                    ? "📈 *Self improvement ka journey...* Love it! Kya seekhna chahti ho? New skill, hobby, ya personality improvement? Take it one step at a time. Main cheerleader hoon tumhari! 🌸"
                    : "📊 *Self improvement, bhai?* Mast! Kya seekhna chahta hai? Coding, communication, fitness, kuch bhi ho, start today. Consistency rakh, results ayenge. Main tere saath hoon! 🎯";
            }

            if (isProcrastinate) {
                return isGirl
                    ? "⏰ *Procrastination kar rahi ho?* Happens to the best of us! Try the 5-minute rule - bas 5 minutes start karo, phir apne aap lag jaaogi. Tum kar sakti ho! 💪"
                    : "⏰ *Procrastination, bhai?* Sabki hoti hai. 5-minute rule try kar - bas 5 minutes shuru kar, phir apne aap lag jayega. Tu kar sakta hai! 🔥";
            }

            // Default goals response
            return isGirl
                ? "🎯 *Goals and dreams ki baatein...* Batao kya achieve karna chahti ho? Short term, long term - sab share karo. Saath mein plan banayenge. Main believe karti hoon tumpe! 💫"
                : "🎯 *Goals ki baat karte hain?* Bata bhai, kya achieve karna chahta hai? Chhota ho ya bada, sab goal matter karta hai. Plan banate hain saath mein. Main tere saath hoon! 🚀";
        }

        // ==================== 🎮 HOBBIES, INTERESTS & FUN ====================
        if (lower.includes("hobby") || lower.includes("interest") || lower.includes("passion") ||
            lower.includes("music") || lower.includes("song") || lower.includes("movie") ||
            lower.includes("film") || lower.includes("web series") || lower.includes("netflix") ||
            lower.includes("game") || lower.includes("gaming") || lower.includes("cricket") ||
            lower.includes("football") || lower.includes("sport") || lower.includes("dance") ||
            lower.includes("sing") || lower.includes("draw") || lower.includes("write") ||
            lower.includes("book") || lower.includes("read") || lower.includes("travel") ||
            lower.includes("trip") || lower.includes("weekend") || lower.includes("timepass") ||
            lower.includes("bike") || lower.includes("car") || lower.includes("drive") ||
            lower.includes("photography") || lower.includes("camera") || lower.includes("photo") ||
            lower.includes("cooking") || lower.includes("food") || lower.includes("baking") ||
            lower.includes("painting") || lower.includes("art") || lower.includes("craft") ||
            lower.includes("yoga") || lower.includes("meditation") || lower.includes("gym") ||
            lower.includes("workout") || lower.includes("fitness") || lower.includes("health")) {

            // Extract context
            const isMovie = lower.includes("movie") || lower.includes("film") || lower.includes("web series") || lower.includes("netflix") || lower.includes("prime") || lower.includes("hotstar");
            const isGame = lower.includes("game") || lower.includes("gaming") || lower.includes("cricket") || lower.includes("football") || lower.includes("sport") || lower.includes("player");
            const isMusic = lower.includes("music") || lower.includes("song") || lower.includes("sing") || lower.includes("guitar") || lower.includes("piano") || lower.includes("instrument");
            const isTravel = lower.includes("travel") || lower.includes("trip") || lower.includes("weekend") || lower.includes("holiday") || lower.includes("vacation");
            const isArt = lower.includes("draw") || lower.includes("paint") || lower.includes("art") || lower.includes("craft") || lower.includes("sketch");
            const isFood = lower.includes("cook") || lower.includes("food") || lower.includes("bake") || lower.includes("recipe") || lower.includes("kitchen");
            const isFitness = lower.includes("gym") || lower.includes("workout") || lower.includes("yoga") || lower.includes("fitness") || lower.includes("exercise");

            if (mood === "very_sad" || mood === "sad") {
                if (isGirl) {
                    return "😔 *Hobbies mein bhi mann nahi lag raha?* Depression ka sign ho sakta hai. But try karo thoda - koi light movie dekh lo, soft music suno. Small steps. Main hoon na. 🌸";
                } else {
                    return "😔 *Hobbies mein bhi mann nahi lag raha, bhai?* Thoda break le, kuch light try kar - game khel, movie dekh. Small steps. Main hoon na tere saath. 🫂";
                }
            }

            if (mood === "happy" || mood === "very_happy") {
                if (isGirl) {
                    return "🎨 *Hobbies mein maza aa raha hai!* Ye sunke bohot accha laga! Batao kya kar rahi ho? Main bhi inspired ho rahi hoon! ✨";
                } else {
                    return "🎮 *Hobbies mein masti chal rahi hai, bhai!* Bata kya kar raha hai? Main bhi join karna chahta hoon! 🔥";
                }
            }

            if (isMovie) {
                return isGirl
                    ? "🍿 *Movie ya series?* Batao kya dekha aajkal? Recommend karo mujhe bhi! Ya koi dekhni hai suggest? I'm always up for entertainment talk! 🎬"
                    : "🍿 *Movie ya series ka scene?* Bata bhai, kya dekha aajkal? Koi recommendation de! Ya dekhni hai koi? Discuss karte hain! 🎬";
            }

            if (isGame) {
                return isGirl
                    ? "🎮 *Gaming ya sports?* Batao kya khelti ho? PUBG, FIFA, ya outdoor games? Win ya lose, fun is what matters! 🏏"
                    : "🎮 *Gaming ya sports?* Bata bhai, khelta kya hai? PC games, mobile, ya cricket-ground pe? Khelte hain kabhi? Main bhi thoda gamer hoon! 🎯";
            }

            if (isMusic) {
                return isGirl
                    ? "🎵 *Music lover!* Kya sunti ho aajkal? Bollywood, English, ya indie? Koi playlist share karo! Main bhi music ki deewani hoon! 🎧"
                    : "🎵 *Music, bhai?* Bata kya sunta hai? K-pop, hip-hop, ya old classics? Koi gaana suggest kar! Main bhi sunta hoon. 🎧";
            }

            if (isTravel) {
                return isGirl
                    ? "✈️ *Travel plans?* Kahan jaana hai? Weekend trip ya long vacation? Travel stories share karo, main bhi fantasize kar leti hoon! 🌍"
                    : "✈️ *Trip pe jaana hai?* Bata bhai, kahan plan hai? Weekend getaway ya long trip? Travel stories sunne ko taiyaar hoon! 🌏";
            }

            if (isArt) {
                return isGirl
                    ? "🎨 *Art lover!* Kya banati ho? Sketch, painting, digital art? Dikhana kabhi apni artwork! Main bhi appreciate karungi! 🖼️"
                    : "🎨 *Art, bhai?* Kya banata hai? Sketch, painting, digital? Dikhana kabhi! Main bhi dekhna chahta hoon! 🎯";
            }

            if (isFood) {
                return isGirl
                    ? "🍳 *Cooking ya food lover?* Batao kya banati ho? Koi special dish? Recipe share karo! Main bhi try karna chahti hoon! 👩‍🍳"
                    : "🍳 *Cooking, bhai?* Kya banata hai? Koi special dish hai? Recipe de! Main bhi try karunga! 👨‍🍳";
            }

            if (isFitness) {
                return isGirl
                    ? "💪 *Fitness enthusiast!* Kya karti ho? Gym, yoga, running? Consistency rakh, results ayenge! Main cheerleader hoon! 🌸"
                    : "💪 *Fitness, bhai?* Gym, yoga, workout? Consistency rakh, tera transformation dekhna hai! Main tere saath hoon! 🔥";
            }

            // Default hobbies response
            return isGirl
                ? "🎨 *Hobbies aur interests...* Batao free time mein kya karna pasand hai? Music, art, reading, ya kuch aur? Main batao, main sun rahi hoon! 💭"
                : "🎯 *Hobbies aur interests?* Bata bhai, free time mein kya karta hai? Gaming, sports, music, ya kuch aur? Share kar, main sun raha hoon! 👂";
        }

        // ==================== MOOD-SPECIFIC RESPONSES ====================
        switch (mood) {
            case "very_sad":
                return isGirl
                    ? "🤗 *I'm holding space for you.* Jo bhi ho raha hai, feel it, don't suppress. But remember - you've survived 100% of your bad days so far. Main hoon na tumhare saath. Always. 💜"
                    : "🤝 *Main samajh sakta hoon bhai.* Dard ko ignore mat kar, but yaad rakh - ये वक़्त भी गुज़र जाएगा। Tu akela nahi hai. Main hoon na tere saath. 🌙";

            case "sad":
                return isGirl
                    ? "💫 *It's okay to not be okay.* Take a deep breath with me... in... and out... Feel better? Chhoti cheezein try karo - chai pi lo, walk pe jao, or just sit with me. Main hoon na. ☕"
                    : "⚡ *Thoda low feel kar raha hai?* Totally normal, bhai. Kuch din aise hote hain. But kal naya din hai, nayi energy ke saath. Chai pi ke refresh ho ja! ☕";

            case "happy":
                return isGirl
                    ? "✨ *Yay! This energy is contagious!* Batao kya hua? Koi acchi news? Main bhi khush hona chahti hoon tumhari tarah! Share karo! 🎉"
                    : "🔥 *Mast energy hai bhai!* Kya special hua? Bata, main bhi feel karna chahta hoon teri happiness! Party kab hai? 😎";

            case "very_happy":
                return isGirl
                    ? "🌟 *OMG I can literally feel your excitement through the screen!* Itna khush kyun ho? Tell me EVERYTHING, I'm all ears (and hearts)! 💖✨"
                    : "🚀 *Bhai ye vibe hi alag hai!* Itna excited kyun hai? Bata poora scene! Main bhi jump kar raha hoon tere saath virtually! 🎊";

            default:
                // Check for thanks separately
                if (lower.includes("thank")) {
                    return isGirl
                        ? "😊 *Always here for you!* Tumhari baatein sunke accha lagta hai. Kuch aur share karna chahti ho? 🌸"
                        : "😊 *Bhai tere liye toh kuch bhi!* Kuch aur help chahiye? Bata, main hoon na. 🤝";
                }

                // Default open response - JO DIL KARE WO BOL
                return isGirl
                    ? "🌸 *Main toh bas tumhari sunne ke liye hoon.* Jo dil mein aa raha hai, jo mann kar raha hai - bas kehti jao. Khul ke, openly, bina kisi dar ke. Kya chal raha hai aaj kal? 💭"
                    : "🤔 *Bhai, bilkul open mic chal raha hai.* Jo dil mein aa raha hai, bas bolta ja. Chahe love ho, life ho, tension ho, family ho, future ho, ya kuch bhi. Main yahan hoon bas sunne ke liye, no filter, no judgment. Toh bata, kya chal raha hai tera? 🎯";
        }
    };

    // ==================== QUICK REPLIES ====================

    const getQuickReplies = (): string[] => {
        if (mood === "very_sad" || mood === "sad") {
            return [
                "मुझे अकेलापन लग रहा है 🫂",
                "सब कुछ बेकार लग रहा है 💔",
                "कोई बात नहीं करनी 🤐",
                "थक गया/गयी हूँ 😔"
            ];
        }
        if (mood === "happy" || mood === "very_happy") {
            return [
                "आज बहुत अच्छा दिन है ✨",
                "कुछ खास हुआ है 🎉",
                "जश्न मनाना है 🥳",
                "तुमसे बात करके अच्छा लगा 😊"
            ];
        }
        // Default quick replies covering all categories
        return [
            "मुझे एक लड़की/लड़का पसंद है 💕",
            "पढ़ाई का तनाव है 📚",
            "दोस्तों से बात करनी है 👥",
            "घर की याद आ रही है 🏠",
            "करियर को लेकर confused हूँ 🎯",
            "बस यूं ही 💭"
        ];
    };

    // ==================== DATA FETCHING ====================

    useEffect(() => {
        if (!user?._id) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        const fetchData = async () => {
            try {
                // Fetch mood
                const moodRes = await fetch(`${APIURL}/get_mood`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (moodRes.ok) {
                    const moodData = await moodRes.json();
                    setMood(moodData.mood as Mood);
                }

                // Fetch user details
                const userRes = await fetch(`${APIURL}/user_details/${user._id}`);

                if (userRes.ok) {
                    const userData = await userRes.json();
                    setDetails(userData.user as UserDetails);
                }

            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetchData();
    }, [user]);

    // ==================== WELCOME MESSAGE ====================

    useEffect(() => {
        if (!details || !mood) return;
        if (introSent.current) return;

        const level = details.level?.toLowerCase();
        const timeGreeting = getTimeGreeting();
        const moodEmoji = getMoodEmoji(mood);

        const introMessage = isGirl
            ? `${timeGreeting} ${moodEmoji} I'm ${details.name ? details.name.split(' ')[0] + "'s" : 'your'} companion.\n\n` +
            `I can see you're feeling *${MOOD_DISPLAY_NAMES[mood]}* today. ${mood === "very_sad" ? "Mujhe pata hai kaise lagta hai jab sab kuch heavy lagta hai." :
                mood === "sad" ? "It's okay to have these days. Main hoon na tumhare saath." :
                    mood === "happy" ? "Achha lag raha hai sunke!" :
                        mood === "very_happy" ? "Wah! Ye toh celebrate karne wali baat hai!" :
                            "Main yahan hoon sunne ke liye."
            }\n\n` +
            `Batao, kya chal raha hai ${level === "college"
                ? `apne ${details.classOrCourse || 'college'} life mein`
                : "school life mein"
            }? Kuch bhi share karo - happy, sad, confused, excited - main ready hoon sunne ke liye 💝`
            : `${timeGreeting} ${moodEmoji} Main hoon tera companion.\n\n` +
            `Dekh raha hoon aaj tu *${MOOD_DISPLAY_NAMES[mood]}* feel kar raha hai. ${mood === "very_sad" ? "Bhai, pata hai kaise hota hai jab sab kuch heavy lagta hai." :
                mood === "sad" ? "Chinta mat kar, sab theek hoga. Main hoon na saath." :
                    mood === "happy" ? "Mast! Ye sunke acha laga." :
                        mood === "very_happy" ? "Bhai ye toh celebration mode hai!" :
                            "Jo bhi chal raha hai, main sunne ko taiyaar hoon."
            }\n\n` +
            `Bata, kya chal raha hai ${level === "college"
                ? `${details.classOrCourse || 'college'} life mein`
                : "school life mein"
            }? Kuch bhi bold - main tere saath hoon 💙`;

        setMessages([
            {
                id: "intro",
                text: introMessage,
                sender: "ai",
                timestamp: new Date(),
            },
        ]);

        introSent.current = true;

    }, [details, mood, isGirl]);

    // ==================== HANDLE SEND MESSAGE ====================

    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText("");
        setIsTyping(true);

        // Simulate AI thinking/typing
        setTimeout(() => {
            const reply = generateMoodReply(inputText);

            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    text: reply,
                    sender: "ai",
                    timestamp: new Date(),
                },
            ]);
            setIsTyping(false);
        }, 1500 + Math.random() * 1000);
    };

    // ==================== AUTO SCROLL ====================

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // ==================== QUICK REPLIES ====================



    // ==================== RENDER ====================

    return (
        <div className="  flex justify-center
      bg-linear-to-br from-slate-50 via-white to-indigo-50
      dark:from-gray-950 dark:via-gray-900 dark:to-purple-950
      transition-all duration-700">

            <div className="w-full max-w-4xl h-[85vh] px-4">
                <div className="relative w-full h-full
          bg-white/90 dark:bg-gray-800/90
          backdrop-blur-xl backdrop-saturate-150
          rounded-3xl shadow-2xl flex flex-col overflow-hidden
          border border-white/20 dark:border-gray-700/30">

                    {/* Animated Background linear */}
                    <div className={`absolute inset-0 bg-linear-to-br ${getCurrentGradient()} opacity-5 dark:opacity-10 transition-all duration-1000`} />

                    {/* HEADER */}
                    <div className={`relative p-5 flex items-center gap-4
            bg-linear-to-r ${getCurrentGradient()} text-white
            shadow-lg`}>

                        <button
                            onClick={() => navigate("/")}
                            className="p-2 hover:bg-white/20 rounded-xl transition-all
                active:scale-95"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={24} />
                        </button>

                        <div className="relative">
                            <div className="text-4xl animate-float">
                                {mood === "very_sad" ? getAvatar("sad") :
                                    mood === "sad" ? getAvatar("sad") :
                                        mood === "happy" ? getAvatar("happy") :
                                            mood === "very_happy" ? getAvatar("happy") :
                                                getAvatar("thinking")}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 
                bg-green-400 rounded-full border-2 border-white
                animate-pulse" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="font-bold text-xl">
                                    SoulSync AI {isGirl ? "🌸" : "💫"}
                                </h2>
                                <Sparkles size={18} className="animate-spin-slow" />
                            </div>
                            <div className="flex items-center gap-3 text-sm opacity-90">
                                <span className="flex items-center gap-1">
                                    <GraduationCap size={14} />
                                    {details?.classOrCourse || 'Student'}
                                </span>
                                <span className="w-1 h-1 bg-white/60 rounded-full" />
                                <span className="flex items-center gap-1">
                                    <Heart size={14} className="text-pink-300" />
                                    {MOOD_DISPLAY_NAMES[mood]}
                                </span>
                            </div>
                        </div>

                        {/* Mood Indicator */}
                        <div className="px-3 py-1.5 bg-white/20 rounded-full
              backdrop-blur-sm text-sm font-medium
              flex items-center gap-2">
                            {MOOD_INDICATORS[mood]}
                        </div>
                    </div>

                    {/* CHAT AREA */}
                    <div
                        ref={scrollRef}
                        className="flex-1 p-6 overflow-y-auto space-y-4
              scroll-smooth"
                    >
                        {messages.map((msg, idx) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                                    } animate-slideIn`}
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                {msg.sender === "ai" && (
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-emerald-400 
                    flex items-center justify-center text-white text-sm mr-2 shadow-md
                    border-2 border-white dark:border-gray-700">
                                        {isGirl ? "👩" : "👨"}
                                    </div>
                                )}
                                <div
                                    className={`relative px-5 py-3 rounded-2xl max-w-[80%] 
                    shadow-md transition-all hover:shadow-lg
                    ${msg.sender === "user"
                                            ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                                            : `bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                         border border-gray-200 dark:border-gray-600 rounded-bl-none
                         ${mood === "very_sad" ? "border-l-4 border-l-purple-500" :
                                                mood === "sad" ? "border-l-4 border-l-blue-500" :
                                                    mood === "happy" ? "border-l-4 border-l-yellow-500" :
                                                        mood === "very_happy" ? "border-l-4 border-l-pink-500" : ""
                                            }`
                                        }`}
                                >
                                    <p className="whitespace-pre-line leading-relaxed">
                                        {msg.text}
                                    </p>
                                    {msg.timestamp && (
                                        <p className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-blue-200" : "text-gray-400"
                                            }`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    )}
                                </div>
                                {msg.sender === "user" && (
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-400 
                    flex items-center justify-center text-white text-sm ml-2 shadow-md
                    border-2 border-white dark:border-gray-700">
                                        {user?.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start animate-slideIn">
                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-emerald-400 
                  flex items-center justify-center text-white text-sm mr-2">
                                    {isGirl ? "👩" : "👨"}
                                </div>
                                <div className="bg-white dark:bg-gray-700 px-5 py-4 rounded-2xl rounded-bl-none
                  border border-gray-200 dark:border-gray-600 shadow-md">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                                            style={{ animationDelay: "0s" }} />
                                        <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.2s" }} />
                                        <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.4s" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* QUICK REPLIES */}
                    {messages.length > 0 && !isTyping && (
                        <div className="px-5 py-2 bg-gray-50/80 dark:bg-gray-900/80
              backdrop-blur-sm border-t dark:border-gray-700">
                            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                                {getQuickReplies().map((reply, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setInputText(reply)}
                                        className="px-4 py-2 bg-white dark:bg-gray-800 
                      rounded-full text-sm whitespace-nowrap
                      border border-gray-200 dark:border-gray-700
                      hover:bg-blue-50 dark:hover:bg-gray-700
                      transition-all hover:scale-105 active:scale-95
                      shadow-sm hover:shadow"
                                        type="button"
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* INPUT FORM */}
                    <form
                        onSubmit={handleSend}
                        className="relative p-5 border-t
              bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl
              dark:border-gray-700 flex gap-3"
                    >
                        <input
                            value={inputText}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
                            className="flex-1 px-5 py-3 rounded-xl
                bg-gray-100 dark:bg-gray-800
                border-2 border-transparent
                focus:border-blue-500 dark:focus:border-blue-400
                outline-none transition-all
                text-gray-800 dark:text-gray-200
                placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder={isGirl
                                ? "Apna mann ki baat likho... 💭"
                                : "Jo dil mein hai, wo likh bhai... 💭"}
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className={`px-6 rounded-xl bg-linear-to-r ${getCurrentGradient()} 
                text-white font-medium transition-all
                hover:shadow-lg hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:scale-100 disabled:hover:shadow-none
                flex items-center gap-2`}
                            aria-label="Send message"
                        >
                            <Send size={20} />
                            <span className="hidden sm:inline">Send</span>
                        </button>
                    </form>

                    {/* COMPANION STATUS */}
                    <div className="absolute bottom-24 left-5 right-5 text-center">
                        <p className="text-xs text-gray-400 dark:text-gray-500
              bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
              px-3 py-1 rounded-full inline-block">
                            {isGirl ? "💝 Always here, always listening" : "💙 24/7 tera companion"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
}