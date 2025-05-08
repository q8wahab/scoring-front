import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import './App.css';
import { calculateNeededStrategies } from './lib/calculateNeededStrategies';
import { Link } from "react-router-dom";
// Import constants for hand types from the backend calculator.js or define them here
// For simplicity, defining them here. In a larger app, share them or fetch from backend.
const HAND_TYPES = {
    "normal": "هاند عادي",
    "colored": "هاند ملون",
    "jokery": "هاند جوكري",
    "jokery_colored": "هاند ملون جوكري",
    "zaat": "هاند الزات",
    "double_jokery": "هاند دبل جوكري",
    "double_jokery_colored": "هاند دبل جوكري ملون"
};
const PLAYER_STATUSES = {
    WINNER: 'winner',
    DID_NOT_GO_DOWN: 'did_not_go_down',
    WENT_DOWN: 'went_down',
    MADE_MISTAKE: 'made_mistake'
};
function App() {
    const [players, setPlayers] = useState([
        { id: 1, name: '', status: '', cardValueSum: 0 },
        { id: 2, name: '', status: '', cardValueSum: 0 },
        { id: 3, name: '', status: '', cardValueSum: 0 },
        { id: 4, name: '', status: '', cardValueSum: 0 },
    ]);
    const [handType, setHandType] = useState('normal');
    const [roundScores, setRoundScores] = useState(null);
    const [totalScores, setTotalScores] = useState({});
    const [error, setError] = useState('');
    const [winner, setWinner] = useState('');
    const [neededStrategies, setNeededStrategies] = useState({});
    const handlePlayerNameChange = (id, name) => {
        setPlayers(players.map(p => (p.id === id ? { ...p, name } : p)));
    };
    const handlePlayerCardValueChange = (id, value) => {
        setPlayers(players.map(p => (p.id === id ? { ...p, cardValueSum: parseInt(value, 10) || 0 } : p)));
    };
    const handleWinnerChange = (playerName) => {
        setWinner(playerName);
        setPlayers(players.map(p => {
            const name = p.name.trim() || `player${p.id}`;
            return {
                ...p,
                status: name === playerName
                    ? PLAYER_STATUSES.WINNER
                    : p.status === PLAYER_STATUSES.WINNER ? '' : p.status
            };
        }));
    };
    const handlePlayerStatusChange = (id, status) => {
        // If this player is set as winner, also update the main winner state
        const newPlayers = players.map(p => {
            if (p.id === id) {
                if (status === PLAYER_STATUSES.WINNER)
                    setWinner(p.name);
                return { ...p, status };
            }
            // If another player was winner, and this one is now winner, clear old winner status
            if (status === PLAYER_STATUSES.WINNER && p.status === PLAYER_STATUSES.WINNER) {
                return { ...p, status: '' }; // Or a default status
            }
            return p;
        });
        setPlayers(newPlayers);
    };
    const calculateScores = async () => {
        setError('');
        setRoundScores(null);
        if (!winner) {
            setError("الرجاء تحديد اللاعب الفائز.");
            return;
        }
        const playersData = players.map((p, index) => {
            const name = p.name.trim() || `player${index + 1}`;
            let status = p.status;
            if (name === winner) {
                status = PLAYER_STATUSES.WINNER;
            }
            else if (!status) {
                status = PLAYER_STATUSES.DID_NOT_GO_DOWN;
            }
            return {
                name,
                status,
                cardValueSum: status === PLAYER_STATUSES.WENT_DOWN ? p.cardValueSum : undefined
            };
        });
        if (playersData.some(p => p === null))
            return; // Stop if there was an error
        if (playersData.filter(p => p.status === PLAYER_STATUSES.WINNER).length !== 1) {
            setError("يجب أن يكون هناك فائز واحد بالضبط.");
            return;
        }
        try {
            // In a real setup, the backend URL would be configurable
            const response = await fetch('https://scoring-back-w0o0.onrender.com/api/calculate-scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ handType, players: playersData }),
            });
            let data;
try {
    data = await response.json();
} catch (parseError) {
    throw new Error("الرد من الخادم ليس بصيغة JSON صالحة.");
}

if (!response.ok) {
    throw new Error(data?.error || `HTTP error! status: ${response.status}`);
}

setRoundScores(data);

            setRoundScores(data);
            // Update total scores
            const newTotalScores = { ...totalScores };
            for (const playerName in data) {
                newTotalScores[playerName] = (newTotalScores[playerName] || 0) + data[playerName];
            }
            setTotalScores(newTotalScores);
            setNeededStrategies(calculateNeededStrategies(newTotalScores));
        }
        catch (err) {
            setError(err.message);
            console.error("Failed to calculate scores:", err);
        }
    };
    // Initialize player names for total scores
    useEffect(() => {
        const initialTotals = {};
        players.forEach(p => {
            if (p.name)
                initialTotals[p.name] = 0;
        });
        setTotalScores(initialTotals);
    }, []); // Run once on mount
    // Update total scores keys when player names change
    useEffect(() => {
        const newTotalScores = { ...totalScores };
        const currentPlayerNames = players.map(p => p.name).filter(name => name);
        // Add new players
        currentPlayerNames.forEach(name => {
            if (!(name in newTotalScores)) {
                newTotalScores[name] = 0;
            }
        });
        // Remove old players (optional, or keep history)
        // For simplicity, we'll just add new ones. A more robust solution would handle name changes/removals.
        setTotalScores(newTotalScores);
    }, [players.map(p => p.name).join(',')]); // Depend on player names
    return (_jsxs("div", { className: "container mx-auto p-4 bg-gray-900 text-white min-h-screen", dir: "rtl", children: [_jsxs("header", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-teal-400", children: "\u0642\u064A\u062F \u0644\u0639\u0628\u0629 \u0627\u0644\u0647\u0646\u062F" }), _jsx(Link, { to: "/strategy-checker", className: "inline-block mt-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded", children: "\u0634\u0646\u0648 \u064A\u0628\u064A\u0644\u064A \u0644\u0644\u0641\u0648\u0632" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-gray-800 p-6 rounded-lg shadow-xl", children: [_jsx("h2", { className: "text-2xl font-semibold mb-6 text-teal-300", children: "\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u062C\u0648\u0644\u0629" }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "handType", className: "block text-lg mb-2 text-gray-300", children: "\u0646\u0648\u0639 \u0627\u0644\u0647\u0627\u0646\u062F:" }), _jsx("select", { id: "handType", value: handType, onChange: (e) => setHandType(e.target.value), className: "w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500", children: Object.entries(HAND_TYPES).map(([key, name]) => (_jsx("option", { value: key, children: name }, key))) })] }), _jsx("h3", { className: "text-xl font-medium mt-6 mb-4 text-gray-300", children: "\u0627\u0644\u0644\u0627\u0639\u0628\u0648\u0646 (4 \u0644\u0627\u0639\u0628\u064A\u0646):" }), players.map((player, index) => (_jsxs("div", { className: "mb-6 p-4 border border-gray-700 rounded-md bg-gray-700/50", children: [_jsxs("label", { htmlFor: `playerName-${player.id}`, className: "block text-md mb-1 text-gray-400", children: ["\u0627\u0633\u0645 \u0627\u0644\u0644\u0627\u0639\u0628 ", index + 1, ":"] }), _jsx("input", { type: "text", id: `playerName-${player.id}`, value: player.name, onChange: (e) => handlePlayerNameChange(player.id, e.target.value), placeholder: `اسم اللاعب ${index + 1}`, className: "w-full p-2 mb-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-teal-500 focus:border-teal-500" }), _jsx("label", { htmlFor: `playerStatus-${player.id}`, className: "block text-md mb-1 text-gray-400", children: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0644\u0627\u0639\u0628:" }), _jsxs("select", { id: `playerStatus-${player.id}`, value: player.status, onChange: (e) => handlePlayerStatusChange(player.id, e.target.value), className: "w-full p-2 mb-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-teal-500 focus:border-teal-500", disabled: player.name === winner, children: [_jsx("option", { value: "", children: "\u0627\u062E\u062A\u0631 \u0627\u0644\u062D\u0627\u0644\u0629" }), player.name !== winner && _jsx("option", { value: PLAYER_STATUSES.WINNER, children: "\u0641\u0627\u0626\u0632" }), " ", _jsx("option", { value: PLAYER_STATUSES.WENT_DOWN, children: "\u0646\u0632\u0644 (\u064A\u062D\u0633\u0628 \u0644\u0647 \u0623\u0648\u0631\u0627\u0642\u0647)" }), _jsx("option", { value: PLAYER_STATUSES.DID_NOT_GO_DOWN, children: "\u0644\u0645 \u064A\u0646\u0632\u0644" }), _jsx("option", { value: PLAYER_STATUSES.MADE_MISTAKE, children: "\u0623\u062E\u0637\u0623" })] }), player.status === PLAYER_STATUSES.WENT_DOWN && (_jsxs(_Fragment, { children: [_jsx("label", { htmlFor: `playerCardValue-${player.id}`, className: "block text-md mb-1 text-gray-400", children: "\u0645\u062C\u0645\u0648\u0639 \u0642\u064A\u0645\u0629 \u0623\u0648\u0631\u0627\u0642 \u0627\u0644\u0644\u0627\u0639\u0628 (\u0634\u0627\u0645\u0644 \u0627\u0644\u062C\u0648\u0643\u0631 20):" }), _jsx("input", { type: "number", id: `playerCardValue-${player.id}`, value: player.cardValueSum, onChange: (e) => handlePlayerCardValueChange(player.id, e.target.value), placeholder: "\u0623\u062F\u062E\u0644 \u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0623\u0648\u0631\u0627\u0642", className: "w-full p-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-teal-500 focus:border-teal-500" })] }))] }, player.id))), _jsxs("div", { className: "mb-6", children: [_jsx("label", { htmlFor: "winner", className: "block text-lg mb-2 text-gray-300", children: "\u0627\u0644\u0644\u0627\u0639\u0628 \u0627\u0644\u0641\u0627\u0626\u0632:" }), _jsxs("select", { id: "winner", value: winner, onChange: (e) => handleWinnerChange(e.target.value), children: [_jsx("option", { value: "", children: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0641\u0627\u0626\u0632" }), players.map(p => {
                                                const name = p.name.trim() || `player${p.id}`;
                                                return (_jsx("option", { value: name, children: name }, p.id));
                                            })] })] }), _jsx("button", { onClick: calculateScores, className: "w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out transform hover:scale-105", children: "\u0627\u062D\u0633\u0628 \u0646\u062A\u0627\u0626\u062C \u0627\u0644\u062C\u0648\u0644\u0629" }), error && _jsxs("p", { className: "text-red-400 mt-4 text-center", children: ["\u062E\u0637\u0623: ", error] })] }), _jsxs("div", { className: "bg-gray-800 p-6 rounded-lg shadow-xl", children: [_jsx("h2", { className: "text-2xl font-semibold mb-6 text-teal-300", children: "\u0627\u0644\u0646\u062A\u0627\u0626\u062C" }), roundScores && (_jsxs("div", { className: "mb-8", children: [_jsx("h3", { className: "text-xl font-medium mb-3 text-gray-300", children: "\u0646\u062A\u0627\u0626\u062C \u0627\u0644\u062C\u0648\u0644\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629:" }), _jsx("ul", { className: "space-y-2", children: Object.entries(roundScores).map(([name, score]) => (_jsxs("li", { className: "flex justify-between p-3 bg-gray-700 rounded-md", children: [_jsxs("span", { className: "font-medium text-gray-200", children: [name, ":"] }), _jsx("span", { className: `font-bold ${score < 0 ? 'text-green-400' : 'text-red-400'}`, children: score })] }, name))) })] })), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-medium mb-3 text-gray-300", children: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0646\u0642\u0627\u0637:" }), Object.keys(totalScores).length > 0 ? (_jsx("ul", { className: "space-y-2", children: Object.entries(totalScores).map(([name, score]) => (_jsxs("li", { className: "flex justify-between p-3 bg-gray-700 rounded-md", children: [_jsxs("span", { className: "font-medium text-gray-200", children: [name, ":"] }), _jsx("span", { className: `font-bold ${score <= 0 ? 'text-green-400' : 'text-red-400'}`, children: score })] }, name))) })) : (_jsx("p", { className: "text-gray-400", children: "\u0644\u0645 \u064A\u062A\u0645 \u062D\u0633\u0627\u0628 \u0623\u064A \u062C\u0648\u0644\u0627\u062A \u0628\u0639\u062F \u0623\u0648 \u0644\u0645 \u064A\u062A\u0645 \u0625\u062F\u062E\u0627\u0644 \u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0644\u0627\u0639\u0628\u064A\u0646." }))] }), neededStrategies && Object.keys(neededStrategies).length > 0 && (_jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-xl font-medium mb-3 text-gray-300", children: "\u0623\u0641\u0636\u0644 \u0646\u0648\u0639 \u0641\u0648\u0632 \u0644\u0643\u0644 \u0644\u0627\u0639\u0628:" }), _jsx("ul", { className: "space-y-2", children: Object.entries(neededStrategies).map(([name, msg]) => (_jsxs("li", { className: "flex justify-between p-3 bg-gray-700 rounded-md", children: [_jsxs("span", { className: "text-gray-200", children: [name, ":"] }), _jsx("span", { className: "font-bold text-yellow-300", children: msg })] }, name))) })] })), _jsx("button", { onClick: () => {
                                    setRoundScores(null);
                                    setTotalScores({});
                                    setPlayers(players.map(p => ({ ...p, status: '', cardValueSum: 0 })));
                                    setWinner('');
                                    setError('');
                                }, className: "w-full mt-6 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out", children: "\u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644 \u0627\u0644\u0646\u0642\u0627\u0637 \u0648\u0627\u0644\u0644\u0627\u0639\u0628\u064A\u0646" })] })] }), _jsx("footer", { className: "text-center mt-12 py-4 border-t border-gray-700", children: _jsx("p", { className: "text-gray-500", children: "\u062A\u0645 \u0627\u0644\u062A\u0637\u0648\u064A\u0631 \u0628\u0648\u0627\u0633\u0637\u0629 Manus AI" }) })] }));
}
export default App;
