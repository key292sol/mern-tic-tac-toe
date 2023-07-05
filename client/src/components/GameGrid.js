import React from 'react';

function GameGrid({ gridState, disable, handleClick }) {
	let count = 0;
	return (
		<div className='game-grid'>
			{gridState.map((row) => {
				return row.map((val) => {
					let r = parseInt(count / 3),
						c = count % 3;
					count++;
					return (
						<button
							className={`grid-cell ${val && 'filled'} ${val}`}
							key={count}
							disabled={disable || val !== ''}
							onClick={() => handleClick(r, c)}
						>
							<span>{val}</span>
						</button>
					);
				});
			})}
		</div>
	);
}

export default GameGrid;
