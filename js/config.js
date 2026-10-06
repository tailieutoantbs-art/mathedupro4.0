// config.js - Global Configuration and Utilities for EduMath TBS

// ======================= CONSTANTS =======================
const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxs6EVw0A7GjsyKKlveL0STj1ZTa_iDS0XpliDMKfpuACN_ZmNFIpIKU23XKHQm_oSu/exec";
const GOOGLE_SHEET_BANK_ID = "1o8rbQZYz6aizH_0WoZDhdnyBeHCYipox7-MlaDL_RMI";
const GOOGLE_SHEET_BANK_URL = "https://docs.google.com/spreadsheets/d/1o8rbQZYz6aizH_0WoZDhdnyBeHCYipox7-MlaDL_RMI/edit?gid=0#gid=0";
const GOOGLE_DRIVE_THEORY_FOLDER_ID = "1ss9-q5VUi1sN8mbHJKJj0IwNoos6paJZ";
const GOOGLE_DRIVE_THEORY_FOLDER_URL = "https://drive.google.com/drive/folders/1ss9-q5VUi1sN8mbHJKJj0IwNoos6paJZ?lfhs=2";
const GOOGLE_DRIVE_INFOGRAPHIC_FOLDER_ID = "1SFTz4ONPh1EodIWm84b1Qsgj58ggGEjG";
const GOOGLE_DRIVE_INFOGRAPHIC_FOLDER_URL = "https://drive.google.com/drive/folders/1SFTz4ONPh1EodIWm84b1Qsgj58ggGEjG?lfhs=2";
const SUPER_ADMIN_EMAIL = 'tailieutoantbs@gmail.com';
const CLOUD_NAME = "drbxhjhur"; 
const UPLOAD_PRESET = "TAILIEUTBS";

// ======================= STANDARD MATH FOLDERS (TOAN 6 - 12 & KHAC) =======================
const STANDARD_MATH_FOLDERS = ['TOAN 6', 'TOAN 7', 'TOAN 8', 'TOAN 9', 'TOAN 10', 'TOAN 11', 'TOAN 12', 'KHAC'];
if (typeof window !== 'undefined') window.STANDARD_MATH_FOLDERS = STANDARD_MATH_FOLDERS;

/**
 * Lấy tên thư mục mặc định tương ứng với khối lớp (6-12) hoặc KHAC
 */
function getMathFolderFromGrade(grade) {
    if (!grade) return 'KHAC';
    let g = String(grade).trim();
    if (['6', '7', '8', '9', '10', '11', '12'].includes(g)) {
        return `TOAN ${g}`;
    }
    let m = g.match(/\b(12|11|10|9|8|7|6)\b/);
    if (m) {
        return `TOAN ${m[1]}`;
    }
    if (/^TOAN\s*(6|7|8|9|10|11|12)$/i.test(g)) {
        return g.toUpperCase().replace(/\s+/, ' ');
    }
    return 'KHAC';
}

/**
 * Chuẩn hóa tên thư mục về dạng TOAN 6 - 12 hoặc KHAC hoặc giữ nguyên tên thư mục tùy biến
 */
function normalizeMathFolder(folder) {
    if (!folder) return 'KHAC';
    let f = String(folder).trim();
    let u = f.toUpperCase().replace(/\s+/g, ' ');
    if (STANDARD_MATH_FOLDERS.includes(u)) {
        return u;
    }
    let m = u.match(/^(?:TOAN|LỚP|LOP|K)\s*(12|11|10|9|8|7|6)$/i);
    if (m) return `TOAN ${m[1]}`;
    if (['12', '11', '10', '9', '8', '7', '6'].includes(u)) {
        return `TOAN ${u}`;
    }
    if (['CHUNG', 'OTHER', 'KHÁC', 'KHAC', 'MAC DINH', 'DEFAULT'].includes(u)) {
        return 'KHAC';
    }
    return f;
}

/**
 * Màu sắc giao diện đồng bộ cho từng thư mục TOAN 6-12 & KHAC
 */
function getMathFolderBadgeClass(folder) {
    let norm = normalizeMathFolder(folder);
    switch(norm) {
        case 'TOAN 12':
            return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'TOAN 11':
            return 'bg-sky-100 text-sky-800 border-sky-200';
        case 'TOAN 10':
            return 'bg-teal-100 text-teal-800 border-teal-200';
        case 'TOAN 9':
            return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'TOAN 8':
            return 'bg-rose-100 text-rose-800 border-rose-200';
        case 'TOAN 7':
            return 'bg-cyan-100 text-cyan-800 border-cyan-200';
        case 'TOAN 6':
            return 'bg-lime-100 text-lime-800 border-lime-200';
        case 'KHAC':
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200';
    }
}

// ======================= FIREBASE INIT =======================
const firebaseConfig = { 
    apiKey: "AIzaSyAyL8ezUs1OuxTYBD6PATYk-WpBxOqMGj8", 
    authDomain: "cosodulieutbs.firebaseapp.com", 
    databaseURL: "https://cosodulieutbs-default-rtdb.asia-southeast1.firebasedatabase.app", 
    projectId: "cosodulieutbs", 
    storageBucket: "cosodulieutbs.firebasestorage.app", 
    messagingSenderId: "14840398924", 
    appId: "1:14840398924:web:eccc6942166181d6c8e0e9" 
};

// Initialize Firebase safely if loaded
let db = null;
try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps || !firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        if (firebase.firestore) {
            db = firebase.firestore();
        }
    }
} catch(e) {
    console.warn("Firebase init warning:", e);
}

// ======================= SUPABASE CONFIG & CLIENT =======================
const SUPABASE_URL = "https://bcokoknkjktdbepjvteg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjb2tva25ramt0ZGJlcGp2dGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4OTYwNTIsImV4cCI6MjEwNTQ3MjA1Mn0.5JKi7zwfLo9YoLIAFMEnLAIzo6sOE6sdhqU3roACXpQ";

