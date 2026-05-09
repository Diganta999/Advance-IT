
const http = require("http");

async function test() {
  const content = await fetch("https://advance-it-backend.onrender.com/api/content").then(r => r.json());
  console.log("Original services len:", content.services.length);

  // login to get token
  // Oh wait, admin login needed? Yes, protect, authorizeRoles("admin")
}
test();

