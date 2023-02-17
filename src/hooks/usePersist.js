import React from 'react';

const usePersist = () => {
	const [persist, setPersist] = React.useState(JSON.parse(localStorage.getItem("persist")) || false);

	React.useEffect(() => {
		localStorage.setItem("persist", JSON.stringify(persist))
	}, [persist]);

	return [persist, setPersist];
}

export default usePersist