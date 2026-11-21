import React from 'react';

type MapStyleButtonProps = {
    style: string;
    label: string;
    isSelected: boolean;
    onClick: () => void;
};

export default function MapStyleButton({ style, label, isSelected, onClick }: MapStyleButtonProps) {
    const baseClass = "px-3 py-1 rounded text-sm transition-all";
    const selectedClass = isSelected ? "ring-2 ring-blue-500 shadow-md" : "";

    let styleClass = "";
    switch (style) {
        case "light":
            styleClass = "bg-gray-200 text-gray-800 hover:bg-gray-300";
            break;
        case "dark":
            styleClass = "bg-gray-800 text-white hover:bg-gray-700";
            break;
        case "satellite":
            styleClass = "bg-green-600 text-white hover:bg-green-700";
            break;
        case "osm":
            styleClass = "bg-blue-600 text-white hover:bg-blue-700";
            break;
        case "terrain":
            styleClass = "bg-amber-600 text-white hover:bg-amber-700";
            break;
        case "watercolor":
            styleClass = "bg-teal-500 text-white hover:bg-teal-600";
            break;
        case "topo":
            styleClass = "bg-indigo-500 text-white hover:bg-indigo-600";
            break;
        case "toner":
            styleClass = "bg-gray-700 text-white hover:bg-gray-600";
            break;
        case "open_topo":
            styleClass = "bg-emerald-600 text-white hover:bg-emerald-700";
            break;
        case "positron":
            styleClass = "bg-slate-300 text-slate-800 hover:bg-slate-400";
            break;
        case "arcgis_gray":
            styleClass = "bg-slate-400 text-white hover:bg-slate-500";
            break;
        case "arcgis_ocean":
            styleClass = "bg-cyan-600 text-white hover:bg-cyan-700";
            break;
        case "arcgis_relief":
            styleClass = "bg-stone-500 text-white hover:bg-stone-600";
            break;
        default:
            styleClass = "bg-gray-400 text-white hover:bg-gray-500";
    }

    return (
        <button
            onClick={onClick}
            className={`${baseClass} ${styleClass} ${selectedClass}`}
        >
            {label}
        </button>
    );
}