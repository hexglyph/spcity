import React from 'react';

interface GridCellActionProps {
    x: number;
    y: number;
    onAction: (x: number, y: number) => void;
}

const GridCellAction: React.FC<GridCellActionProps> = ({ x, y, onAction }) => {
    return (
        <div
            className="absolute bg-white border border-gray-300 rounded-md shadow-md p-2 z-[2000]"
            style={{ left: `${x}px`, top: `${y}px` }}
        >
            <button
                className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => onAction(x, y)}
            >
                Interact with cell
            </button>
        </div>
    );
};

export default GridCellAction;

