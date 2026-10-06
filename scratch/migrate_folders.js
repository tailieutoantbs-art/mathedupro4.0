const fs = require('fs');

async function migrateAll() {
    console.log('=== BẮT ĐẦU CHUẨN HÓA VÀ DI CHUYỂN TOÀN BỘ ĐỀ THI / GAMES ===');
    let res = await fetch('https://firestore.googleapis.com/v1/projects/cosodulieutbs/databases/(default)/documents/AdminHistory?pageSize=100');
    let data = await res.json();
    let docs = data.documents || [];
    console.log('Tổng số đề thi trong AdminHistory:', docs.length);

    function normalize(folder) {
        if (!folder) return 'KHAC';
        let f = String(folder).trim();
        let u = f.toUpperCase().replace(/\s+/g, ' ');
        if (['TOAN 6', 'TOAN 7', 'TOAN 8', 'TOAN 9', 'TOAN 10', 'TOAN 11', 'TOAN 12', 'KHAC'].includes(u)) return u;
        let m = u.match(/^(?:TOAN|LỚP|LOP|K)\s*(12|11|10|9|8|7|6)$/i);
        if (m) return 'TOAN ' + m[1];
        if (['12', '11', '10', '9', '8', '7', '6'].includes(u)) return 'TOAN ' + u;
        return 'KHAC';
    }

    let successCount = 0;
    for (let d of docs) {
        let code = d.name.split('/').pop();
        let name = d.fields.name?.stringValue || '';
        let oldFolder = d.fields.folder?.stringValue || '';
        let newFolder = normalize(oldFolder);

        console.log(`[${code}] "${name}": ${oldFolder || '(trống)'} -> ${newFolder}`);

        // 1. Cập nhật AdminHistory
        let adminUrl = `https://firestore.googleapis.com/v1/projects/cosodulieutbs/databases/(default)/documents/AdminHistory/${code}?updateMask.fieldPaths=folder`;
        try {
            await fetch(adminUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fields: { folder: { stringValue: newFolder } } })
            });
        } catch (e) {
            console.error(`Lỗi cập nhật AdminHistory ${code}:`, e.message);
        }

        // 2. Cập nhật SharedGames settings.folder
        try {
            let sharedUrl = `https://firestore.googleapis.com/v1/projects/cosodulieutbs/databases/(default)/documents/SharedGames/${code}?updateMask.fieldPaths=settings.folder`;
            await fetch(sharedUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fields: { 'settings.folder': { stringValue: newFolder } } })
            });
        } catch (e) {}

        successCount++;
    }
    console.log(`\n🎉 ĐÃ CHUẨN HÓA THÀNH CÔNG ${successCount}/${docs.length} ĐỀ THI / GAMES VỀ ĐÚNG THƯ MỤC!`);

    // Đồng bộ lại document GameData/AdminHistory nếu có
    try {
        let gRes = await fetch('https://firestore.googleapis.com/v1/projects/cosodulieutbs/databases/(default)/documents/GameData/AdminHistory');
        let gData = await gRes.json();
        if (gData && gData.fields && gData.fields.list) {
            let listValues = gData.fields.list.arrayValue?.values || [];
            let updatedList = listValues.map(item => {
                if (item.mapValue && item.mapValue.fields && item.mapValue.fields.folder) {
                    let curF = item.mapValue.fields.folder.stringValue || '';
                    item.mapValue.fields.folder.stringValue = normalize(curF);
                }
                return item;
            });
            await fetch('https://firestore.googleapis.com/v1/projects/cosodulieutbs/databases/(default)/documents/GameData/AdminHistory?updateMask.fieldPaths=list', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fields: { list: { arrayValue: { values: updatedList } } } })
            });
            console.log('✅ Đã cập nhật mảng cache trong GameData/AdminHistory!');
        }
    } catch(e) {
        console.warn('Cập nhật GameData/AdminHistory:', e.message);
    }
}

migrateAll();
