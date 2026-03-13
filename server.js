const webServer = require("express");
const { QuickDB } = require("quick.db");

const localData = new QuickDB();
const portal = webServer();

portal.set("view engine", "ejs");
portal.use(webServer.static("assets")); 
portal.use(webServer.urlencoded({ extended: true }));
portal.use(webServer.json());

// qeydiyyat bolmesi
portal.post("/create-profile", async (request, response) => {
    const { login, secretKey } = request.body;

    const account = await localData.get(`members.${login}`);

    if (account) return response.send("Bu istifadəçi artıq mövcuddur");

    await localData.set(`members.${login}`, {
        login,
        secretKey
    });

    response.send("Hesab uğurla yaradıldı");
});

// giris bolmesi
portal.post("/verify-access", async (req, res) => {
    const { login, secretKey } = req.body;

    const entry = await localData.get(`members.${login}`);

    if (!entry) return res.send("İstifadəçi tapılmadı");

    if (entry.secretKey !== secretKey)
        return res.send("Şifrə yanlışdır");

    res.send("Giriş uğurla tamamlandı");
});

portal.get("/", async (req, res) => {
    res.render("index", { title: "Giriş Paneli", info: null });
});

const PORT = 3000;
portal.listen(PORT, () => {
    console.log(`Server ${PORT} portunda aktivdir`);
});
