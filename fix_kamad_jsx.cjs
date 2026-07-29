const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

const returnStatement = "return (\n      {selectedStaf && (\n        <div className=\"fixed inset-0";

code = code.replace(returnStatement, "return (\n    <>\n      {selectedStaf && (\n        <div className=\"fixed inset-0");

// Also add </> at the very end of KamadKinerjaStaf
const lastDiv = "      </Card>\n    </div>\n  );\n}";
code = code.replace(lastDiv, "      </Card>\n    </div>\n    </>\n  );\n}");

fs.writeFileSync('src/pages/KamadPages.tsx', code);