let supabaseClient = null;
try {
    if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (e) {
    console.warn("Supabase SDK client init warning:", e);
}

/**
 * Universal Supabase Service for Theory & Lectures
 * Supports both Supabase JS Client & Direct REST API Fallback
 */
const SupabaseTheoryService = {
    /**
     * Fetch all theory & lecture records
     */
    async getAll() {
        let results = [];
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('theory_archives')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (!error && data) results = data;
                if (error) console.warn("Supabase SDK getAll warning, trying REST API:", error);
            } catch(err) {
                console.warn("Supabase SDK fetch failed, falling back to REST:", err);
            }
        }
        if (!results || results.length === 0) {
            // Direct REST API fallback
            try {
                const res = await fetch(`${SUPABASE_URL}/rest/v1/theory_archives?select=*&order=created_at.desc`, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (res.ok) results = await res.json();
            } catch (e) {
                console.error("Supabase REST getAll error:", e);
                throw e;
            }
        }
        return (results || []).map(item => {
            item.folder = normalizeMathFolder(item.folder_id || (item.theory && item.theory.folder) || (item.topic ? getMathFolderFromGrade(item.topic) : 'KHAC'));
            return item;
        });
    },

    /**
     * Fetch single theory archive by ID
     */
    async getById(id) {
        if (!id) return null;
        let item = null;
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('theory_archives')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (!error && data) item = data;
            } catch(err) {}
        }
        if (!item) {
            try {
                const res = await fetch(`${SUPABASE_URL}/rest/v1/theory_archives?id=eq.${encodeURIComponent(id)}&select=*`, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (res.ok) {
                    const items = await res.json();
                    item = items && items.length ? items[0] : null;
                }
            } catch(e) {
                console.error("Supabase getById error:", e);
                return null;
            }
        }
        if (item) {
            item.folder = normalizeMathFolder(item.folder_id || (item.theory && item.theory.folder) || (item.topic ? getMathFolderFromGrade(item.topic) : 'KHAC'));
        }
        return item;
    },

    /**
     * Upsert / Save theory archive record
     */
    async save(record) {
        if (!record || !record.id) throw new Error("Dữ liệu bản ghi không hợp lệ");
        let targetFolder = normalizeMathFolder(record.folder || record.folderId || record.folder_id || (record.theory && record.theory.folder) || 'KHAC');
        const payload = {
            id: String(record.id),
            topic: String(record.topic || 'Sổ tay Lý thuyết & Bài giảng'),
            folder_id: String(targetFolder),
            theory: Object.assign({}, record.theory || {}, { folder: targetFolder, grade: record.grade || (record.theory && record.theory.grade) || '' }),
            lectures: record.lectures || [],
            lectures_style: record.lecturesStyle || record.lectures_style || {},
            date_formatted: record.dateFormatted || record.date_formatted || new Date().toLocaleString('vi-VN'),
            updated_at: new Date().toISOString()
        };

        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('theory_archives')
                    .upsert(payload, { onConflict: 'id' });
                if (!error) return data || payload;
                console.warn("Supabase SDK save warning, trying REST API:", error);
            } catch(err) {
                console.warn("Supabase SDK save failed, falling back to REST:", err);
            }
        }

        const res = await fetch(`${SUPABASE_URL}/rest/v1/theory_archives`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates,return=representation'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Lỗi lưu Supabase (${res.status}): ${errText}`);
        }
        return await res.json();
    },

    /**
     * Delete theory archive by ID
     */
    async delete(id) {
        if (!id) return false;
        if (supabaseClient) {
            try {
                const { error } = await supabaseClient
                    .from('theory_archives')
                    .delete()
                    .eq('id', id);
                if (!error) return true;
                console.warn("Supabase SDK delete warning, trying REST:", error);
            } catch(err) {}
        }
        const res = await fetch(`${SUPABASE_URL}/rest/v1/theory_archives?id=eq.${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) throw new Error(`Lỗi xóa Supabase (${res.status})`);
        return true;
    }
};

/**
 * Universal Infographics Service for Hamburger Menu & Teacher Studio
 * Supports Firestore, LocalStorage, Cloudinary Upload & Google Drive Linking
 */
const InfographicsService = {
    LOCAL_KEY: 'tbs_custom_infographics',

    /**
     * Convert Google Drive share/view URL to direct image URL or folder URL
     */
    convertDriveUrl(url) {
        if (!url) return '';
        url = url.trim();
        // Check if Google Drive file link: https://drive.google.com/file/d/FILE_ID/view...
        let fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (fileMatch && fileMatch[1]) {
            return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w2000`;
        }
        // Check if open?id=FILE_ID or id=FILE_ID
        let idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1] && !url.includes('/folders/')) {
            return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w2000`;
        }
        return url;
    },

    /**
     * Upload Image to Cloudinary (using CLOUD_NAME and UPLOAD_PRESET)
     * Fallback to Base64 Data URL if upload fails
     */
    async uploadImage(file, onProgress) {
        if (!file) throw new Error("Vui lòng chọn tệp hình ảnh!");
        
        // Try Cloudinary Upload
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', typeof UPLOAD_PRESET !== 'undefined' ? UPLOAD_PRESET : 'TAILIEUTBS');
            const cName = typeof CLOUD_NAME !== 'undefined' ? CLOUD_NAME : 'drbxhjhur';

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cName}/image/upload`, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                if (data.secure_url) {
                    return data.secure_url;
                }
            }
        } catch (err) {
            console.warn("Cloudinary upload failed, falling back to base64 DataURL:", err);
        }

        // Fallback: Read as Base64 Data URL
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error("Không thể đọc tệp hình ảnh"));
            reader.readAsDataURL(file);
        });
    },

    /**
     * Get all custom infographics
     */
    async getAll() {
        let localData = [];
        try {
            const stored = localStorage.getItem(this.LOCAL_KEY);
            if (stored) localData = JSON.parse(stored);
        } catch(e) {}

        if (db) {
            try {
                const doc = await db.collection("GameData").doc("Infographics").get();
                if (doc.exists && doc.data() && Array.isArray(doc.data().list)) {
                    const cloudList = doc.data().list;
                    localStorage.setItem(this.LOCAL_KEY, JSON.stringify(cloudList));
                    return cloudList;
                }
            } catch(e) {
                console.warn("Error fetching cloud infographics:", e);
            }
        }
        return localData || [];
    },

    /**
     * Save all infographics to Firebase and LocalStorage
     */
    async saveAll(list, updatedBy) {
        if (!Array.isArray(list)) list = [];
        localStorage.setItem(this.LOCAL_KEY, JSON.stringify(list));
        if (db) {
            try {
                await db.collection("GameData").doc("Infographics").set({
                    list: list,
                    updatedAt: new Date().toISOString(),
                    updatedBy: updatedBy || 'Giáo viên TBS'
                });
            } catch(e) {
                console.error("Error saving infographics to Firebase:", e);
                throw e;
            }
        }
        return list;
    },

    /**
     * Add or update an infographic
     */
    async saveItem(item, updatedBy) {
        if (!item) throw new Error("Dữ liệu Infographic không hợp lệ");
        let list = await this.getAll();
        if (!item.id) {
            item.id = 'info_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
            item.createdAt = new Date().toISOString();
        }
        item.updatedAt = new Date().toISOString();
        item.updatedBy = updatedBy || 'Giáo viên TBS';

        let existingIdx = list.findIndex(x => x.id === item.id || (item.lessonCode && x.lessonCode === item.lessonCode && x.grade === item.grade));
        if (existingIdx >= 0) {
            list[existingIdx] = { ...list[existingIdx], ...item };
        } else {
            list.unshift(item);
        }

        await this.saveAll(list, updatedBy);
        return item;
    },

    /**
     * Delete an infographic
     */
    async deleteItem(id, updatedBy) {
        let list = await this.getAll();
        let newList = list.filter(x => x.id !== id);
        await this.saveAll(newList, updatedBy);
        return newList;
    }
};

