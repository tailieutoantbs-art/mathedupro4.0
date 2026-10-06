const SUPABASE_URL = 'https://bcokoknkjktdbepjvteg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjb2tva25ramt0ZGJlcGp2dGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4OTYwNTIsImV4cCI6MjEwNTQ3MjA1Mn0.5JKi7zwfLo9YoLIAFMEnLAIzo6sOE6sdhqU3roACXpQ';

async function migrateSupabaseTheory() {
    console.log('\n=== BẮT ĐẦU CHUẨN HÓA THƯ MỤC BÀI GIẢNG / LÝ THUYẾT TRÊN SUPABASE ===');
    const res = await fetch(`${SUPABASE_URL}/rest/v1/theory_archives?select=id,topic,folder_id,theory`, {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
    });
    const data = await res.json();
    console.log(`Tìm thấy ${data.length} bài giảng/lý thuyết.`);
    for (let r of data) {
        let title = r.theory?.title || r.topic || '';
        let oldF = r.folder_id;
        let newF = 'TOAN 12';
        let gradeMatch = title.match(/\b(11|10|9|8|7|6)\b/);
        if (gradeMatch) {
            newF = 'TOAN ' + gradeMatch[1];
        } else if (title.includes('Khảo sát') || title.includes('Hàm số') || title.includes('Oxyz') || title.includes('Tích phân') || title.includes('Đạo hàm') || title.includes('12')) {
            newF = 'TOAN 12';
        } else if (oldF === '1ss9-q5VUi1sN8mbHJKJj0IwNoos6paJZ') {
            newF = 'KHAC';
        }
        console.log(`[${r.id}] "${title}": ${oldF} -> ${newF}`);

        await fetch(`${SUPABASE_URL}/rest/v1/theory_archives?id=eq.${r.id}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ folder_id: newF })
        });
    }
    console.log('🎉 ĐÃ CHUẨN HÓA BÀI GIẢNG TRÊN SUPABASE THÀNH CÔNG!');
}

migrateSupabaseTheory();
