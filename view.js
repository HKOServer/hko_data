let quests = await(await fetch("./data/quests.json")).json();
let dialogs = await(await fetch("./data/dialog.json")).json();

let maps = new Map((await(await fetch("./data/maps.json")).json()).map(x => [x.Id, x]));
let npcs = new Map((await(await fetch("./data/npcs.json")).json()).map(x => [x.Id, x]));
let mobs = new Map((await(await fetch("./data/mobs.json")).json()).map(x => [x.Id, x]));
let items = new Map((await(await fetch("./data/items.json")).json()).map(x => [x.Id, x]));

let villages = [
    "???",
    "SanrioHarbour", // 1
    "Florapolis", // 2
    "London", // 3
    "Paris", // 4
    "Beijing", // 5
    "DreamCarnival", // 6
    "NewYork", // 7
    "Tokyo", // 8
]

quests.sort((a, b) => a.Id - b.Id);

let dd = document.getElementById("dropDown");
for (const item of quests) {
    let el = document.createElement("option");
    el.value = item.Id;
    el.innerText = `${item.Id} - ${item.Name}`;

    dd.append(el);
}
dd.addEventListener("input", () => {
    selected = dd.selectedIndex;
    location.hash = quests[selected].Id;
    update();
});

let selected = 0;

let id = document.getElementById("id");
let name = document.getElementById("name");
let desc = document.getElementById("desc");
let mini = document.getElementById("minigame");
let sections = document.getElementById("sections");

if (location.hash != "") {
    let id = parseInt(location.hash.substring(1))
    selected = dd.selectedIndex = quests.findIndex(x => x.Id == id);
}

function npcText(id) {
    let npc = npcs.get(id);

    if (!npc) {
        return `<span class="textNpc" title="[n${id}]">Unknown (${id})</span>`;
    } else {
        return `<span class="textNpc" title="[n${id}]">${npc.Name}</span>`;
    }
}

function itemText(id) {
    let item = items.get(id);
    return `<span class="textItem" title="[i${id}]">${item.Name}</span>`;
}

function renderText(str) {
    let res = "";
    let pos = 0;

    for (let m of str.matchAll(/\[(.+?)\]/g)) {
        res += str.substring(pos, m.index);

        let id = parseInt(m[1].substr(1));

        switch (m[1][0]) {
            case "i":
                res += itemText(id);
                break;
            case "p":
                res += `<span class="textPlace" title="${m[0]}">${maps.get(id).Name}</span>`;
                break;
            case "n":
                res += npcText(id);
                break;
            case "m":
                res += `<span class="textMob" title="${m[0]}">${mobs.get(id).Name}</span>`;
                break;
            default:
                debugger
                res += m[0];
                break;
        }

        pos = m.index + m[0].length;
    }

    res += str.substr(pos);
    return res;
}

function renderDialog(id) {
    let dialog = dialogs[id];
    if (!dialog || dialog.length == 0)
        return "";

    let str = "";

    for (let i = 0; i < dialog.length; i++) {
        const line = dialog[i];

        if (line.startsWith("emo")) {

        } else if (line.startsWith("adt")) {
            let text = line.match(/"(.+)"/)[1];

            str += renderText(text);
            // str += "<br>";
        } else if (line.startsWith("enext")) {

        } else if (line.startsWith("dnext")) {

        } else if (line.startsWith("next")) {

        } else if (line.startsWith("clt")) {

        } else if (line.startsWith("acp_q")) {

        } else if (line.startsWith("rep_q")) {

        } else {
            debugger;
            // alert(`Unknown dialog section "${line}"`);
        }
    }

    return str;
}

function makeTr(...items) {
    let tr = document.createElement("tr");

    for (let i = 0; i < items.length; i++) {
        let el = document.createElement("td");
        el.innerHTML = items[i];
        tr.appendChild(el);
    }

    return tr;
}

