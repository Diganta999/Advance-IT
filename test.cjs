
async function test() {
  const content = await fetch("https://advance-it-backend.onrender.com/api/content").then(r => r.json());
  console.log("Original services len:", content.services.length);

  try {
    const res = await fetch("https://advance-it-backend.onrender.com/api/auth/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email: "admin@advanceit.com", password: "admin123"})
    });
    const login = await res.json();
    console.log("Login success:", !!login.token);

    const updateRes = await fetch("https://advance-it-backend.onrender.com/api/content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${login.token}`
      },
      body: JSON.stringify({
        ...content,
        services: [...content.services, {title: "Test Service", icon: "Test", description: "Test"}]
      })
    });
    const updateData = await updateRes.json();
    console.log("Updated services len:", updateData.services?.length);

    // Verify
    const verify = await fetch("https://advance-it-backend.onrender.com/api/content").then(r => r.json());
    console.log("Verified services len:", verify.services?.length);
  } catch(e) {
    console.error(e);
  }
}
test();