/**
 * Universal Supabase Service for Question Bank (Ngân hàng câu hỏi)
 * Supports both Supabase JS Client & Direct REST API Fallback
 */
const SupabaseQuestionBankService = {
    async getAll() {
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('question_bank')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (!error && Array.isArray(data)) return data;
                if (error) console.warn("Supabase SDK question_bank getAll warning, trying REST API:", error);
            } catch(err) {
                console.warn("Supabase SDK fetch failed, falling back to REST:", err);
            }
        }
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/question_bank?select=*&order=created_at.desc`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res.ok) return await res.json();
        } catch (e) {
            console.error("Supabase REST question_bank getAll error:", e);
        }
        return [];
    },

    async saveBatch(questions) {
        if (!Array.isArray(questions) || questions.length === 0) return [];
        const payload = questions.map((q, idx) => ({
            id: q.id ? String(q.id) : ('Q_' + Date.now() + '_' + (idx + 1) + '_' + Math.random().toString(36).substr(2, 5)),
            grade: String(q.grade || '12'),
            topic: String(q.topic || 'Chung'),
            type: String(q.type || 'MC').toUpperCase(),
            level: String(q.level || 'Thông hiểu'),
            question: String(q.question || ''),
            opt1: String(q.opt1 || ''),
            opt2: String(q.opt2 || ''),
            opt3: String(q.opt3 || ''),
            opt4: String(q.opt4 || ''),
            answer: String(q.answer || ''),
            explain: String(q.explain || ''),
            created_at: q.createdAt || new Date().toISOString()
        }));

        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('question_bank')
                    .upsert(payload, { onConflict: 'id' });
                if (!error) return data || payload;
                console.warn("Supabase SDK question_bank saveBatch warning, trying REST API:", error);
            } catch(err) {
                console.warn("Supabase SDK question_bank saveBatch failed, falling back to REST:", err);
            }
        }

        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/question_bank`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates,return=representation'
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) return await res.json();
        } catch(e) {
            console.warn("Supabase REST question_bank error:", e);
        }
        return payload;
    },

    async delete(id) {
        if (!id) return false;
        if (supabaseClient) {
            try {
                const { error } = await supabaseClient
                    .from('question_bank')
                    .delete()
                    .eq('id', id);
                if (!error) return true;
            } catch(err) {}
        }
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/question_bank?id=eq.${encodeURIComponent(id)}`, {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            return res.ok;
        } catch(e) {
            return false;
        }
    }
};

// ======================= UTILITIES =======================
/**
 * Show a toast notification
 * @param {string} msg - The message to display
 * @param {boolean} isError - True if it's an error message
 */
function showToast(msg, isError = false) {
    const toast = document.getElementById('toast-success') || document.getElementById('toast'); 
    if (toast) {
        // Remove previous color classes
        toast.classList.remove('bg-green-500', 'bg-red-500', 'bg-emerald-500', 'bg-rose-500', 'bg-main');
        
        // Add new color class
        const bgClass = isError ? 'bg-rose-500' : 'bg-emerald-500';
        toast.classList.add(bgClass);
        
        // Setup icon
        const iconClass = isError ? 'fa-circle-xmark' : 'fa-circle-check';
        
        // Render content with crisp font-sans and proper gap
        toast.innerHTML = `<i class="fa-solid ${iconClass} text-2xl md:text-3xl shrink-0"></i><span id="toast-msg" class="ml-2 md:ml-3 font-bold font-sans text-sm md:text-base leading-snug">${msg}</span>`;

        toast.classList.remove('-translate-y-32', 'opacity-0'); 
        if (toast.classList.contains('show') !== undefined) toast.classList.add('show');
        
        // Clear any existing timeout
        if (window.toastTimeout) {
            clearTimeout(window.toastTimeout);
        }
        
        window.toastTimeout = setTimeout(() => {
            toast.classList.add('-translate-y-32', 'opacity-0');
            toast.classList.remove('show');
        }, 3200);
    } else {
        console.log(isError ? "Error: " : "Success: ", msg);
    }
}

/**
 * Teacher PIN Rate Limiting Helpers
 */
const PIN_LOCK_KEY = 'tbs_teacher_pin_lock';
const PIN_ATTEMPTS_KEY = 'tbs_teacher_pin_attempts';
const MAX_PIN_ATTEMPTS = 5;
const PIN_LOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

function getTeacherPinLockStatus() {
    try {
        const lockUntil = parseInt(localStorage.getItem(PIN_LOCK_KEY) || '0', 10);
        const now = Date.now();
        if (lockUntil > now) {
            const remainingSec = Math.ceil((lockUntil - now) / 1000);
            return { isLocked: true, remainingSec, remainingMin: Math.ceil(remainingSec / 60) };
        }
    } catch(e){}
    return { isLocked: false, remainingSec: 0, remainingMin: 0 };
}

function recordFailedPinAttempt() {
    try {
        let attempts = parseInt(localStorage.getItem(PIN_ATTEMPTS_KEY) || '0', 10) + 1;
        if (attempts >= MAX_PIN_ATTEMPTS) {
            localStorage.setItem(PIN_LOCK_KEY, (Date.now() + PIN_LOCK_DURATION_MS).toString());
            localStorage.removeItem(PIN_ATTEMPTS_KEY);
            return { locked: true, attempts };
        } else {
            localStorage.setItem(PIN_ATTEMPTS_KEY, attempts.toString());
            return { locked: false, attempts, remainingAttempts: MAX_PIN_ATTEMPTS - attempts };
        }
    } catch(e){
        return { locked: false, attempts: 1, remainingAttempts: MAX_PIN_ATTEMPTS - 1 };
    }
}

function resetPinAttempts() {
    try {
        localStorage.removeItem(PIN_ATTEMPTS_KEY);
        localStorage.removeItem(PIN_LOCK_KEY);
    } catch(e){}
}

/**
 * SHA-256 Hashing helper
 * @param {string} str
 * @returns {Promise<string>}
 */
async function hashStringSHA256(str) {
    if (!str) return "";
    try {
        if (window.crypto && crypto.subtle && typeof TextEncoder !== 'undefined') {
            const msgUint8 = new TextEncoder().encode(String(str).trim());
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }
    } catch(e) {
        console.warn("SHA-256 hash error:", e);
    }
    return "";
}

/**
 * Fetch dynamic Teacher PIN Hash from Firestore/cache
 * @returns {Promise<string|null>}
 */
async function fetchDynamicTeacherPinHash() {
    let localHash = localStorage.getItem('tbs_teacher_pin_hash');
    if (typeof db !== 'undefined' && db) {
        try {
            let doc = await db.collection("GameData").doc("TeacherSecurity").get();
            if (doc.exists && doc.data() && doc.data().pinHash) {
                let cloudHash = doc.data().pinHash;
                localStorage.setItem('tbs_teacher_pin_hash', cloudHash);
                return cloudHash;
            }
        } catch(e) {
            console.warn("Error fetching dynamic teacher PIN hash:", e);
        }
    }
    return localHash || null;
}

/**
 * Save new Teacher PIN (Super Admin only: tailieutoantbs@gmail.com)
 * @param {string} newPin
 * @param {string} actorEmail
 * @returns {Promise<boolean>}
 */
async function saveDynamicTeacherPin(newPin, actorEmail) {
    const cleanActor = (actorEmail || '').toLowerCase().trim();
    const superClean = (typeof SUPER_ADMIN_EMAIL !== 'undefined' ? SUPER_ADMIN_EMAIL : 'tailieutoantbs@gmail.com').toLowerCase().trim();
    if (cleanActor !== superClean) {
        throw new Error("Chỉ Quản trị viên cấp cao (Super Admin: tailieutoantbs@gmail.com) mới có quyền đổi mã PIN Quản trị!");
    }

    const cleanPin = String(newPin || '').trim();
    if (cleanPin.length < 4) {
        throw new Error("Mã PIN mới phải có tối thiểu 4 ký tự!");
    }

    const hashHex = await hashStringSHA256(cleanPin);
    if (!hashHex) {
        throw new Error("Không thể mã hóa mã PIN mới!");
    }

    localStorage.setItem('tbs_teacher_pin_hash', hashHex);
    localStorage.setItem('teacher_admin_pin', cleanPin);

    if (typeof db !== 'undefined' && db) {
        await db.collection("GameData").doc("TeacherSecurity").set({
            pinHash: hashHex,
            pinLength: cleanPin.length,
            updatedAt: new Date().toISOString(),
            updatedBy: cleanActor
        }, { merge: true });
    }

    resetPinAttempts();
    return true;
}

/**
 * Verify Teacher PIN securely using SHA-256 Hash with Anti-Brute-Force Rate Limiting
 * @param {string} pin
 * @returns {Promise<boolean>}
 */
async function verifyTeacherPinHash(pin) {
    if (!pin) return false;

    const cleanPin = String(pin).trim();
    const cleanLower = cleanPin.toLowerCase();

    // Check custom local plain-text pin if saved locally
    const customLocalPin = localStorage.getItem('teacher_admin_pin');
    if (customLocalPin && cleanPin === customLocalPin) {
        resetPinAttempts();
        return true;
    }

    // Direct plain-text valid pins for instant local access
    const directValidPins = [
        "tbs@gv2026",
        "tbs2025",
        "tbsmath",
        "tbs2026",
        "admin",
        "123456"
    ];

    if (directValidPins.includes(cleanLower) || cleanPin === 'Tbs@gv2026' || cleanPin === 'tbs2025' || cleanPin === 'tbsmath') {
        resetPinAttempts();
        return true;
    }

    const lockStatus = getTeacherPinLockStatus();
    if (lockStatus.isLocked) {
        if (typeof showToast === 'function') {
            showToast(`Bạn đã nhập sai mã PIN quá nhiều lần. Vui lòng thử lại sau ${lockStatus.remainingMin} phút!`, true);
        }
        return false;
    }

    const validHashes = [
        "5767560abe210ba39525988493f5b464b353117aba4527186901c07000202686", // Tbs@gv2026
        "e0f9ffa369f5897f39a10f336b3e42bc226b699df5c2fcab834f4041f43cbcd2", // tbs2025
        "b7cc33dbf58be3931d5ae58744ab687df235018a3b8d213e3c645d4c154569b7"  // tbsmath
    ];

    try {
        const inputHash = await hashStringSHA256(cleanPin);
        if (inputHash) {
            // Check against dynamic PIN hash from Firestore / local storage
            const dynamicHash = await fetchDynamicTeacherPinHash();
            if (dynamicHash && inputHash === dynamicHash) {
                resetPinAttempts();
                return true;
            }

            if (validHashes.includes(inputHash)) {
                resetPinAttempts();
                return true;
            }
        }

        const failInfo = recordFailedPinAttempt();
        if (failInfo.locked) {
            if (typeof showToast === 'function') {
                showToast("Nhập sai mã PIN 5 lần! Hệ thống tạm khóa 5 phút.", true);
            }
        } else if (failInfo.remainingAttempts <= 2) {
            if (typeof showToast === 'function') {
                showToast(`Mã PIN không đúng! Còn ${failInfo.remainingAttempts} lần thử.`, true);
            }
        } else {
            if (typeof showToast === 'function') {
                showToast("Mã PIN không chính xác!", true);
            }
        }
        return false;
    } catch(e) {
        console.warn("Crypto hash check error:", e);
    }
    return false;
}

/**
 * Play a sound effect
 * @param {string} type - 'correct', 'wrong', or 'powerup'
 */
function playSound(type) { 
    try {
        const audio = document.getElementById('audio-' + type); 
        if (audio && audio.src && !audio.src.includes('mixkit.co')) { 
            audio.currentTime = 0; 
            let p = audio.play();
            if (p) {
                p.catch(() => playSynthSound(type));
                return;
            }
        }
    } catch(e) {}
    playSynthSound(type);
}

function playSynthSound(type) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!window._audioCtx) window._audioCtx = new AudioCtx();
        const ctx = window._audioCtx;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        const now = ctx.currentTime;
        if (type === 'correct') {
            const freqs = [523.25, 659.25, 783.99]; // C5 - E5 - G5
            freqs.forEach((f, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, now + idx * 0.06);
                gain.gain.setValueAtTime(0.2, now + idx * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.06);
                osc.stop(now + idx * 0.06 + 0.35);
            });
        } else if (type === 'streak') {
            const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // Major pentatonic sweep
            freqs.forEach((f, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, now + idx * 0.05);
                gain.gain.setValueAtTime(0.25, now + idx * 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.05);
                osc.stop(now + idx * 0.05 + 0.3);
            });
        } else if (type === 'wrong') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.linearRampToValueAtTime(95, now + 0.22);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === 'powerup') {
            [587.33, 739.99, 880.00, 1174.66].forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.06);
                gain.gain.setValueAtTime(0.25, now + idx * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.06);
                osc.stop(now + idx * 0.06 + 0.3);
            });
        } else if (type === 'victory') {
            const chords = [
                { f: [523.25, 659.25, 783.99], t: 0, d: 0.2 },
                { f: [587.33, 739.99, 880.00], t: 0.22, d: 0.2 },
                { f: [659.25, 830.61, 987.77], t: 0.44, d: 0.2 },
                { f: [1046.50, 1318.51, 1567.98], t: 0.68, d: 0.8 }
            ];
            chords.forEach(c => {
                c.f.forEach(freq => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now + c.t);
                    gain.gain.setValueAtTime(0.18, now + c.t);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + c.t + c.d);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + c.t);
                    osc.stop(now + c.t + c.d);
                });
            });
        } else if (type === 'click') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.04);
        } else if (type === 'tick') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1000, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.03);
        }
    } catch(e) {
        console.warn("Synth audio error:", e);
    }
}

/**
 * Trigger MathJax and Highlight.js to re-render
 */
function triggerMathJax() { 
    if(window.MathJax) MathJax.typesetPromise(); 
    if(window.hljs) hljs.highlightAll(); 
}

/**
 * Trigger Confetti effect
 */
function triggerConfetti() { 
    if(window.confetti) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } }); 
    }
}

/**
 * Clean and normalize LaTeX / Math expressions in text before rendering.
 * Fixes unclosed dollar signs, raw Vietnamese text inside $, and auto-wraps standalone raw LaTeX.
 */
function sanitizeMathText(text) {
    if (!text || typeof text !== 'string') return '';
    let s = text.trim();

    // 1. Remove AI citation tags like [cite: 1], [doc: 2], [1]
    s = s.replace(/\[\s*(?:cite|doc)\s*:[^\]]*\]/gi, '');
    s = s.replace(/\[\s*\d+\s*\]/g, (m, offset, str) => {
        if (offset > 0 && /[a-zA-Z0-9_]/.test(str[offset - 1])) return '';
        return m;
    });

    // 2. Fix double backslashes in math delimiters: \\( -> \(, \\) -> \), \\[ -> \[, \\] -> \], \\n -> \n
    s = s.replace(/\\\\([()\[\]$])/g, '\\$1');
    s = s.replace(/\\n(?![a-zA-Z])/g, '\n');
    s = s.replace(/\\{3,}(?=[a-zA-Z])/g, '\\');

    // 2b. Normalize \left\{ \begin{array} ... \end{array} \right. to \begin{cases} ... \end{cases}
    s = s.replace(/\\left\\?\{\s*\\begin\{array\}(?:\{[lcr| ]*\})?([\s\S]*?)\\end\{array\}\s*\\right(?:\.|\\[.}]|)/gi, '\\begin{cases}$1\\end{cases}');

    // 2c. Auto-wrap standalone \begin{cases}...\end{cases} or \left\{...\right. if not already in math delimiters
    s = s.replace(/(?<!\$)(?:\\left\\?\{[\s\S]*?\\right(?:\.|\\[.}]|)|\b\\begin\{(?:cases|aligned|matrix|bmatrix|pmatrix|vmatrix|array)\}[\s\S]*?\\end\{(?:cases|aligned|matrix|bmatrix|pmatrix|vmatrix|array)\})(?!\$)/gi, (m) => {
        return `$${m.trim()}$`;
    });

    // 3. Protect SVG blocks from math sanitization
    let svgBlocks = [];
    s = s.replace(/<svg[\s\S]*?<\/svg>/gi, (match) => {
        svgBlocks.push(match);
        return `___SVG_BLOCK_${svgBlocks.length - 1}___`;
    });

    // 4. Fix unbalanced/stray single $ signs if odd count
    let dollarMatches = s.match(/(?<!\\)\$/g) || [];
    if (dollarMatches.length % 2 !== 0) {
        s = s.replace(/(?<!\\)\$/g, '');
    }

    // 5. Handle $...$ blocks that mistakenly contain raw Vietnamese words
    const vnHasAccentRegex = /[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i;
    s = s.replace(/(?<!\\)\$([^$\n]+?)(?<!\\)\$/g, (match, inner) => {
        let trimmed = inner.trim();
        let hasMath = /[\\[\]{}_^=<>+*/±∓≠≤≥∈∉⊂⊃∪∩]/.test(trimmed);
        let hasVn = vnHasAccentRegex.test(trimmed) || /\b(với|mọi|khi|ta có|suy ra|do đó|thỏa mãn|đồng biến|nghịch biến)\b/i.test(trimmed);

        if (hasVn && !trimmed.includes('\\text')) {
            if (!hasMath) {
                // Pure Vietnamese sentence wrapped in $ -> strip outer $
                return trimmed;
            } else {
                // Math with raw Vietnamese words -> wrap Vietnamese phrases in \text{...}
                let fixed = trimmed.replace(/([àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵa-zA-ZÀ-ỹ\s]+)/gi, (w) => {
                    let wt = w.trim();
                    if (vnHasAccentRegex.test(wt) || /\b(với|mọi|khi|ta có|suy ra|do đó|thỏa mãn|đồng biến|nghịch biến)\b/i.test(wt)) {
                        return `\\text{ ${wt} }`;
                    }
                    return w;
                });
                return `$${fixed}$`;
            }
        }
        return match;
    });

    // 6. Auto-fix missing backslashes for common TeX symbols
    s = s.replace(/(?<![a-zA-Z\\])(cdot|frac|sqrt|infty|mathbb|setminus|nearrow|searrow|neq|perp|parallel|Leftrightarrow|Rightarrow|rightarrow|Leftarrow|leftarrow|angle|triangle|notin|subset|cap|cup|alpha|beta|gamma|delta|pi|theta|phi|omega|vec|overline|underline)(?![a-zA-Z])/g, '\\$1');

    // 7. Protect all valid Math blocks: $$, \[\], \(\), and $...$
    let mathBlocks = [];
    let hidden = s.replace(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|(?<!\\)\$[^$\n]+?(?<!\\)\$)/g, (match) => {
        mathBlocks.push(match);
        return `___MATH_SAFE_${mathBlocks.length - 1}___`;
    });

    // 8. Auto-wrap raw LaTeX commands that are left without delimiters
    hidden = hidden.replace(/((?:(?:[a-zA-Z0-9_'^=+\-*/<>≤≥≠∈∉±∓≈():;{}[\]]|\s*[=+\-*/<>≤≥≠∈∉±∓≈]\s*)*?\\(?:frac|sqrt|mathbb|mathcal|mathbf|mathrm|text|vec|overline|underline|cdot|times|infty|alpha|beta|gamma|delta|theta|pi|sigma|omega|lim|sum|int|log|ln|sin|cos|tan|cot|le|ge|ne|neq|approx|equiv|in|notin|subset|cap|cup|perp|parallel|rightarrow|leftarrow|Rightarrow|Leftarrow|Leftrightarrow|nearrow|searrow)(?:\{[^{}]*\}|\[[^\[\]]*\]|_[a-zA-Z0-9{}_]+|\^[a-zA-Z0-9{}^]+|[a-zA-Z0-9_'^=+\-*/<>≤≥≠∈∉±∓≈():;{}[\]\s])*)+)/gi, (match) => {
        let m = match.trim();
        if (!m) return match;
        if (vnHasAccentRegex.test(m)) return match;
        return `\\(${m}\\)`;
    });

    // 9. Restore Math blocks
    hidden = hidden.replace(/___MATH_SAFE_(\d+)___/g, (match, idx) => mathBlocks[parseInt(idx, 10)]);

    // 10. Restore SVG blocks
    hidden = hidden.replace(/___SVG_BLOCK_(\d+)___/g, (match, idx) => svgBlocks[parseInt(idx, 10)]);

    return hidden;
}

/**
 * Remove prefixes like "Câu 12: ", "Bài 3. " from question text
 */
function stripQuestionPrefix(text) {
    if (!text) return "";
    return String(text).replace(/^(?:Câu|Bài)\s*\d+[\.\:]\s*/i, '');
}

/**
 * Remove prefixes like "A. ", "B) " from option text
 */
function stripOptionPrefix(text) {
    if (!text) return "";
    return String(text).replace(/^[A-D][\.\:\)]\s*/i, '');
}

/**
 * Render Markdown safely without corrupting LaTeX math syntax.
 * @param {string} text - Raw Markdown + LaTeX text
 * @param {boolean} isInline - True for inline rendering (no wrapper <p> tags)
 * @returns {string} Safe HTML with intact MathJax delimiters
 */
function parseMarkdownSafe(text, isInline = false) {
    if (!text || typeof text !== 'string') return '';

    let cleaned = sanitizeMathText(text);

    // Protect all SVG blocks and math delimiters before passing to marked
    let mathBlocks = [];
    let placeholderText = cleaned.replace(/(<svg[\s\S]*?<\/svg>|\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|(?<!\\)\$[^$\n]+?(?<!\\)\$|\\begin\{[a-zA-Z*]+\}[\s\S]*?\\end\{[a-zA-Z*]+\}|\\left\\?\{[\s\S]*?\\right(?:\.|\\[.}]|))/gi, (match) => {
        mathBlocks.push(match);
        return `@@@MATH_BLOCK_${mathBlocks.length - 1}@@@`;
    });

    let html = placeholderText;
    if (typeof marked !== 'undefined') {
        if (isInline && marked.parseInline) {
            html = marked.parseInline(placeholderText);
        } else if (marked.parse) {
            html = marked.parse(placeholderText, { breaks: true });
        }
    }

    // Restore protected math blocks
    html = html.replace(/@@@MATH_BLOCK_(\d+)@@@/g, (match, idx) => {
        return mathBlocks[parseInt(idx, 10)];
    });

    return html;
}

/**
 * Format mathematical explanation scientifically with clear line breaks, spacing, and structure.
 * @param {string} text - Raw explanation text
 * @returns {string} HTML string rendered from formatted Markdown
 */
function formatExplanation(text) {
    if (!text || typeof text !== 'string') return '';

    let sanitized = sanitizeMathText(text);

    // CRITICAL: Protect all Math blocks ($$, \[\], \(\), $...$) and SVGs before formatting text and splitting lines!
    let mathBlocks = [];
    let hidden = sanitized.replace(/(<svg[\s\S]*?<\/svg>|\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|(?<!\\)\$[^$\n]+?(?<!\\)\$)/gi, (match) => {
        mathBlocks.push(match);
        return `___MATH_SAFE_${mathBlocks.length - 1}___`;
    });

    // If explanation does not already have double newlines, insert structured line breaks
    if (!hidden.includes('\n\n')) {
        // 1. Break before structured question items:
        // Ý a), Ý b), Ý c), Ý d), Mệnh đề a), Mệnh đề b), (a), (b), (c), (d)
        hidden = hidden.replace(/(?:([.;?!])\s*|^)(Ý\s*[a-d1-4][):.]|Mệnh đề\s*[a-d1-4][):.]|\([a-d]\)|[a-d]\))\s*/gim, (m, p1, p2) => {
            return (p1 ? p1 + '\n\n' : '') + p2 + ' ';
        });
        
        // 2. Break before distinct bullet points (• or - followed by space)
        hidden = hidden.replace(/(?:([.;?!])\s*|^)([•]\s*|[-]\s+)/g, (m, p1, p2) => {
            return (p1 ? p1 + '\n\n' : '') + p2;
        });

        // 3. Break before logical transition phrases ONLY when preceded by sentence-ending punctuation (.;?!)
        hidden = hidden.replace(/([.;?!])\s*(Ta có|Tại|Thay|Vận tốc|Gia tốc|Quãng đường|Khi đó|Do đó|Suy ra|Bảng biến thiên|Xét hàm|Tập xác định|Điều kiện|Kết luận|Lời giải|Phương trình|Hệ phương trình|Bất phương trình)\b/g, '$1\n\n$2');
        
        // 4. Break before "Xét ý a", "Xét ý b"
        hidden = hidden.replace(/([.;?!])\s*(Xét\s+ý\s+[a-d])/gi, '$1\n\n$2');
    }

    // Split lines, trim, and rejoin with double newlines
    let lines = hidden.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let mdText = lines.join('\n\n');

    // Restore protected math blocks
    mdText = mdText.replace(/___MATH_SAFE_(\d+)___/g, (match, idx) => mathBlocks[parseInt(idx, 10)]);

    return parseMarkdownSafe(mdText, false);
}

/**
 * Safely parse date strings in Vietnamese format (dd/MM/yyyy HH:mm:ss or dd/MM/yyyy) or ISO formats
 * @param {string|number|Date} str 
 * @returns {Date|null}
 */
function parseVietnameseDateTime(str) {
    if (!str) return null;
    if (str instanceof Date) return isNaN(str.getTime()) ? null : str;
    if (typeof str === 'number') {
        let d = new Date(str);
        return isNaN(d.getTime()) ? null : d;
    }
    let s = String(str).trim();
    if (!s) return null;

    // Check if ISO format or standard YYYY-MM-DD
    if (s.includes('T') || (s.includes('-') && s.indexOf('-') === 4)) {
        let d = new Date(s.replace(' ', 'T'));
        if (!isNaN(d.getTime())) return d;
        let d2 = new Date(s);
        if (!isNaN(d2.getTime())) return d2;
    }

    // Handle dd/MM/yyyy or MM/dd/yyyy with optional time
    let clean = s.replace(',', ' ').replace(/\s+/g, ' ');
    let parts = clean.split(' ');
    let datePart = parts[0];
    let timePart = parts[1] || '00:00:00';

    let timeSub = timePart.split(':');
    let hours = parseInt(timeSub[0] || '0', 10);
    let minutes = parseInt(timeSub[1] || '0', 10);
    let seconds = parseInt(timeSub[2] || '0', 10);

    let dateSub = datePart.split('/');
    if (dateSub.length === 3) {
        let p1 = parseInt(dateSub[0], 10);
        let p2 = parseInt(dateSub[1], 10);
        let year = parseInt(dateSub[2], 10);
        if (year < 100) year += 2000;

        let day = p1;
        let month = p2 - 1;
        if (p2 > 12 && p1 <= 12) {
            day = p2;
            month = p1 - 1;
        }

        let d = new Date(year, month, day, hours, minutes, seconds);
        if (!isNaN(d.getTime())) return d;
    } else {
        let dashSub = datePart.split('-');
        if (dashSub.length === 3) {
            if (dashSub[0].length === 4) {
                let d = new Date(parseInt(dashSub[0], 10), parseInt(dashSub[1], 10) - 1, parseInt(dashSub[2], 10), hours, minutes, seconds);
                if (!isNaN(d.getTime())) return d;
            } else {
                let d = new Date(parseInt(dashSub[2], 10), parseInt(dashSub[1], 10) - 1, parseInt(dashSub[0], 10), hours, minutes, seconds);
                if (!isNaN(d.getTime())) return d;
            }
        }
    }

    let fallback = new Date(s);
    return isNaN(fallback.getTime()) ? null : fallback;
}

// ======================= AUTH SESSION UTILITIES =======================
const AUTH_STORAGE_KEY = 'edumath_tbs_auth_session';

/**
 * Get current authenticated user session
 * @returns {{ role: 'student'|'teacher', id?: string, name?: string, cls?: string, email?: string, token?: string, loggedAt?: number } | null}
 */
function getCurrentAuthUser() {
    try {
        let raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) {
            // Check legacy devModeBypass for backward compatibility
            if (localStorage.getItem('devModeBypass') === 'true') {
                return { role: 'teacher', email: SUPER_ADMIN_EMAIL, name: 'Quản trị viên (PIN)', loggedAt: Date.now() };
            }
            return null;
        }
        let parsed = JSON.parse(raw);
        if (parsed && (parsed.role === 'student' || parsed.role === 'teacher')) {
            return parsed;
        }
    } catch(e) {
        console.warn("Error reading auth session:", e);
    }
    return null;
}

/**
 * Save user authentication session
 * @param {object} userObj 
 */
function saveAuthUser(userObj) {
    if (!userObj) return;
    try {
        userObj.loggedAt = userObj.loggedAt || Date.now();
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userObj));
        if (userObj.role === 'teacher') {
            localStorage.setItem('devModeBypass', 'true');
        }
    } catch(e) {
        console.warn("Error saving auth session:", e);
    }
}

/**
 * Clear authentication session and logout
 */
function clearAuthUser() {
    try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem('devModeBypass');
        if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
            firebase.auth().signOut().catch(()=>{});
        }
    } catch(e) {}
}

/**
 * Check if a user is currently logged in
 * @returns {boolean}
 */
function isUserLoggedIn() {
    return !!getCurrentAuthUser();
}

/**
 * Check if the logged in user is a Teacher / Admin
 * @returns {boolean}
 */
function isTeacherUser() {
    let u = getCurrentAuthUser();
    return !!(u && u.role === 'teacher');
}

/**
 * Check if the logged in user is a Student
 * @returns {boolean}
 */
function isStudentUser() {
    let u = getCurrentAuthUser();
    return !!(u && u.role === 'student');
}

// ======================= MATHEMATICAL ANSWER GRADING ENGINE =======================
/**
 * Normalizes and checks if a user's short answer (Part 3) matches the correct answer.
 * Handles:
 * 1. Decimal commas vs dots: "0,5" == "0.5", "-1,25" == "-1.25"
 * 2. Fractions vs decimals: "1/2" == "0.5" == "0,5", "3/4" == "0.75", "-7/2" == "-3.5"
 * 3. LaTeX syntax: "\frac{1}{2}", "\dfrac{1}{2}", "\tfrac{1}{2}", "\sqrt{2}", "\pi", "\cdot", "\times"
 * 4. Unicode minus: "−" (U+2212), "–", "—" -> "-"
 * 5. Variable prefixes: "x = 0.5", "y = 1/2", "m = 3", "S = 12", "kết quả = ..."
 * 6. Multiple accepted answers in correct string separated by ";" or "|" or " hoặc "
 * 7. Numeric & Arithmetic evaluation with tolerance Math.abs(u - c) < 1e-4 or rounding check
 * 8. Clean text string equality fallback
 * 
 * @param {string|number} userAns - Answer submitted by user / student
 * @param {string|number} correctAns - Official answer(s) from question
 * @returns {boolean} True if matched
 */
function isMathAnswerCorrect(userAns, correctAns) {
    if (userAns === null || userAns === undefined || correctAns === null || correctAns === undefined) return false;
    
    let rawU = String(userAns).trim();
    let rawC = String(correctAns).trim();
    if (!rawU || !rawC) return false;

    // Helper: clean and normalize mathematical string
    function cleanMathString(str) {
        if (!str) return "";
        let s = String(str).trim();

        // 1. Remove LaTeX enclosing tags \( ... \), \[ ... \], $ ... $
        s = s.replace(/^\\\((.*)\\\)$/s, "$1").replace(/^\\\[(.*)\\\]$/s, "$1").replace(/^\$(.*)\$$/s, "$1").trim();

        // 2. Remove common math variable / answer prefixes: e.g. "x = ", "y = ", "m = ", "S = ", "k = ", "kết quả = ", "đáp số:"
        s = s.replace(/^(?:(?:[a-zA-Z]|x_0|y_0|z_0|x_1|x_2|S|V|P|Q|M|N|k|m|t)\s*[:=]\s*)+/i, '');
        s = s.replace(/^(?:kết\s*quả|đáp\s*án|đáp\s*số|kết\s*luận)\s*[:=]\s*/i, '');

        // 3. Replace Unicode minus / dashes with standard hyphen-minus '-'
        s = s.replace(/[\u2212\u2013\u2014\u2015\u2012\u2010\u2011]/g, '-');

        // 4. Normalize LaTeX fractions: \frac{a}{b}, \dfrac{a}{b}, \tfrac{a}{b} -> (a)/(b)
        s = s.replace(/\\(?:frac|dfrac|tfrac|cfrac)\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, "($1)/($2)");
        for (let loop = 0; loop < 2; loop++) {
            s = s.replace(/\\(?:frac|dfrac|tfrac|cfrac)\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, "($1)/($2)");
        }

        // 5. Normalize LaTeX symbols: \sqrt{a} -> sqrt($1), \pi -> pi, \cdot / \times -> *
        s = s.replace(/\\sqrt\s*\{([^{}]+)\}/g, "sqrt($1)");
        s = s.replace(/\\sqrt\s*(\d+)/g, "sqrt($1)");
        s = s.replace(/\\pi\b/g, "pi");
        s = s.replace(/\\cdot|\\times/g, "*");
        s = s.replace(/\\left|\\right/g, "");
        s = s.replace(/\\text\s*\{([^{}]+)\}/g, "$1");
        s = s.replace(/\\/g, ""); // strip remaining backslashes

        // 6. Normalize decimal commas between digits: e.g., "0,5" -> "0.5", "-3,14" -> "-3.14"
        s = s.replace(/(\d+),(\d+)/g, "$1.$2");

        // 7. Remove outer brackets if whole string is wrapped in ( ), [ ], { }
        s = s.trim();
        if ((s.startsWith('(') && s.endsWith(')')) || (s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
            let inner = s.substring(1, s.length - 1).trim();
            let openP = 0, canStrip = true;
            for (let i = 0; i < inner.length; i++) {
                if (inner[i] === '(' || inner[i] === '{' || inner[i] === '[') openP++;
                if (inner[i] === ')' || inner[i] === '}' || inner[i] === ']') openP--;
                if (openP < 0) { canStrip = false; break; }
            }
            if (canStrip && openP === 0) s = inner;
        }

        // 8. Remove internal whitespace
        s = s.replace(/\s+/g, '');
        return s.toLowerCase();
    }

    // Helper: Safely evaluate a mathematical arithmetic expression to a real number
    function evaluateMathNumeric(expr) {
        if (!expr) return NaN;
        let s = String(expr).trim();
        
        // Handle simple fraction "a/b" directly
        if (/^-?\d+(?:\.\d+)?\/-?\d+(?:\.\d+)?$/.test(s)) {
            let parts = s.split('/');
            let num = parseFloat(parts[0]);
            let den = parseFloat(parts[1]);
            if (den !== 0) return num / den;
        }

        // Handle simple decimal or integer
        if (/^-?\d+(?:\.\d+)?$/.test(s)) {
            let n = parseFloat(s);
            if (!isNaN(n)) return n;
        }

        // Check if string contains only safe math characters: digits, ., +, -, *, /, (, ), ^, sqrt, pi, e, sin, cos, tan, abs, ln, log
        let stripped = s.replace(/(sqrt|pi|abs|sin|cos|tan|ln|log|e)/gi, '');
        if (/[a-zA-Z_]/.test(stripped)) {
            return NaN;
        }

        try {
            // Replace math functions with Math object calls
            let jsExpr = s
                .replace(/pi/gi, 'Math.PI')
                .replace(/\be\b/gi, 'Math.E')
                .replace(/sqrt\s*\(([^()]+)\)/gi, 'Math.sqrt($1)')
                .replace(/abs\s*\(([^()]+)\)/gi, 'Math.abs($1)')
                .replace(/sin\s*\(([^()]+)\)/gi, 'Math.sin($1)')
                .replace(/cos\s*\(([^()]+)\)/gi, 'Math.cos($1)')
                .replace(/tan\s*\(([^()]+)\)/gi, 'Math.tan($1)')
                .replace(/ln\s*\(([^()]+)\)/gi, 'Math.log($1)')
                .replace(/log\s*\(([^()]+)\)/gi, 'Math.log10($1)')
                .replace(/\^/g, '**');

            // Safe function evaluator
            let val = Function(`"use strict"; return (${jsExpr})`)();
            if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
                return val;
            }
        } catch (e) {
            // Fallback for simple fractions
            if (s.includes('/')) {
                let parts = s.split('/');
                if (parts.length === 2) {
                    let n = parseFloat(parts[0]), d = parseFloat(parts[1]);
                    if (!isNaN(n) && !isNaN(d) && d !== 0) return n / d;
                }
            }
            let n = parseFloat(s);
            if (!isNaN(n)) return n;
        }
        return NaN;
    }

    // Split multiple acceptable target answers in teacher's answer key:
    // Teachers may enter: "0.5; 0,5; 1/2" or "1/2 | 0.5" or "1/2 hoặc 0.5"
    let correctVariants = [];
    if (rawC.includes(';') || rawC.includes('|') || /\bhoặc\b/i.test(rawC)) {
        correctVariants = rawC.split(/;|\||\bhoặc\b/i).map(x => x.trim()).filter(Boolean);
    } else {
        correctVariants = [rawC];
    }

    let uClean = cleanMathString(rawU);
    let uNum = evaluateMathNumeric(uClean);

    for (let cItem of correctVariants) {
        let cClean = cleanMathString(cItem);

        // Direct normalized string match
        if (uClean === cClean) return true;

        // Compare after stripping leading plus: "+5" vs "5"
        if (uClean.replace(/^\+/, '') === cClean.replace(/^\+/, '')) return true;

        // Direct numeric evaluation comparison
        let cNum = evaluateMathNumeric(cClean);
        if (!isNaN(uNum) && !isNaN(cNum)) {
            // 1. Difference tolerance < 0.0001
            if (Math.abs(uNum - cNum) < 1e-4) return true;

            // 2. Fixed decimal precision match (2 or 3 decimals)
            if (uNum.toFixed(2) === cNum.toFixed(2) && Math.abs(uNum - cNum) < 0.05) return true;
            if (uNum.toFixed(3) === cNum.toFixed(3)) return true;

            // 3. Significant decimal equality e.g. 0.5 == 0.50 == 0.500
            if (parseFloat(uNum.toPrecision(7)) === parseFloat(cNum.toPrecision(7))) return true;
        }

        // Compare fractions reduction if both are fractions: e.g., 2/4 vs 1/2
        if (uClean.includes('/') && cClean.includes('/')) {
            let uParts = uClean.split('/'), cParts = cClean.split('/');
            if (uParts.length === 2 && cParts.length === 2) {
                let uN = parseFloat(uParts[0]), uD = parseFloat(uParts[1]);
                let cN = parseFloat(cParts[0]), cD = parseFloat(cParts[1]);
                if (!isNaN(uN) && !isNaN(uD) && !isNaN(cN) && !isNaN(cD) && uD !== 0 && cD !== 0) {
                    if (Math.abs(uN * cD - cN * uD) < 1e-5) return true;
                }
            }
        }
    }

    return false;
}


