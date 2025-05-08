import { SCORE_RULES } from "./scoreRules";
export function calculateNeededStrategies(totalScores) {
    const playerNames = Object.keys(totalScores);
    const strategiesMap = {};
    for (const player of playerNames) {
        let foundWinningStrategy = null;
        for (const [handType, rule] of Object.entries(SCORE_RULES)) {
            // نسخة من النقاط الحالية
            const projectedScores = { ...totalScores };
            // نحسب كأن اللاعب هذا فاز، والباقي خسروا
            for (const otherPlayer of playerNames) {
                if (otherPlayer === player) {
                    projectedScores[otherPlayer] += rule.winner;
                }
                else {
                    projectedScores[otherPlayer] += rule.did_not_go_down;
                }
            }
            // نشوف من اللي راح يصير أقل مجموع (الفائز)
            const projectedWinner = Object.entries(projectedScores).reduce((lowest, [name, score]) => (score < lowest.score ? { name, score } : lowest), { name: null, score: Infinity });
            if (projectedWinner.name === player) {
                foundWinningStrategy = {
                    handType,
                    points: -rule.winner
                };
                break; // أول نوع فوز يحقق الفوز نوقف عنده
            }
        }
        strategiesMap[player] = foundWinningStrategy
            ? `إذا فاز بجولة "${typeToLabel(foundWinningStrategy.handType)}" (خصم ${foundWinningStrategy.points} نقطة) راح يتصدر`
            : "حتى الفوز بأي جولة ما يخليه يتصدر";
    }
    return strategiesMap;
}
function typeToLabel(type) {
    const labels = {
        normal: "عادي",
        colored: "ملون",
        jokery: "جوكري",
        zarat: "الزرات",
        double_jokery: "دبل جوكري",
        double_jokery_colored: "دبل جوكري ملون"
    };
    return labels[type] || type;
}
