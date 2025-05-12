/* globals */

// eslint-disable-next-line no-unused-vars
class wizardEngine{
    constructor(oArraySteps) {
        console.log("construtor");
		const self = this;
        self.arrSteps = oArraySteps;
        self.runV1(self.arrSteps);
	}	
	
    run() {
        console.log("run");
        const self = this;
        console.log(self.arrSteps);
        let i;
        for (i = 0; i < self.arrSteps.length; ++i) {
            console.log(self.arrSteps[i]);
            if (typeof self.arrSteps[i].fx === "function") {
                self.arrSteps[i].fx();
            }
		}	
    }
    
    runV1(tasks) {

        let index = 0;

        function next() {
            if (index < tasks.length) {
                // Get the current function and delay
                const { fx, d } = tasks[index];

                // Execute the current function
                fx();

                // Schedule the next function after the specified delay
                setTimeout(next, d * 1000); // Convert seconds to milliseconds
                index++;
            }
        }

        // Start the process
        next();
    }
}
