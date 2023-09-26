import Docker from 'dockerode';

export async function scan() {
	const docker = new Docker();

	docker.listContainers(function (err, containers) {
		if (containers?.length) {
			console.table(
				containers.map((container) => {
					const { Id, Names, Created } = container;
					return {
						Id,
						Names: Names[0]?.split('/')[1],
						Created,
					};
				}),
			);
			console.log();
		} else {
			console.error('No containers found!');
		}
	});
	console.log();
}
