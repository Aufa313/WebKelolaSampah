const fs = require('fs');
const path = 'c:/layanan-setor-sampah/src/components/dashboard/DashboardAdmin.tsx';
let content = fs.readFileSync(path, 'utf8');

// The botched part is at the end of the file:
const splitStr = '}// --- Stats & Withdrawals States ---';
if (content.includes(splitStr)) {
  const parts = content.split(splitStr);
  let mainBody = parts[0] + '}'; // Restore the closing brace of DashboardAdmin
  
  // Extract the botched state code
  const botchedState = '// --- Stats & Withdrawals States ---' + parts[1];
  
  // Now we need to insert the botched state INSIDE the DashboardAdmin component.
  // We can place it right after `export default function DashboardAdmin({ onBack, adminEmail }: DashboardAdminProps) {`
  const componentStartStr = 'export default function DashboardAdmin({ onBack, adminEmail }: DashboardAdminProps) {';
  
  if (mainBody.includes(componentStartStr)) {
    mainBody = mainBody.replace(
      componentStartStr, 
      componentStartStr + '\n' + botchedState + '\n'
    );
  }
  
  fs.writeFileSync(path, mainBody, 'utf8');
  console.log("DashboardAdmin fixed successfully!");
} else {
  console.log("Botched part not found. Already fixed?");
}
