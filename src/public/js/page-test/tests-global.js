/**
 * Created by frank25184 on 7/14/16.
 */
suite("Global Tests", function(){
   test('page has a valid title', function(){
       assert(document.title && document.title.match(/\S/) && document.title.toUpperCase() !== 'TODO');
   });
});
//ABOVE, TEST TO SEE IF THE PAGE HAS THE VALID TITLE

