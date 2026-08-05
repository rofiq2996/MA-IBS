const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/AdminReports.tsx');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('useEffect')) {
    content = content.replace(/import React, \{ useState \} from 'react';/, "import React, { useState, useEffect } from 'react';");
    fs.writeFileSync(file, content);
    console.log('Added useEffect to AdminReports.tsx');
} else if (content.match(/import React, \{ useState \} from 'react';/)) {
    content = content.replace(/import React, \{ useState \} from 'react';/, "import React, { useState, useEffect } from 'react';");
    fs.writeFileSync(file, content);
    console.log('Added useEffect to AdminReports.tsx');
} else {
    console.log('Could not find where to add useEffect');
}
