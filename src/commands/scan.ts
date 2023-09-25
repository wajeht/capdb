import Docker from 'dockerode';

export async function scan() {
	const docker = new Docker();

	console.log();
	docker.listContainers(function (err, containers) {
		if (containers) {
			console.table(
				containers.map((container) => {
					const { Id, Names, Created } = container;
					return {
						Id,
						Names,
						Created,
					};
				}),
			);
		} else {
			console.error('Error fetching container information:', err);
		}
	});
	console.log();
}
