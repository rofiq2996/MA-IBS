const fs = require('fs');
let file = 'src/pages/AdminStudents.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(`          </Card>
        )}
        ) : (
        <Card>`, `          </Card>
        ) : (
        <Card>`);

code = code.replace(`      </Card>

      {/* MODAL DELETE CONFIRMATION */}`, `      </Card>
        )}

      {/* MODAL DELETE CONFIRMATION */}`);

code = code.replace(`        </Card>
        )}
        </>
      )}`, `        </>
      )}`);

fs.writeFileSync(file, code);
console.log('Fixed JSX structure in AdminStudents.tsx');
