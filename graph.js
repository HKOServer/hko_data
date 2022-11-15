// broken or uncompleteable quests
let bad = new Set([
    1008,
    742,
    763,
    737,
    747,
    117,
    152
]);

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
    113,
    114,
    115,
    116,

    // Florapolis
    151
]);

let quests = await(await fetch("./data/quests.json")).json();
console.log(quests);

let str = "digraph G {\nbgcolor=transparent\n"

for (const quest of quests) {
    if (bad.has(quest.Id)) {
        str += `n${quest.Id} [shape=record label="${quest.Name}" style=filled fillcolor=red3]\n`;
    } else if (good.has(quest.Id)) {
        str += `n${quest.Id} [shape=record label="${quest.Name}" style=filled fillcolor=green3]\n`;
    } else {
        str += `n${quest.Id} [shape=record label="${quest.Name}" style=filled fillcolor=white]\n`;
    }
}

let arrows = new Set();

for (const quest of quests) {
    for (const sub of quest.Start) {
        for (const item of sub.Requirements) {
            if (item.Type == "Quest") {
                if (item.Id == quest.Id && item.Flags == 1) continue;

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
        document.body.appendChild(element);
    })
    .catch(error => {
        // Create a new Viz instance (@see Caveats page for more info)
        viz = new Viz();
        // Possibly display the error
        console.error(error);
    });