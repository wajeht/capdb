import Docker from 'dockerode';

export async function scan() {
	const docker = new Docker();

	console.log();
	docker.listContainers(function (err, containers) {
		if (containers?.length) {
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
			console.error('No containers found!');
		}
	});
	console.log();
}