function renderRewards(rewards) {
    let ret = [];

    for (const item of rewards) {
        let sub = document.createElement("div");

        switch (item.Type) {
            case "StartQuest":
                sub.innerText = `Starts this quest`;
                break;
            case "EndQuest":
                sub.innerText = `Ends this quest`;
                break
            case "Exp":
                sub.innerText = `${item.Amount} HKO Exp`;
                break;
            case "Money":
                sub.innerText = `${item.Amount} Money`;
                break;
            case "Item":
                if (item.Male == item.Female) {
                    sub.innerHTML = `${itemText(item.Male)}*${item.Count}`;
                } else {
                    sub.innerHTML = `Male: ${itemText(item.Male)}*${item.Count} / Female: ${itemText(item.Female)}*${item.Count}`;
                }
                break;
            case "Friendship":
                sub.innerText = `${item.Amount} ${villages[item.Village]} Friendship`;
                break;
            case "Select": {
                sub.style.border = "1px solid black";
                sub.append("Select from:", ...renderRewards(item.Sub.map(x => (x.Type = "Item", x))));
                break;
            }
            case "Checkpoint":
                sub.innerText = `Checkpoints ${item.Ids.join(",")}`;
                break;
            case "Key":
                sub.innerText = `Key ${item.Id}`;
                break;
            case "Dream":
                sub.innerText = `Dream ${item.Id}`;
                break;
            case "Flag":
                sub.innerText = `Sets Flag ${item.Id}`;
                break;
            default:
                debugger
                break;
        }

        ret.push(sub);
    }

    return ret;
}

function renderSub(item) {
    let el = document.createElement("table");

    let npc = makeTr("Npc:", npcText(item.Npc));
    let diag = makeTr("Dialog:", renderDialog(item.Dialog));

    let reqs = makeTr("Requirements", "");
    for (const req of item.Requirements) {
        let sub = document.createElement("div");

        switch (req.Type) {
            case "GiveItem":
                sub.innerHTML = `Give Item <span class="textItem" title="[i${req.Id}]">${items.get(req.Id).Name}</span> x${req.Count}`;
                break;
            case "ClearItem":
                sub.innerHTML = `Clear Item <span class="textItem" title="[i${req.Id}]">${items.get(req.Id).Name}</span> x${req.Count}`;
                break;
            case "HaveItem":
                sub.innerHTML = `Have Item <span class="textItem" title="[i${req.Id}]">${items.get(req.Id).Name}</span> x${req.Count}`;
                break;
            case "Idk":
                sub.innerText = `"${req.Text}"`;
                break;
            case "Checkpoint":
                sub.innerText = `Have Checkpoints [${req.Ids.join(", ")}]`;
                break;
            case "Quest": {
                let str = [];
                if (req.Flags & 1) str.push("not started");
                if (req.Flags & 2) str.push("running");
                if (req.Flags & 4) str.push("done");

                let q = quests.filter(x => x.Id == req.Id)[0];
                sub.innerHTML = `Quest <span class="textItem" title="${req.Id}">${q.Name ?? q.Id}</span> ${str.join(" or ")}`;
                break;
            }
            case "NotFlag":
                sub.innerText = `Flag ${req.Id} is not set`;
                break;
            case "Flags":
                sub.innerText = `Flags ${req.Ids.join(",")} have to be set`;
                break;
            default:
                debugger;
                break;
        }

        reqs.children[1].append(sub);
    }

    el.append(npc, diag, reqs);

    if (item.Rewards.length != 0) {
        let rewards = makeTr("Rewards", "");
        rewards.children[1].append(...renderRewards(item.Rewards));
        el.append(rewards);
    }

    return el;
}

function update() {
    let el = quests[selected];

    id.innerText = el.Id;
    name.innerText = el.Name;
    desc.innerHTML = renderText(el.Description);
    mini.innerText = JSON.stringify(el.Minigame) ?? "No"; // TODO: minigame names

    sections.replaceChildren(...el.Sections.map(renderSub));
}
update();
