//by using a Node.js cluster,it will start up multiple instances of your code to handle even more requests. 
//The functionality of the code is split up in to two parts, the master code and the worker code. This is done in the if-statement (if (cluster.isMaster) {...}). The master's only purpose here is to create all of the workers (the number of workers created is based on the number of CPUs available), and the workers are responsible for running separate instances of the Express server.
//But how are requests divided up between the workers? Obviously they can't (and shouldn't) all be listening and responding to every single request that we get. To handle this, there is actually an embedded load-balancer within the cluster module that handles distributing requests between the different workers. On Linux and OSX (but not Windows) the round-robin (cluster.SCHED_RR) policy is in effect by default. The only other scheduling option available is to leave it up to the operating system (cluster.SCHED_NONE), which is default on Windows.

// The scheduling policy can be set either in cluster.schedulingPolicy or by setting it on the environment variable NODE_CLUSTER_SCHED_POLICY (with values of either 'rr' or 'none').

// When a worker is forked off of the main process, it re-runs the code from the beginning of the module. When the worker gets to the if-statement, it returns false for cluster.isMaster, so instead it'll create the Express app, a route, and then listens on port 8080. In the case of a quad-core processor, we'd have four workers spawned, all listening on the same port for requests to come in.
const cluster = require('cluster');

function startWorker(){
	const worker = cluster.fork();
	//esc5 console.log('CLUSTER: Worker %d started', worker.id);
	console.log(`CLUSTER: Worker ${worker.id} started`);
}
//cluster.isMaster or cluster.isWorker decides in which context your app is running
if(cluster.isMaster){
	require('os').cpus().forEach(()=>{
		startWorker();
	});

	//Record all disconnected worker(工作线程). It should exit if the worker disconnected. so we can wait for exit event and create a new worker to replace it .
	cluster.on('disconnect', (worker)=>{
		console.log(`CLUSTER: Worker ${worker.id} disconnected from the cluster.`);
	});

	//create a new worker to replace it when a old worker dies(drop)
	cluster.on('exit',(worker,code,signal)=>{
		console.log(`CLUSTER: Worker ${worker.id} died with exit code ${code} (${signal})`);
		startWorker();
	});

} else {
	//start our server in this worker, see app.js
	require('./app.js')();
}


