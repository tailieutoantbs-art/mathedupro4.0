const crypto = require('crypto');

function getHash(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

const pins = ["Tbs@gv2026", "tbs2025", "tbsmath", "123456", "admin"];
pins.forEach(p => {
    console.log(`PIN "${p}" -> SHA256: ${getHash(p)}`);
});

const validHashes = [
    "5767560abe210ba39525988493f5b464b353117aba4527186901c07000202686", // Tbs@gv2026
    "e0f9ffa369f5897f39a10f336b3e42bc226b699df5c2fcab834f4041f43cbcd2", // tbs2025
    "b7cc33dbf58be3931d5ae58744ab687df235018a3b8d213e3c645d4c154569b7"  // tbsmath
];

validHashes.forEach((h, idx) => {
    console.log(`Configured hash[${idx}] = ${h}`);
});
