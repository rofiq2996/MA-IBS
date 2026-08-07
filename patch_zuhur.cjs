const fs = require('fs');
let content = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

// Replace the parseFloat block
const oldBlock = `            const schoolLatL = parseFloat(remoteStorage.getItem('school_lat_l') || '-0.502');
            const schoolLngL = parseFloat(remoteStorage.getItem('school_lng_l') || '101.447');
            const maxRadiusL = parseInt(remoteStorage.getItem('school_radius_l') || '200', 10);
            
            const schoolLatP = parseFloat(remoteStorage.getItem('school_lat_p') || '-0.502');
            const schoolLngP = parseFloat(remoteStorage.getItem('school_lng_p') || '101.447');
            const maxRadiusP = parseInt(remoteStorage.getItem('school_radius_p') || '200', 10);`;

const newBlock = `            const getValidFloat = (k, fallback) => { const v = parseFloat(remoteStorage.getItem(k) || fallback); return isNaN(v) ? parseFloat(fallback) : v; };
            const getValidInt = (k, fallback) => { const v = parseInt(remoteStorage.getItem(k) || fallback, 10); return isNaN(v) ? parseInt(fallback, 10) : v; };
            const schoolLatL = getValidFloat('school_lat_l', '-0.502');
            const schoolLngL = getValidFloat('school_lng_l', '101.447');
            const maxRadiusL = getValidInt('school_radius_l', '200');
            
            const schoolLatP = getValidFloat('school_lat_p', '-0.502');
            const schoolLngP = getValidFloat('school_lng_p', '101.447');
            const maxRadiusP = getValidInt('school_radius_p', '200');`;

if (content.includes("parseFloat(remoteStorage.getItem('school_lat_l')")) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync('src/pages/GuruPages.tsx', content);
    console.log('Patched Zuhur logic');
} else {
    console.log('Block not found');
}
