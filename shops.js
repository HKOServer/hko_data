let npcs = new Map((await(await fetch("./data/npcs.json")).json()).map(x => [x.Id, x]));
let items = new Map((await(await fetch("./data/items.json")).json()).map(x => [x.Id, x]));
let maps = new Map((await(await fetch("./data/maps.json")).json()).map(x => [x.Id, x]));

let shops = await(await fetch("./data/shops.json")).json();

console.log(shops);

function makeDiv(text) {
    let el = document.createElement("div");
    el.innerText = text;
    return el;
}

for (const shop of shops) {
    let div = document.createElement("div");

    let _npcs = document.createElement("div");
    _npcs.classList.add("npcs");
    for (const npc of shop.Npcs) {
        let dat = npcs.get(npc);
        _npcs.append(makeDiv(`${dat.Name} (${maps.get(dat.MapId).Name})`));
    }
    div.append(_npcs);

    let _items = document.createElement("div");
    _items.classList.add("items");

    _items.append(makeDiv("Item"), makeDiv("Price"));
    for (const item of shop.Items) {
        let name = items.get(item.Id);

        _items.append(makeDiv(`${name.Name} x${item.Count}`));
        _items.append(makeDiv(`${item.Price}`));
    }
    div.append(_items);

    document.body.append(div);
}
