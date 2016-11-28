/******* zero down-time servers using workers && scaling up the applications by spliting a single process into multiple processes or workers********/
//####inspired by link:https://www.sitepoint.com/how-to-create-a-node-js-cluster-for-speeding-up-your-apps/
//####and web development with node and express by Ethan Brown #p117

//KNOWLEDAGE POINTS:
//by using a Node.js cluster,it will start up multiple instances of your code to handle even more requests. 
//The functionality of the code is split up in to two parts, the master code and the worker code. This is done in the if-statement (if (cluster.isMaster) {...}). The master's only purpose here is to create all of the workers (the number of workers created is based on the number of CPUs available), and the workers are responsible for running separate instances of the Express server.
//But how are requests divided up between the workers? Obviously they can't (and shouldn't) all be listening and responding to every single request that we get. To handle this, there is actually an embedded load-balancer within the cluster module that handles distributing requests between the different workers. On Linux and OSX (but not Windows) the round-robin (cluster.SCHED_RR) policy is in effect by default. The only other scheduling option available is to leave it up to the operating system (cluster.SCHED_NONE), which is default on Windows.

// The scheduling policy can be set either in cluster.schedulingPolicy or by setting it on the environment variable NODE_CLUSTER_SCHED_POLICY (with values of either 'rr' or 'none').

// When a worker is forked off of the main process, it re-runs the code from the beginning of the module. When the worker gets to the if-statement, it returns false for cluster.isMaster, so instead it'll create the Express app, a route, and then listens on port 8080. In the case of a quad-core processor, we'd have four workers spawned, all listening on the same port for requests to come in.

//Each Node.js process runs in a single thread and by default it has a memory limit of 512MB on 32-bit systems and 1GB on 64-bit systems. Although the memory limit can be bumped to ~1GB on 32-bit systems and ~1.7GB on 64-bit systems, both memory and processing power can still become bottlenecks for various processes.

//A cluster is a pool of similar workers running under a parent Node process. Workers are spawned using the fork() method of the child_processes module. This means workers can share server handles and use IPC (Inter-process communication) to communicate with the parent Node process.

// the master process is in charge of initiating workers and controlling them. You can create an arbitrary number of workers in your master process. Moreover, remember that by default incoming connections are distributed in a round-robin approach among workers (except in Windows). Actually there is another approach to distribute incoming connections, that I won’t discuss here, which hands the assignment over to the OS (default in Windows). Node.js documentation suggests using the default round-robin style as the scheduling policy.

// The elegant solution Node.js provides for scaling up the applications is to split a single process into multiple processes or workers, in Node.js terminology. This can be achieved through a cluster module. The cluster module allows you to create child processes (workers), which share all the server ports with the main Node process (master).

const cluster = require('cluster');//NODEJS CONTAINS CLUSTER MODULE SO WE CAN ALSO NOT USE THE npm install cluster to use it.but seems npm install cluster to use it ,which has more functions...
const numCPUs = require('os').cpus();
const stopWorkers = function stopWorkers() {
	//One important result that can be achieved using workers is (almost) zero down-time servers. Within the master process, you can terminate and restart the workers one at a time, after you make changes to your application. This allows you to have older version running, while loading the new one.

	//We can get the ID of all the running workers from the workers object in the cluster module. This object keeps a reference to all the running workers and is dynamically updated when workers are terminated and restarted. First we store the ID of all the running workers in a workerIds array. This way, we avoid restarting newly forked workers.
    //Then, we request a safe shutdown from each worker. If after 5 seconds the worker is still running and it still exists in the workers object, we then call the kill function on the worker to force it shutdown
		var wid, 
		    workerIds = [];

		// create a copy of current running worker ids
		//To do this for all the workers, you can use the workers property of the cluster module that keeps a reference to all the running workers
		for(wid in cluster.workers) {
			workerIds.push(wid);
		}

		workerIds.forEach(function(wid) {
			//To send a message from the master to a specific worker
			//My suggestion for restarting your workers is to try to shut them down safely first; then, if they did not safely terminate, forcing to kill them. You can do the former by sending a shutdown message to the worker
			cluster.workers[wid].send({
				text: 'shutdown',
				from: 'master'
			});

			setTimeout(function() {
				if(cluster.workers[wid]) {
					cluster.workers[wid].kill('SIGKILL');
				}
			}, 5000);
		});
};



function startWorker(){
	const worker = cluster.fork();
	//esc5 console.log('CLUSTER: Worker %d started', worker.id);

	//?
	//To listen for messages from the work in a master
	worker.on('message', function() {
		console.log('arguments', arguments);
	});	
	console.log(`CLUSTER: Worker ${worker.id} started`);
}

//cluster.isMaster or cluster.isWorker decides in which context your app is running
if(cluster.isMaster){
	// returns an array of CPU cores
	const fs = require('fs');

	numCPUs.forEach(()=>{
		startWorker();
	});


	// set up listener of file changes for restarting workers
	fs.readdir('.', function(err, files) {
		files.forEach(function(file) {
			fs.watch(file, function() {
				stopWorkers();
			});
		});
	});


	//Record all disconnected worker(工作线程). It should exit if the worker disconnected. so we can wait for exit event and create a new worker to replace it .
	cluster.on('disconnect', (_worker)=>{
		console.log(`CLUSTER: Worker ${_worker.process.pid} disconnected from the cluster.`);
	});

     //In this example, I also set a listener for an online event, which is emitted whenever a worker is forked and ready to receive incoming requests. This can be used for logging or other operations.
	cluster.on('online', function(_worker) {
        console.log('Worker ' + _worker.process.pid + ' is online');
    });

	//create a new worker to replace it when a old worker dies(drop)
	//When a worker dies, the cluster module emits an exit event
	//In the callback, we fork a new worker in order to maintain the intended number of workers. This allows us to keep the application running, even if there are some unhandled exceptions.
	cluster.on('exit',(_worker,code,signal)=>{
		console.log(`CLUSTER: Worker ${_worker.process.pid} died with exit code ${code} (${signal})`);
		console.log('starting a new worker...');
		startWorker();
	});

} else {
	//To listen for messages from the master in a worker
	process.on('message', function(message) {
		if(message.type === 'shutdown') {
			process.exit(0);
		}
	});
	console.log('Worker ' + process.pid + ' is alive!');

	//start our server in this worker, see app.js
	require('./app.js')();
}


