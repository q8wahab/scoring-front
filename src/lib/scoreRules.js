export const SCORE_RULES = {
    normal: {
        winner: -60,
        did_not_go_down: 200,
        went_down_multiplier: 2,
        made_mistake: 250
    },
    colored: {
        winner: -120,
        did_not_go_down: 400,
        went_down_multiplier: 4,
        made_mistake: 450
    },
    jokery: {
        winner: -120,
        did_not_go_down: 400,
        went_down_multiplier: 4,
        made_mistake: 450
    },
    jokery_colored: {
        winner: -240,
        did_not_go_down: 800,
        went_down_multiplier: 8,
        made_mistake: 850
    },
    zaat: {
        winner: -400,
        did_not_go_down: 1200,
        went_down_multiplier: 12,
        made_mistake: 1250
    },
    double_jokery: {
        winner: -240,
        did_not_go_down: 800,
        went_down_multiplier: 8,
        made_mistake: 850
    },
    double_jokery_colored: {
        winner: -400,
        did_not_go_down: 1200,
        went_down_multiplier: 12,
        made_mistake: 1250
    }
};
