// broken or uncompleteable quests
let bad = new Set([]);

// completeable quests
let good = new Set([
    99,
    100,

    // dream carnival
    768,
    755,
    761,
    735,
    770,
    736,
    744,
    773,
    760,
    753,
    774,
    749,
    809,
    810,
    811,
    745,
    746,
    772,
    762,
    742,
    743,
    771,
    766,
    763,
    756,
    757,
    758,
    759,
    737,

    // sanrio harbour
    101,
    1001,
    104,
    1002,
    1003,
    108,
    1005,
    1004,
    1009,
    111,
    112,
    1007,
    1008,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    123,
    124,

    // Florapolis
    151,
    1012,
    1013,
    1014,
    160,
    1015,
    162,
    163,
    164,
    165,
    1017,
    1018,
    167
]);

let quests = await(await fetch("./data/quests.json")).json();

let str = "digraph G {\nbgcolor=transparent\n"

for (const quest of quests) {
    let color = "white";

    if (bad.has(quest.Id)) {
        color = "red3"; // manual not completable
    } else if (good.has(quest.Id)) {
        color = "green3"; // tested completable
    } else if (quest.Sections.length == 0 || quest.Sections.some(x => x.Requirements.some(y => y.Type == "Idk"))) {
        color = "red3"; // cannot meet requirements
    }
    str += `n${quest.Id} [shape=record label="${quest.Name}" style=filled fillcolor=${color}]\n`;
}

let arrows = new Set();

for (const quest of quests) {
    for (const sub of quest.Sections) {
        for (const item of sub.Requirements) {
            if (item.Type == "Quest") {
                if (item.Id == quest.Id && (item.Flags == 1 || item.Flags == 2)) continue;

                arrows.add(`n${item.Id} -> n${quest.Id}\n`);
            }
        }
    }
}

for (const item of arrows) {
    str += item;
}
str += "}";

let viz = new Viz();
window.viz = viz;

let button = document.createElement("button");
button.innerText = "Save png";
button.addEventListener("click", () => {
    viz.renderImageElement(str).then(x => {
        window.open(x.src);
    });
});
document.body.append(button);

viz.renderSVGElement(str)
    .then(function (element) {
        element.addEventListener("mousedown", e => {
            if (e.button == 1 && e.target.tagName == "text") {
                let q = quests[parseInt(e.target.parentElement.id.substring(4)) - 1];
                window.open(`./view.html#${q.Id}`)
                e.preventDefault();
            }
        });
        document.body.appendChild(element);
    })
    .catch(error => {
        // Create a new Viz instance (@see Caveats page for more info)
        viz = new Viz();
        // Possibly display the error
        console.error(error);
    });
