/*** read write and execute files ***/

/**
 * 1, read and write compeletely
**/


/**
 *  file <String> filename
    options <Object> | <String>
        encoding <String>:utf8 ascii base64 | <Null> default = null
        flag <String> default = 'r'
                Flag	Description
                'r' - Open file for reading. An exception occurs if the file does not exist.

                'r+' - Open file for reading and writing. An exception occurs if the file does not exist.

                'rs' - Open file for reading in synchronous mode. Instructs the operating system to bypass the local file system cache.

                This is primarily useful for opening files on NFS mounts as it allows you to skip the potentially stale local cache. It has a very real impact on I/O performance so don't use this flag unless you need it.

                Note that this doesn't turn fs.open() into a synchronous blocking call. If that's what you want then you should be using fs.openSync()

                'rs+' - Open file for reading and writing, telling the OS to open it synchronously. See notes for 'rs' about using this with caution.

                'w' - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).

                'wx' - Like 'w' but fails if path exists.

                'w+' - Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).

                'wx+' - Like 'w+' but fails if path exists.

                'a' - Open file for appending. The file is created if it does not exist.

                'ax' - Like 'a' but fails if path exists.

                'a+' - Open file for reading and appending. The file is created if it does not exist.

                'ax+' - Like 'a+' but fails if path exists.     
    callback <Function>
 **/
fs.readFile(file[, options], callback)
// Asynchronously reads the entire contents of a file. Example:

                fs.readFile('/etc/passwd', (err, data) => {
                    if (err) throw err;
                    console.log(data);//raw buffer
                    console.log(data.toString());//the same like using utf8
                });
            // The callback is passed two arguments (err, data), where data is the contents of the file.
            // If no encoding is specified, then the raw buffer is returned.
            // If options is a string, then it specifies the encoding. Example:

            fs.readFile('/etc/passwd', 'utf8', callback);


fs.readFileSync(file[, options])#
             try{
                 var data = fa.readFileSync('./test.txt','utf8');
                 console.log(data);
             }catch(ex){
                 console.log(`something wrong with reading the file ${ex}`);
             }
// Added in: v0.1.8
// Synchronous version of fs.readFile. Returns the contents of the file.

// If the encoding option is specified then this function returns a string. Otherwise it returns a buffer.






/**
 * 
 * Asynchronously writes data to a file, replacing the file if it already exists. data can be a string or a buffer.
The encoding option is ignored if data is a buffer. It defaults to 'utf8'.
Note that it is unsafe to use fs.writeFile multiple times on the same file without waiting for the callback. For this scenario, fs.createWriteStream is strongly recommended.
 //If options is a string, then it specifies the encoding. Example:
fs.writeFile('message.txt', 'Hello Node.js', 'utf8', callback);

fs.writeFile(file, data[, options], callback)
 *  file <String> filename 指定需要被写入文件的完整文件路径及文件名
    data <String> | <Buffer> 需要写入的内容，字符串或Buffer对象，该字符串或缓存区中内容将被完整地写入到文件中
    options <Object> | <String>
        encoding <String> | <Null> default = 'utf8' 用何种编码格式来写入该文件，当data参数值为一个Buffer对象时该属性被忽略，使用默认utf8来执行文件的写入
        mode <Number> default = 0o666
            用于指定当文件被打开时对该文件的读写权限，默认值0666（可读写）。该属性值及fs模块中的各方法中mode的参数值得指定方法均如下：
              使用4个数值组成mode属性值或mode参数值，其中
                第一个数值必须是0，
                第二个数值用于规定文件或目录所有者的权限，
                第三个数字用于规定文件或目录所有者所属用户组的权限，
                第四个数字规定其他人的权限。
            可设定权限如下：
                1： 执行权限
                2： 写权限
                3： 读权限
            如需要设置读写等复合权限，可以对以上三个数字进行加运算，如2+4=6来设置读写权限
        flag <String>可指定值与上readfile同 default = 'w'（默认‘w’,文件不存在时创建该文件，文件已存在时重写该文件）
    callback <Function> param:err
 * 
 **/

//create message.txt and write two lines of sentences
 fs.writeFile('./message.txt','this is the first line. \r\n thsi is the sencodn.',function(err){
     if(err){console.log(`something wrong when writing files: ${err}`)}else{
         console.log('writing files successfully');
     }
 });

 //在文件中写入缓存区中的数据
 var data = new Buffer('我喜爱编程');
 fs.writeFile('./message.txt',data,function(err){
     if(err){console.log(`something wrong when writing files: ${err}`)}else{
         console.log('writing files successfully');
     }
 });

 //在文件message.txt中追加‘这是追加的数据’
 var options = {
     flag:'a',
 };
 fs.writeFile('./message.txt','这是追加的数据',options, function(err){
     if(err){console.log(`something wrong when writing files: ${err}`)}else{
         console.log('writing files successfully');
     }
 });

 //图片复制
 fs.readFile('./a.gif','base64',function(err,data){
     fs.writeFile('./b.gif',data.toString(),'base64',function(err){
        if(err){console.log(`something wrong when writing files: ${err}`)}else{
            console.log('writing files successfully');
        }
     });
 });

fs.writeFileSync(file, data[, options])#
// The synchronous version of fs.writeFile(). Returns undefined.



/**
 * 将一个字符串或一个缓存区中的数据追加到一个文件底部
 * fs.appendFile(file, data[, options], callback)
 *  file <String> filename
    data <String> | <Buffer>
    options <Object> | <String>
        encoding <String> | <Null> default = 'utf8'
        mode <Number> default = 0o666
        flag <String> default = 'a'（Open file for appending. The file is created if it does not exist.）
    callback <Function>
 */
    fs.appendFile('./message.txt', 'this is the added data','utf8',function(err){
     if(err){console.log(`something wrong when adding data to the file: ${err}`)}else{
         console.log('Adding data to the file successfully');
     }
    });

   fs.appendFileSync(file, data[, options])#
  //The synchronous version of fs.appendFile(). Returns undefined.




  /**
   * 2 从指定位置处开始读写文件
   *    首先需要用open或openSync方法打开文件
   */


/**
 * fs.open(path, flags[, mode], callback)
 * callback (err,fd){}
 *  path flags mode 与readFile中filename,options参数中的flags 和mode属性值同
 * mode sets the file mode (permission and sticky bits), but only if the file was created. It defaults to 0666, readable and writable.

    The callback gets two arguments (err, fd).

    The exclusive flag 'x' (O_EXCL flag in open(2)) ensures that path is newly created. On POSIX systems, path is considered to exist even if it is a symlink to a non-existent file. The exclusive flag may or may not work with network file systems.

    flags can also be a number as documented by open(2); commonly used constants are available from require('constants'). On Windows, flags are translated to their equivalent ones where applicable, e.g. O_WRONLY to FILE_GENERIC_WRITE, or O_EXCL|O_CREAT to CREATE_NEW, as accepted by CreateFileW.

    On Linux, positional writes don't work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
 */

 


