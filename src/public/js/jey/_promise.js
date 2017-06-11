var jey = jey || {};

(function(){
    jey.prototype = {
     /**
     *  setTimeout Promise
     * @param {ms}: millionseconds
     *      * usage: 
        delay(5000).then(function () { // (B)
            console.log('5 seconds have passed!')
        });
     * Notice: we can call resolve with zero parameters, which is the same as calling resolve(undefined) if We don’t need the fulfillment value. 
     */        
        delay: function(ms) {
            return new Promise(function (resolve, reject) {
                setTimeout(resolve, ms); // (A)
            });
        },


    /**
     *  mock ajax get method
     * @param {url}: a url
     * usage: 
     *   httpGet('http://example.com/file.txt')
     *              .then(
     *                    function (value) {
     *                      console.log('Contents: ' + value);
     *                 },
     *                function (reason) {
     *                   console.error('Something went wrong', reason);
     *                });
     */     
      get: function(url){
            return new Promise(
                function (resolve, reject) {
                    const request = new XMLHttpRequest();
                    request.onload = function () {
                        if (this.status === 200) {
                            // Success
                            resolve(this.response);
                        } else {
                            // Something went wrong (404 etc.)
                            reject(new Error(this.statusText));
                        }
                    };
                    request.onerror = function () {
                        reject(new Error(
                            'XMLHttpRequest Error: '+this.statusText));
                    };
                    request.open('GET', url);
                    request.send();
            });         
      },
    /**
     *   timing out a Promise
     * @param {ms}: millionseconds
     * @param {promise}: a promise
     * usage: 
            timeout(5000, httpGet('http://example.com/file.txt'))
            .then(function (value) {
                console.log('Contents: ' + value);
            })
            .catch(function (reason) {
                console.error('Error or timeout', reason);
            });
     * Tip: Note that the rejection after the timeout (in line A) does not cancel the request, but it does prevent the Promise being fulfilled with its result.
     */ 
      timeout(ms, promise) {
            return new Promise(function (resolve, reject) {
                promise.then(resolve);
                setTimeout(function () {
                    reject(new Error('Timeout after '+ms+' ms')); // (A)
                }, ms);
            });
     },      



    };
})();

