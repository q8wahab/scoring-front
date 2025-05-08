import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { calculateNeededStrategies } from "../lib/calculateNeededStrategies";
import { Link } from "react-router-dom";
export default function StrategyCheckerPage() {
    const [inputs, setInputs] = useState({
        player1: '',
        player2: '',
        player3: '',
        player4: ''
    });
    const [results, setResults] = useState(null);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    };
    const handleCalculate = () => {
        const scores = {};
        for (const [key, value] of Object.entries(inputs)) {
            const num = parseInt(value);
            if (isNaN(num)) {
                alert("يرجى إدخال رقم صحيح لكل لاعب");
                return;
            }
            scores[key] = num;
        }
        const result = calculateNeededStrategies(scores);
        setResults(result);
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto p-6 bg-gray-900 text-white min-h-screen", children: [_jsx("h1", { className: "text-3xl font-bold text-center mb-6", children: "\u062D\u0627\u0633\u0628\u0629 \u0646\u0648\u0639 \u0627\u0644\u0641\u0648\u0632 \u0627\u0644\u0645\u0637\u0644\u0648\u0628" }), _jsxs("div", { className: "grid grid-cols-1 gap-4", children: [Object.keys(inputs).map((player) => (_jsxs("div", { children: [_jsxs("label", { className: "block mb-1 text-gray-300", children: [player, ":"] }), _jsx("input", { type: "number", name: player, value: inputs[player], onChange: handleChange, className: "w-full p-2 rounded bg-gray-700 text-white border border-gray-600" })] }, player))), _jsx("button", { onClick: handleCalculate, className: "mt-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded", children: "\u0627\u062D\u0633\u0628" }), _jsx(Link, { to: "/", className: "text-sm text-teal-300 underline mt-2 block", children: "\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629" })] }), results && (_jsxs("div", { className: "mt-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "\u0627\u0644\u0646\u062A\u0627\u0626\u062C:" }), _jsx("ul", { className: "space-y-2", children: Object.entries(results).map(([name, msg]) => (_jsxs("li", { className: "p-3 bg-gray-800 rounded-md", children: [_jsxs("span", { className: "font-bold text-teal-400", children: [name, ":"] }), " ", msg] }, name))) })] }))] }));
}
